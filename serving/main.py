from flask import Flask, request, jsonify
import requests
import time
from flask_cors import CORS, cross_origin
import mlflow
import easyocr
from PIL import Image

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
STORAGE_URL = "http://localhost:3001/image"
MONITORING_URL = "http://localhost:3003/log"
reader = easyocr.Reader(['en']) # this needs to run only once to load the model into memory


@app.route("/")
def hello():
    return "<p>Hello, Serving!</p>"
 
@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():
    print('Received Request /upload')
    start = time.time()

    if "image" not in request.files:
        return jsonify({"ok": False, "error": "No image"}), 400

    image = request.files["image"]
    files = {"image": (image.filename, image.read(), image.content_type)}

    request_id = None
    image_key = None
    ok = True
    error_msg = None
    img = Image.open(image)
    # print(img.tobytes())
    try:
        print('Loading Model')
        # mlflow.set_tracking_uri("http://localhost:5000")
        # mlflow.set_experiment("easy-ocr")
        # loaded_model = mlflow.pytorch.load_model(model_uri=f"models:/champion/latest")
        # print(loaded_model)
        result = reader.readtext(img,detail = 0)
        print(result)
    except Exception as e:
        print('Failed to run model')
        print(e)
        return jsonify({"ok": False, "error": "Failed to Run Model"}), 500
    

    try:
        resp = requests.post(STORAGE_URL, files=files, timeout=10)
        print('resp',resp)
        if resp.headers.get("content-type", "").startswith("application/json"):
            storage_data = resp.json()
            request_id = storage_data.get("request_id")
            image_key = storage_data.get("image_key")

        if resp.status_code >= 400:
            ok = False
            error_msg = f"Storage error: {resp.status_code}"
    except Exception as e:
        ok = False
        error_msg = f"Storage request failed: {str(e)}"

    latency_ms = int((time.time() - start) * 1000)

    try:
        requests.post(MONITORING_URL, json={
            "service": "serving",
            "endpoint": "/upload",
            "latency_ms": latency_ms,
            "success": ok,
            "request_id": request_id,
            "image_key": image_key,
            "error": error_msg
        }, timeout=2)
    except:
        pass

    if not ok:
        return jsonify({
            "ok": False,
            "error": error_msg
        }), 500

    return jsonify({
        "ok": True,
        "message": "image uploaded successfully",
        "request_id": request_id,
        "image_key": image_key,
        'prediction': result
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3002, debug=True)
