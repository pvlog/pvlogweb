from flask import Flask, request, send_from_directory
#from webassets.filter import get_filter
from flask_babel import Babel
from flask_session import Session
from flask_webpack import Webpack

from pvlogweb.converters.DateConverter import DateConverter


app = Flask(__name__, static_folder=None)
app.config.from_object("config")

babel = Babel(app)
session = Session(app)
webpack = Webpack(app)

app.url_map.converters['date_converter'] = DateConverter

from admin.views import admin
app.register_blueprint(admin, url_prefix='/admin')

from public.views import public
app.register_blueprint(public)

@app.route("/static/<path:filename>")
def send_asset(filename):
    print "sending file"
    return send_from_directory("../static", filename)

@babel.localeselector
def get_locale():
     return request.accept_languages.best_match(app.config['LANGUAGES'].keys())


