from pvlogweb import app
from flask.templating import render_template
from datetime import timedelta, date
from math import cos
from pvlogweb.data.database import get_spot_values
from pvlogweb.data.models import *;
import json

class Vividict(dict):
    def __missing__(self, key):
        value = self[key] = type(self)()
        return value

@app.route('/daily')
@app.route('/daily/<date_converter:day_date>')
def daily(day_date=None):
    """Renders a chart with daily data"""
    
    index = list(range(20))
    cos_val = [cos(x) for x in index]
    cos_val2 = [10 * cos(x) for x in index]
    
    ac_total_power = [index, cos_val]
    cos_val_sum = [sum(map(abs, cos_val2[0:x+1])) for x in index]

    ac_total_energy = [index, cos_val_sum]

    if (day_date == None):
        day_date = date.today()

    yesterday = day_date - timedelta(days=1)
    tomorrow = day_date + timedelta(days=1)

    day_data = get_spot_values(day_date, 1);

    print day_data.ac_data

    ac_dict = {x.datetime: x for x in day_data.ac_data}
    dc_dict = Vividict()
    for x in day_data.dc_data:
        dc_dict[x.datetime][x.tracker] = x

    dc_keys = dc_dict.keys()
    ac_keys = ac_dict.keys()

    all_keys = set(ac_keys + dc_keys)
    
    inverter_data = {'inverer_id': 1}
    for x in all_keys:
        ac = ac_dict.get(x)
        dc = dc_dict.get(x)
        
        spot_data = {}
        if ac.frequency != None:
            spot_data['frequency'] = ac.frequency
            
        if ac.power != None:
            spot_data['power'] = ac.power
            
        ac_side = {}
#         for phase in ac.phases:
#             phase_data = {}
#             if (phase.power != None):
#                 phase_data['power'] = phase.power;
#                 
#             if (phase.voltage != None):
#                 phase_data['voltage'] = phase.voltage;
#                 
#             if (phase.current != None):
#                 phase_data['current'] = phase.current;
#             
#             ac_side[phase.phase] = phase_data
            
        dc_side = {}
        for tracker, tracker_data in dc.iteritems():
            tracker_values = {}
            if tracker_data.voltage != None:
                tracker_values['voltage'] = tracker_data.voltage
                
            if tracker_data.current!= None:
                tracker_values['current'] = tracker_data.current
                
            dc_side[tracker] = tracker_values
    
        spot_data['phases'] = ac_side
        spot_data['tracker'] = dc_side

        inverter_data[x] = spot_data

    print inverter_data

    return render_template("charts/daily.html", today=day_date, yesterday=yesterday, tomorrow=tomorrow,
                           ac_total_power=ac_total_power, ac_total_energy = ac_total_energy, day_data=inverter_data)


    