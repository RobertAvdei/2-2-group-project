from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, Storage!</p>"

@app.route("/image", methods=["POST"])
def image():
    if "image" not in request.files:
        return jsonify({"ok": False, "error": "No image provided"}), 400
    img= request.files["image"]

    return jsonify({"ok": True, "filename": img.filename}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3001, debug=True)