from datetime import timedelta
import requests
from CommunicationError import CommunicationError
import json

def last_day_of_month(date):
    if date.month == 12:
        return date.replace(day=31)
    return date.replace(month=date.month+1, day=1) - timedelta(days=1)

def json_rpc(url, method, params, notification = False):
    
    payload = {
        "method": method,
        "params": params,
        "jsonrpc": "2.0",
    }

    if not notification:
        payload["id"] = 0

    headers = {'content-type': 'application/json'}

    print json.dumps(payload)

    if notification:
        requests.post(
            url, data=json.dumps(payload), headers=headers)
        return None
    else:
        response = requests.post(
            url, data=json.dumps(payload), headers=headers).json()

        print response
        if (response["jsonrpc"] != "2.0") or (response["id"] != 0) or "error" in response:
            raise CommunicationError("Communication error")

        return response["result"];