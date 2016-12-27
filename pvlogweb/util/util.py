from datetime import timedelta
import requests
import CommunicationError
import json

def last_day_of_month(date):
    if date.month == 12:
        return date.replace(day=31)
    return date.replace(month=date.month+1, day=1) - timedelta(days=1)

def json_rpc(url, method, params):
    
    payload = {
        "method": method,
        "params": params,
        "jsonrpc": "2.0",
        "id": 0
    }
    
    headers = {'content-type': 'application/json'}
    
    print json.dumps(payload)
     
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
         
    if (response["jsonrpc"] != "2.0") or (response["id"] != 0):
        raise CommunicationError(method)
    
    return response["result"]