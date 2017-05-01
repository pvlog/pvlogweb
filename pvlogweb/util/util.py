from datetime import timedelta
import requests
from pvlogweb.util.pvlogweb_exceptions import CommunicationError
import json
from pvlogweb import app

def last_day_of_month(date):
    if date.month == 12:
        return date.replace(day=31)
    return date.replace(month=date.month+1, day=1) - timedelta(days=1)

def json_rpc(url, method, params, notification = False):
    
    payload = {
        'method': method,
        'params': params,
        'jsonrpc': '2.0',
    }

    if not notification:
        payload["id"] = 0

    headers = {'content-type': 'application/json'}

    if notification:
        app.logger.debug('Request notification url: %s, payload: %s', url, payload)
        try:
            requests.post(
                url, data=json.dumps(payload), headers=headers)
        except requests.exceptions.RequestException as e:
            raise CommunicationError('Communication error: ' + str(e), payload)

        return None
    else:
        app.logger.debug('Request url: %s, payload: %s', url, payload)
        try:
            response = requests.post(
                url, data=json.dumps(payload), headers=headers).json()
        except requests.exceptions.RequestException as e:
            raise CommunicationError('Communication error: ' + str(e), payload)

        app.logger.debug('response: %s', response)

        if (response['jsonrpc'] != '2.0') or (response['id'] != 0) or 'error' in response:
            raise CommunicationError('Communication error', payload)

        return response['result'];