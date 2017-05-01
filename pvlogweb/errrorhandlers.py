from flask.json import jsonify
from pvlogweb.util.pvlogweb_exceptions import CommunicationError
from pvlogweb import app

@app.errorhandler(CommunicationError)
def handle_communication_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response