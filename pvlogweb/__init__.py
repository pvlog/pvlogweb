from flask import Flask, request, send_from_directory
#from webassets.filter import get_filter
from flask_babel import Babel
from flask_session import Session
from flask_webpack import Webpack

from pvlogweb.converters.DateConverter import DateConverter


app = Flask(__name__)
app.config.from_object("config")

babel = Babel(app)
session = Session(app)
webpack = Webpack(app)

app.url_map.converters['date_converter'] = DateConverter

from admin.views import admin
app.register_blueprint(admin, url_prefix='/admin')

from public.views import public
app.register_blueprint(public)

@app.route("/assets/<path:filename>")
def send_asset(filename):
    return send_from_directory("../assets/public", filename)

@babel.localeselector
def get_locale():
     return request.accept_languages.best_match(app.config['LANGUAGES'].keys())


