from werkzeug.security import check_password_hash, generate_password_hash
from flask_httpauth import HTTPBasicAuth
from pvlogweb import app

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username, password):
    if 'admin' == username:
        return verify_pw(password)

    return False


def verify_pw(password):
    password_file = app.config['PASSWORD_FILE'];

    app.logger.info('Checking password password hash file: %s', password_file)
    with open(password_file, 'r') as f:
        password_hash = f.readline().rstrip()
        return check_password_hash(password_hash, password)

    return False


def save_pw(password):
    password_file = app.config['PASSWORD_FILE'];
    password_hash = generate_password_hash(password)

    with open(password_file, 'w') as f:
        f.write(password_hash)
        app.logger.info('Saved password to password file %s', password_file)
