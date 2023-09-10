from flask import Flask, render_template, request, redirect, url_for
import os

os.environ["PYTHON_VERSION"] = "3.11.0"

app = Flask(__name__)


@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("index.html")


@app.route("/carrinho", methods=["POST", "GET"])
def carrinho():
    try:
        sacola = request.form["sacola"]
    except KeyError:
        sacola = ""
    return render_template("carrinho_compras.html", itens=sacola)


if __name__ == "__main__":
    app.run(debug=True)
