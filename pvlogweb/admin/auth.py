from flask_httpauth import HTTPDigestAuth
#from werkzeug.security import check_password_hash

auth = HTTPDigestAuth()

users = {
    "admin": "Password"
}

@auth.get_password
def get_pw(username):
    if username in users:
        return users.get(username)
    return None

# @auth.verify_password
# def verify_pw(username, password):
#     if (username in users):
#         check_password_hash(users[username], password)
#         
#     return False