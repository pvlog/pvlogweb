from flask.templating import render_template
from pvlogweb import app
import requests
from pvlogweb.util import CommunicationError
from flask_babel import gettext, ngettext
import json
from flask.wrappers import Response
from datetime import date, timedelta
from flask.json import jsonify

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

@app.route('/overview')
def overview():
    """Render the about page
    :return: about page
    """
    
    cur_date = date.today()
         

    from_date = cur_date - timedelta(days=30);
    to_date   = cur_date;

     
    payload = {
        "method": "getDayData",
        "params": {"from": from_date.isoformat(), "to": to_date.isoformat()},
        "jsonrpc": "2.0",
        "id": 0
    }
     
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
        
    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getDayData")
    
    return render_template("overview.html", data=response["result"])

@app.route('/live_data')
def live_data():
    """ Return current live data
    :return live data json
    """
    
    payload = {
        "method": "getLiveSpotData",
        "params": {},
        "jsonrpc": "2.0",
        "id": 0
    }
    
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()

    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getLiveSpotData")
    
#     resp = Response(response=response["result"],
#                     status=200,
#                     mimetype="application/json")
    return jsonify(response["result"])