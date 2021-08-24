from flask import Flask, render_template, request, flash, make_response, jsonify
from werkzeug.utils import secure_filename
from os import path

server = Flask(__name__, template_folder="./public", static_folder="./public")
server.uploads_dir = "uploads"


@server.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST" and 'file' in request.files:
        files = request.files.getlist("file")
        for file in files:
            filename = secure_filename(file.filename)
            file.save(path.join(server.uploads_dir, filename))

        print(len(files), "File(s) Recived\n")

        res = make_response(jsonify({"message": "File uploaded"}), 200)

        return res

    return render_template("index.html")


server.run(host="0.0.0.0", port="8080")
