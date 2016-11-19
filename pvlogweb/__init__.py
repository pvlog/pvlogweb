from flask import Flask
from pvlogweb.converters.DateConverter import DateConverter
from flask_webpack import Webpack

webpack = Webpack()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/testDatabase.db'
app.url_map.converters['date_converter'] = DateConverter


from pvlogweb.data import  models
from pvlogweb.views import test
from pvlogweb.views import charts
from pvlogweb.views import views
