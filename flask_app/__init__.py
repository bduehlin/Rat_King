from flask import Flask
from flask_bcrypt import Bcrypt   

app = Flask(__name__)
app.secret_key = "Let's try something new."

bcrypt = Bcrypt(app)

DATABASE = 'rat_king'
