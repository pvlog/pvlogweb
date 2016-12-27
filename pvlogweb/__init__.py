from flask import Flask
from pvlogweb.converters.DateConverter import DateConverter
#from webassets.filter import get_filter
from flask_babel import Babel
from flask_webpack import Webpack

app = Flask(__name__)
app.config['DEBUG'] = True

babel = Babel(app)

app.url_map.converters['date_converter'] = DateConverter

params = {
    'DEBUG': True,
    'WEBPACK_MANIFEST_PATH': '../build/manifest.json'
}
app.config.update(params)

webpack = Webpack()
webpack.init_app(app)

LANGUAGES = {
    'en': 'English',
    'de': 'Deutsch'
}

# @babel.localeselector
# def get_locale():
#     return request.accept_languages.best_match(app.config['LANGUAGES'].keys())


# assets = Environment(app)
# 
# assets.debug = True
# assets.config['babel_run_in_debug'] = False
# 
# assets.auto_build = True
# 
# assets.config['babel_presets'] = 'es2015'
#assets.config['babel_extra_args'] = ['--plugins', 'transform-es2015-modules-systemjs']

from pvlogweb.data import  models
from pvlogweb.views import test
from pvlogweb.views import charts
from pvlogweb.views import views
from pvlogweb.views import admin
