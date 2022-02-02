from flask_app.config.mysqlconnection import connectToMySQL
import re
from flask import flash
from flask_app import DATABASE, bcrypt

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$') 


class User:
    def __init__( self , data ):
        self.id = data['id']
        self.email = data['email']
        self.password_hash = data['password_hash']
        self.save = data['save']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

# CRUD methods
    @classmethod
    def insert(cls, data):
        query = "INSERT INTO users (email, password_hash, save ) VALUES ( %(email)s, %(password_hash)s, ('{}') );"
        return connectToMySQL(DATABASE).query_db(query, data)

    # @classmethod
    # def get_all(cls):
    #     query = "SELECT * FROM users;"
    #     results = connectToMySQL(DATABASE).query_db(query)
    #     users = []
    #     for result in results:
    #         users.append(cls(result))
    #     return users

    @classmethod
    def get_by_email(cls, email):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        data = {
            'email' : email
        }
        results = connectToMySQL(DATABASE).query_db(query, data)
        if len(results) != 1:
            print('email not found in DB')
            return False
        return cls(results[0])

    @classmethod
    def get_by_id(cls, id):
        query = "SELECT * FROM users WHERE id = %(id)s;"
        data = {
            'id' : id
        }
        results = connectToMySQL(DATABASE).query_db(query, data)
        if len(results) != 1:
            print('id not found in DB')
            return False
        return cls(results[0])

    @classmethod
    def update_save(cls, data):
        query = "UPDATE users SET save = %(save)s WHERE id = 1"
        return connectToMySQL(DATABASE).query_db( query, data )

    @classmethod
    def update_email(cls, data):
        query = "UPDATE users SET email = %(email)s WHERE id = %(id)s"
        return connectToMySQL(DATABASE).query_db( query, data )

    # @classmethod
    # def delete(cls, data):
    #     query = "DELETE FROM users WHERE id = %(id)s"
    #     return connectToMySQL(DATABASE).query_db( query, data )

# Static Methods
# Validate account creation
    @staticmethod
    def create_validator(data):
        is_valid = True
        if not User.validate_email(data):
            is_valid = False
        if len(data['password']) < 8:
            is_valid = False
            flash('Password must be at least 8 characters!', 'err_password')
        if data['password'] != data['password_confirm']:
            flash('The password fields do not match.', 'err_password_confirm')
            is_valid = False
        return is_valid
    @staticmethod
    def validate_email(data):
        is_valid = True
        if not EMAIL_REGEX.match(data['email']): 
            flash("Invalid email address!", 'err_email')
            is_valid = False
        elif not User.check_email_unique(data):
            flash("Another user has claimed this email address!", 'err_email')
            is_valid = False
        return is_valid
    @staticmethod
    def check_email_unique(data):
        is_unique = True
        matches = connectToMySQL(DATABASE).query_db( "SELECT * FROM users WHERE %(email)s IN (SELECT email FROM users);", data)
        if len(matches) > 0:
            is_unique = False
            return is_unique
        return is_unique

# Validate login
    @staticmethod
    def login_validator(data):
        user = User.get_by_email(data['email'])
        if not user:
            flash("Email not registered to a user!", 'err_login_email')
            return False
        if not bcrypt.check_password_hash(user.password_hash, data['password']):
            flash("Invalid password.", 'err_login_password')
            return False
        return user.id