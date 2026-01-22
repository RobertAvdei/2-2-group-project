from flask import Flask, request, jsonify
import os, uuid, time
import psycopg2
from psycopg2.extras import RealDictCursor
from minio import Minio
from minio.error import S3Error

app = Flask(__name__)


DATABASE_URL = os.getenv("DATABASE_URL")
MINIO_HOST = os.getenv("MINIO_HOST", "minio")
MINIO_PORT = os.getenv("MINIO_PORT", "9000")
MINIO_USER = os.getenv("MINIO_ROOT_USER", "minio")
MINIO_PASS = os.getenv("MINIO_ROOT_PASSWORD", "minio123")
BUCKET = os.getenv("STORAGE_BUCKET", "user-images")

def db_conn():
    return psycopg2.connect(DATABASE_URL)

def minio_client():
    return Minio(
        endpoint=f"{MINIO_HOST}:{MINIO_PORT}",
        access_key=MINIO_USER,
        secret_key=MINIO_PASS,
        secure=False
    )

def ensure_bucket():
    client = minio_client()
    if not client.bucket_exists(BUCKET):
        client.make_bucket(BUCKET)


def init_tables():
    with db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS requests (
                    request_id TEXT PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT NOW(),
                    filename TEXT,
                    content_type TEXT,
                    file_size_bytes INTEGER,
                    image_key TEXT
                );
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS logs (
                    id SERIAL PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT NOW(),
                    service TEXT,
                    endpoint TEXT,
                    latency_ms INTEGER,
                    success BOOLEAN,
                    request_id TEXT,
                    image_key TEXT
                );
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id SERIAL PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT NOW(),
                    request_id TEXT,
                    rating BOOLEAN,              -- true=positive, false=negative
                    expected_text TEXT
                );
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS model_meta (
                    id INTEGER PRIMARY KEY,
                    model_name TEXT,
                    avg_confidence REAL,
                    retrain_count INTEGER
                );
            """)


            cur.execute("SELECT COUNT(*) FROM model_meta WHERE id=1;")
            count = cur.fetchone()[0]
            if count == 0:
                cur.execute("""
                    INSERT INTO model_meta (id, model_name, avg_confidence, retrain_count)
                    VALUES (1, 'EasyOCR', 0.0, 0);
                """)
        conn.commit()



@app.route("/")
def home():
    return "<p>Hello, Storage!</p>"


@app.route("/image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"ok": False, "error": "No image file"}), 400

    file = request.files["image"]
    content_type = file.content_type or "application/octet-stream"
    filename = file.filename or "upload.bin"


    data = file.read()
    size = len(data)

    request_id = str(uuid.uuid4())
    image_key = f"{request_id}_{filename}"

    try:
        ensure_bucket()
        client = minio_client()
        import io
        client.put_object(
            BUCKET,
            image_key,
            io.BytesIO(data),
            length=size,
            content_type=content_type
        )
    except S3Error as e:
        return jsonify({"ok": False, "error": f"MinIO upload failed: {str(e)}"}), 500


    with db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO requests (request_id, filename, content_type, file_size_bytes, image_key)
                VALUES (%s, %s, %s, %s, %s);
            """, (request_id, filename, content_type, size, image_key))
        conn.commit()

    return jsonify({
        "ok": True,
        "request_id": request_id,
        "image_key": image_key,
        "bucket": BUCKET
    }), 200


@app.route("/log", methods=["POST"])
def insert_log():
    data = request.get_json(silent=True) or {}

    service = data.get("service")
    endpoint = data.get("endpoint")
    latency_ms = data.get("latency_ms")
    success = data.get("success", True)
    request_id = data.get("request_id")
    image_key = data.get("image_key")

    with db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO logs (service, endpoint, latency_ms, success, request_id, image_key)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, (service, endpoint, latency_ms, success, request_id, image_key))
        conn.commit()

    return jsonify({"ok": True}), 200

@app.route("/feedback", methods=["POST"])
def add_feedback():
    data = request.get_json(silent=True) or {}
    request_id = data.get("request_id")
    rating = data.get("rating") 
    expected_text = data.get("expected_text")

    if not request_id or rating not in ["positive", "negative"]:
        return jsonify({"ok": False, "error": "request_id + rating (positive/negative) required"}), 400

    with db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO feedback (request_id, rating, expected_text)
                VALUES (%s, %s, %s);
            """, (request_id, rating, expected_text))
        conn.commit()

    return jsonify({"ok": True}), 200


@app.route("/model", methods=["GET", "PUT"])
def model_info():
    if request.method == "GET":
        with db_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT model_name, avg_confidence FROM model_meta WHERE id=1;")
                row = cur.fetchone()
        return jsonify({"ok": True, "model": row}), 200

    # PUT (update)
    data = request.get_json(silent=True) or {}
    model_name = data.get("model_name")
    avg_confidence = data.get("avg_confidence")

    with db_conn() as conn:
        with conn.cursor() as cur:
            if model_name is not None:
                cur.execute("UPDATE model_meta SET model_name=%s WHERE id=1;", (model_name,))
            if avg_confidence is not None:
                cur.execute("UPDATE model_meta SET avg_confidence=%s WHERE id=1;", (avg_confidence,))
        conn.commit()

    return jsonify({"ok": True}), 200

@app.route("/retrain", methods=["GET", "POST"])
def retrain_count():
    if request.method == "GET":
        with db_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT retrain_count FROM model_meta WHERE id=1;")
                row = cur.fetchone()
        return jsonify({"ok": True, "retrain_count": row["retrain_count"]}), 200


    with db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE model_meta SET retrain_count = retrain_count + 1 WHERE id=1;")
        conn.commit()

    return jsonify({"ok": True}), 200


@app.route("/logs", methods=["GET"])
def get_logs():
    limit = int(request.args.get("limit", 200))
    with db_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT * FROM logs
                ORDER BY created_at DESC
                LIMIT %s;
            """, (limit,))
            rows = cur.fetchall()
    return jsonify({"ok": True, "logs": rows}), 200

@app.route("/images", methods=["GET"])
def list_images():
    ensure_bucket()
    client = minio_client()
    objects = []
    for obj in client.list_objects(BUCKET, recursive=True):
        objects.append({"object_name": obj.object_name, "size": obj.size, "last_modified": str(obj.last_modified)})
    return jsonify({"ok": True, "bucket": BUCKET, "images": objects}), 200



if __name__ == "__main__":
    init_tables()
    app.run(host="0.0.0.0", port=3001, debug=True)
