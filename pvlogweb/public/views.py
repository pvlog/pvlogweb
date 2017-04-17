from pvlogweb import app
from pvlogweb.util.util import json_rpc
from flask.json import jsonify
from flask import Blueprint
from flask.templating import render_template
from datetime import timedelta, date, datetime
from pvlogweb.util.util import last_day_of_month

url = app.config['PVLOG_SERVER'];

public = Blueprint('public', __name__, template_folder='templates')


@public.route('/about')
def about():
    return render_template("public/about.html")


@public.route('/events')
def events():
    data = json_rpc(url, "getEvents", {})
    inverters = json_rpc(url, "getInverters", {})
    return render_template("public/events.html", data=data, inverters=inverters)


@public.route('/')
@public.route('/overview')
def overview():
    cur_date = date.today()

    from_date = cur_date - timedelta(days=30);
    to_date   = cur_date;

    data = json_rpc(url, "getDayData", {"from": from_date.isoformat(), "to": to_date.isoformat()})
    inverters = json_rpc(url, "getInverters", {})
    return render_template("public/overview.html", data=data, inverters=inverters)


@public.route('/statistics')
def statistics():
    result = json_rpc(url, "getStatistics", {})
    return render_template("public/statistics.html", data=result)


@public.route('/liveData', methods=['GET', 'POST'])
def live_data():
    result = json_rpc(url, "getLiveSpotData", {})
    return jsonify(result)

@public.route('/dataloggerStatus', methods=['GET', 'POST'])
def datalogger_status():
    result = json_rpc(url, "getDataloggerStatus", {})
    return jsonify(result)

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

    data = json_rpc(url, "getSpotData", {"date": day_date.isoformat()})
    inverters = json_rpc(url, "getInverters", {});

    return render_template("public/charts/daily.html", current=day_date, before=yesterday, after=tomorrow,
                           data=data, inverters=inverters)

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

    data = json_rpc(url, "getDayData", {"from": fromDate.isoformat(), "to": toDate.isoformat()})
    inverters = json_rpc(url, "getInverters", {});

    return render_template("public/charts/monthly.html", current=cur_date.strftime("%Y-%m"), before=before_date.strftime("%Y-%m"),
                            after=after_date.strftime("%Y-%m"), data=data, inverters=inverters)


@public.route('/yearly')
@public.route('/yearly/<date_string>')
def yearly(date_string=None):
    if (date_string != None):
        cur_date = datetime.strptime(date_string, '%Y').date()
    else:
        cur_date = date.today()

    year = cur_date.year

    data = json_rpc(url, "getMonthData", {"year": str(year)})
    inverters = json_rpc(url, "getInverters", {});

    return render_template("public/charts/yearly.html", current=year, before=year - 1,
                            after=year + 1, data=data, inverters=inverters)


@public.route('/totaly')
def totaly(date_string=None):
    data = json_rpc(url, "getYearData", {})
    inverters = json_rpc(url, "getInverters", {});
    return render_template("public/charts/totaly.html", data=data, inverters=inverters)
