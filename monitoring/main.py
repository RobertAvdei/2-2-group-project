from flask import Flask, request, jsonify

app = Flask(__name__)
LOGS = []
@app.route("/")
def hello_world():
    return "<p>Hello, Monitoring!</p>"

@app.route("/log", methods=["POST"])
def log():
    data = request.get_json(silent=True)or {}
    LOGS.append(data)
    if len(LOGS) > 100:
        LOGS.pop(0) 
    return jsonify({"ok": True}), 200

@app.route("/logs", methods=["GET"])
def get_logs():
    return jsonify({"ok": True, "logs": LOGS}), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3003, debug=True)