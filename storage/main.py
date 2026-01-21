from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
import os
import time

app = Flask(__name__)

# Read DATABASE_URL from docker-compose
DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    raise RuntimeError("DATABASE_URL is not set. Add it in docker-compose for storage.")

# Retry because postgres can take a few seconds to become ready
def create_engine_with_retry(retries=10, sleep_s=2):
    last_err = None
    for _ in range(retries):
        try:
            engine = create_engine(DB_URL, pool_pre_ping=True)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return engine
        except Exception as e:
            last_err = e
            time.sleep(sleep_s)
    raise last_err

engine = create_engine_with_retry()

# MINIO for images but informatioon about images stored in Postgres
with engine.begin() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS images (
            id SERIAL PRIMARY KEY,
            filename TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """))

    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS logs (
            id SERIAL PRIMARY KEY,
            service TEXT,
            endpoint TEXT,
            latency_ms INTEGER,
            success BOOLEAN,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """))


@app.route("/")
def hello_world():
    return "<p>Hello, Storage!</p>"


@app.route("/image", methods=["POST"])
def image():
    if "image" not in request.files:
        return jsonify({"ok": False, "error": "No image provided"}), 400

    img = request.files["image"]

    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO images (filename) VALUES (:filename)"),
            {"filename": img.filename}
        )

    return jsonify({"ok": True, "filename": img.filename}), 200


@app.route("/log", methods=["POST"])
def store_log():
    data = request.get_json(silent=True) or {}

    with engine.begin() as conn:
        conn.execute(
            text("""
                INSERT INTO logs (service, endpoint, latency_ms, success)
                VALUES (:service, :endpoint, :latency_ms, :success)
            """),
            {
                "service": data.get("service"),
                "endpoint": data.get("endpoint"),
                "latency_ms": data.get("latency_ms"),
                "success": data.get("success")
            }
        )

    return jsonify({"ok": True}), 200


@app.route("/logs", methods=["GET"])
def get_logs():
    limit = request.args.get("limit", "100")
    try:
        limit = int(limit)
    except:
        limit = 100

    with engine.connect() as conn:
        rows = conn.execute(
            text("""
                SELECT id, service, endpoint, latency_ms, success, created_at
                FROM logs
                ORDER BY id DESC
                LIMIT :limit
            """),
            {"limit": limit}
        ).mappings().all()

    return jsonify({"ok": True, "logs": [dict(r) for r in rows]}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
