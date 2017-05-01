from flask import Flask, request, send_from_directory
from flask_babel import Babel
from flask_session import Session
from flask_webpack import Webpack

from converters.DateConverter import DateConverter

app = Flask(__name__, static_folder=None)
app.config.from_object('pvlogweb.config')
app.config.from_envvar('PVLOGWEB_SETTINGS', silent=True)

babel = Babel(app)
session = Session(app)
webpack = Webpack(app)

app.url_map.converters['date_converter'] = DateConverter

import errrorhandlers

from admin.views import admin
app.register_blueprint(admin, url_prefix='/admin')

from public.views import public
app.register_blueprint(public)

@babel.localeselector
def get_locale():
    return request.accept_languages.best_match(app.config['LANGUAGES'].keys())


