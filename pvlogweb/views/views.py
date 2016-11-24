from flask.templating import render_template
from pvlogweb import app
import requests
from util import CommunicationError
from flask_babel import gettext, ngettext
import json

url = "http://192.168.178.82:8383"
headers = {'content-type': 'application/json'}


@app.route('/about')
def about():
    """Render the about page
    :return: about page
    """
    return render_template("about.html")

@app.route('/events')
def events():
    """Render event page
    :return: event page
    """

    payload = {
        "method": "getEvents",
        "params": {},
        "jsonrpc": "2.0",
        "id": 0
    }

    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()

    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getEvents")

    return render_template("events.html", data=response["result"])
