from flask.json import jsonify
from flask import Blueprint
from flask.templating import render_template
from datetime import timedelta, date, datetime
import json
import requests
from pvlogweb.util import CommunicationError
from pvlogweb.util.util import last_day_of_month

url = "http://192.168.178.82:8383"
headers = {'content-type': 'application/json'}

public = Blueprint('public', __name__,
                        template_folder='templates')


@public.route('/about')
def about():
    """Render the about page
    :return: about page
    """
    return render_template("public/about.html")

@public.route('/events')
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

    return render_template("public/events.html", data=response["result"])

@public.route('/')
@public.route('/overview')
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
    
    return render_template("public/overview.html", data=response["result"])

@public.route('/live_data')
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

class Vividict(dict):
    def __missing__(self, key):
        value = self[key] = type(self)()
        return value

@public.route('/daily')
@public.route('/daily/<date_converter:day_date>')
def daily(day_date=None):
    """Renders a chart with daily data"""
    
    if (day_date == None):
        day_date = date.today()

    yesterday = day_date - timedelta(days=1)
    tomorrow = day_date + timedelta(days=1)
    
    payload = {
        "method": "getSpotData",
        "params": {"date": day_date.isoformat()},
        "jsonrpc": "2.0",
        "id": 0
    }
    
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
        
    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getSpotData")

    return render_template("public/charts/daily.html", current=day_date, before=yesterday, after=tomorrow,
                           data=response["result"])

@public.route('/monthly')
@public.route('/monthly/<date_string>')
def monthly(date_string=None):
    if (date_string != None):
        cur_date = datetime.strptime(date_string, '%Y-%m').date()
    else:
        cur_date = date.today()
         
    fromDate = cur_date.replace(day=1)
    toDate = last_day_of_month(cur_date)
    
    before_date = fromDate - timedelta(days=1)
    after_date = toDate + timedelta(days=1)
     
    payload = {
        "method": "getDayData",
        "params": {"from": fromDate.isoformat(), "to": toDate.isoformat()},
        "jsonrpc": "2.0",
        "id": 0
    }
     
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
         
    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getDayData")
    
    return render_template("public/charts/monthly.html", current=cur_date.strftime("%Y-%m"), before=before_date.strftime("%Y-%m"),
                            after=after_date.strftime("%Y-%m"), data=response["result"])
    
@public.route('/yearly')
@public.route('/yearly/<date_string>')
def yearly(date_string=None):
    if (date_string != None):
        cur_date = datetime.strptime(date_string, '%Y').date()
    else:
        cur_date = date.today()
        
    year = cur_date.year

    payload = {
        "method": "getMonthData",
        "params": {"year": str(year)},
        "jsonrpc": "2.0",
        "id": 0
    }

    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
         
    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getMonthData")

    return render_template("public/charts/yearly.html", current=year, before=year - 1,
                            after=year + 1, data=response["result"])
    
@public.route('/totaly')
def totaly(date_string=None):
    payload = {
        "method": "getYearData",
        "params": {},
        "jsonrpc": "2.0",
        "id": 0
    }

    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
         
    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError("getYearData")

    return render_template("public/charts/totaly.html", data=response["result"])
