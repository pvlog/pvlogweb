from pvlogweb.data.models import DCData, ACData, InverterData
from datetime import datetime, timedelta
import time


def get_spot_values(day_date, inverter_id):
    """
    :return day data of given inverter
    """

    tomorrow = day_date + timedelta(days=1)

    from_time = time.mktime(datetime.combine(day_date, datetime.min.time()).timetuple())
    to_time = time.mktime(datetime.combine(tomorrow, datetime.min.time()).timetuple())

    dc_data = DCData.query.filter(DCData.inverter == inverter_id,
                                  DCData.datetime >= from_time,
                                  DCData.datetime < to_time).all()

    ac_data = ACData.query.filter(ACData.inverter == inverter_id,
                                  ACData.datetime >= from_time,
                                  ACData.datetime < to_time).all()

    return InverterData(ac_data, dc_data)
