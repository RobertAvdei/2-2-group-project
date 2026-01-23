from flask import Flask, request, jsonify
from trainer import main
import requests

app = Flask(__name__)

STORAGE_LOG_URL = "http://storage:3001/retrain"

@app.route("/")
def hello_world():
    return "<p>Hello, training!</p>"

@app.route("/train", methods=["GET"])
def start_train():

    try:
        #Start training
        train_time = main()
        print("AFTER MAIN")
    except Exception as e:
        raise e
    else:
        pass

    try:
        requests.post(STORAGE_LOG_URL, json={'trainTime':train_time}, timeout=2)
    except:

        pass

    return jsonify({"ok": True, 'trainTime':train_time}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3004, debug=True)
