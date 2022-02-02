from flask_app import app
from flask import render_template, request, session, jsonify, json
from ..models import user_model

@app.route('/')
def rat_king():
    return render_template('index.html')


@app.route("/save", methods = ['post'])
def cloudsave():
    save = request.form['save']
    # print(save)
    user_model.User.update_save({'save': save})
    return jsonify({'status':'success'})

@app.route("/load")
def cloudload():
    save = user_model.User.get_by_id(1).save
    # print(save)
    print('sending db query to client')
    return jsonify(save)