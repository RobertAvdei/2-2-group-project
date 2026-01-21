from flask import Flask, request, jsonify
import requests
import time

app = Flask(__name__)

STORAGAE_URL = "http://storage:3001/image"
MONITORING_URL = "http://monitoring:3003/log"


@app.route("/")
def hello_world():
    return "<p>Hello, Serving!</p>"

@app.route("/upload", methods=["POST"])
def upload():
    start = time.time()

    if "image" not in request.files:
        return jsonify({"ok": False, "error": "No image"}), 400
    
    image = request.files["image"]

    files = {"image": (image.filename, image.read(), image.content_type)}
    requests.post(STORAGAE_URL, files=files)

    latency_ms = int((time.time() - start) * 1000)

    try:
        requests.post(MONITORING_URL, json={
            "service": "serving",
            "endpoint": "/upload",
            "latency_ms": latency_ms,
            "success": True
    })
    except:
        pass

    return jsonify({
        "ok": True,
        "message": "image uploaded successfully"
    }), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3002, debug=True)


"""
basic serving endpoint
receives image uploads
forwards images to storage service
sends logs to monitoring service
returns json response
""" 