from flask_app import app, bcrypt
from flask import render_template, request, session, jsonify, json, redirect 
from ..models import user_model

@app.route('/')
def rat_king():
    return render_template('index.html')

@app.route("/save", methods = ['post'])
def cloudsave():
    if(session['id'] != 'Guest'):
        save = request.form['save']
        user_model.User.update_save({'save': save, 'id': session['id']})
        return jsonify({'status':'Successful cloud save'})
    else:
        return jsonify({'status':'Guest cloud save not allowed'})

@app.route("/load")
def cloudload():
    if(session['id'] != 'Guest'):
        save = user_model.User.get_by_id(session['id']).save
        print('sending db query to client')
        return jsonify(save)
    else:
        return jsonify({'status':'Guest cloud load not allowed'})

@app.route("/login", methods = ['post'])
def login():
    validate = user_model.User.login_validator(request.form)
    if not validate:
        return jsonify({'message': 'Login unsuccessful, your provided credentials are not accurate.'})
    session['id'] = validate.id
    return jsonify({'message':'Log in successful'})

@app.route("/logout")
def logout():
    session.clear()
    return redirect('/')


@app.route("/create", methods = ['post'])
def create():
    validate = user_model.User.create_validator(request.form)
    if not validate:
        return jsonify({'message': 'Register unsuccessful, your provided credentials are not valid. Email must not be taken and password must be at least 8 characters.'})
    data = {
        **request.form
    }
    data['password_hash'] = bcrypt.generate_password_hash(data['password'])
    data.pop('password')
    data.pop('password_confirm')
    session['id'] = user_model.User.insert(data)
    return jsonify({'message': 'Register successful'})

@app.route("/guest")
def guest():
    session['id'] = 'Guest'
    return redirect('/')
