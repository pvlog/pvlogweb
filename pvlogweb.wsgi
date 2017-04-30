activate_this = '/var/www/pvlogweb/venv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
from pvlogweb import app as application
