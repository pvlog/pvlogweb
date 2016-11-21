from flask import Flask
from flask_assets import Environment, Bundle
from pvlogweb.converters.DateConverter import DateConverter
#from webassets.filter import get_filter
from flask.ext.babel import Babel
from flask_webpack import Webpack

app = Flask(__name__)
app.url_map.converters['date_converter'] = DateConverter

babel = Babel(app)
webpack.init_app(app)
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
