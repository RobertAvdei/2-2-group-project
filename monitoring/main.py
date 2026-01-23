from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

STORAGE_LOG_URL = "http://storage:3001/log"

@app.route("/")
def hello_world():
    return "<p>Hello, Monitoring!</p>"

@app.route("/log", methods=["POST"])
def log():
    data = request.get_json(silent=True) or {}


    try:
        requests.post(STORAGE_LOG_URL, json=data, timeout=2)
    except:

        pass

    return jsonify({"ok": True}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3003, debug=True)
