from flask import jsonify, request

@app.route("/processInputs", methods=["GET", "POST"])

@app.route("/processInputs", methods=["GET", "POST"])
def analyzeInputs():
    if request.method == "POST":
        preset = 0
        use_gui = "n"
        main(use_gui, preset)