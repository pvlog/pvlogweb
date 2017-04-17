import os

DEBUG = True

WEBPACK_MANIFEST_PATH = os.path.dirname(os.path.realpath(__file__)) + '/manifest.json'

SESSION_TYPE = 'filesystem'

BABEL_DEFAULT_LOCALE='en'

LANGUAGES = {
        'en': 'English',
        'de': 'Deutsch'
}

STATIC_FOLDER = None

PASSWORD_FILE = os.path.dirname(os.path.realpath(__file__)) + '/password.conf'

PVLOG_SERVER = "http://192.168.178.82:8383"

PVLOG_ADMIN_SERVER = "http://192.168.178.82:8384"
