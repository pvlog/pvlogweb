from pvlogweb import app
from pvlogweb.util.util import json_rpc
from auth import auth, verify_pw, save_pw
from flask.json import jsonify
from flask.templating import render_template
from flask import request, Blueprint

url = app.config['PVLOG_ADMIN_SERVER'];

admin = Blueprint('admin', __name__, template_folder='templates')

@admin.before_request
@auth.login_required 
def restrict_bp_to_admins():
    if (False):
        return jsonify({'error':'Unauthorized.'})


@admin.route('/passwordSettings')
def passwordsettings():
        return render_template("admin/passwordsettings.html")


@admin.route('/changePassword', methods=['GET', 'POST'])
def changePassword():
    passwords = request.get_json();
    old_password = passwords['oldPassword'];
    new_password1 = passwords['newPassword1'];
    new_password2 = passwords['newPassword2'];

    print old_password

    if not verify_pw(old_password):
        return jsonify({'error': {'message': 'Wrong old Password!'}})

    if new_password1 != new_password2:
        return jsonify({'error': {'message': 'New passwords are different!'}})

    save_pw(new_password1)

    return jsonify({})


@admin.route('/get_plants')
def get_plants():
    result = json_rpc(url, "getPlants", {})
    return jsonify(result);


@admin.route('/get_inverters')
def get_inverters():
    result = json_rpc(url, "getInverters", {})
    return jsonify(result);


@admin.route('/scanForInverters', methods=['GET', 'POST'])
def scan_for_inverters():
    plant = request.get_json()
    inverters = json_rpc(url, "scanForInverters", {"plant": plant})
    return jsonify(inverters);


@admin.route('/savePlant', methods=['GET', 'POST'])
def save_plant():
    plant = request.get_json()
    result = json_rpc(url, "savePlant", {"plant": plant});
    print("result", result)
    return jsonify(result);


@admin.route('/deletePlant', methods=['GET', 'POST'])
def delete_plant():
    plant = request.get_json()
    result = json_rpc(url, "deletePlant", plant)
    return jsonify(result);


@admin.route('/saveInverter', methods=['GET', 'POST'])
def save_inverter():
    inverter = request.get_json()
    result = json_rpc(url, "saveInverter", {"inverter": inverter});
    return jsonify(result);


@admin.route('/deleteInverter', methods=['GET', 'POST'])
def delete_inverter():
    inverter = request.get_json()
    result = json_rpc(url, "deleteInverter", inverter)
    return jsonify(result);

@admin.route('/stopDatalogger', methods=['GET', 'POST'])
def stop_inverter():
    json_rpc(url, "stopDatalogger", {}, True)
    return jsonify({})

@admin.route('/startDatalogger', methods=['GET', 'POST'])
def start_inverter():
    json_rpc(url, "startDatalogger", {}, True)
    return jsonify({})

@admin.route("/plantsettings")
def plantsettings():
    plants = json_rpc(url, "getPlants", {})
    inverters = json_rpc(url, "getInverters", {})
    connections = json_rpc(url, "getSupportedConnections", {})
    protocols = json_rpc(url, "getSupportedProtocols",{})
    isDataloggerRunning = json_rpc(url, "isDataloggerRunning",{})
    return render_template("admin/plantsettings.html", plants=plants, inverters=inverters,
                           connections=connections, protocols=protocols, isDataloggerRunning=isDataloggerRunning)


@admin.route("/saveConfig", methods=['GET', 'POST'])
def saveConfig():
    config = request.get_json()
    res = json_rpc(url, "saveConfig", {"config": config});
    return jsonify(res);

@admin.route("/configsettings")
def configsettings():
    configs = json_rpc(url, "getConfigs", {})
    return render_template("admin/configsettings.html", configs=configs)

@admin.route("/emailsettings")
def emailsettings():
    email_server = json_rpc(url, "getEmailServer", {})
    email = json_rpc(url, "getEmail", {})
    return render_template("admin/emailsettings.html", emailServer=email_server, email=email)


@admin.route("/saveEmailServer", methods=['GET', 'POST'])
def save_email_server():
    emailServer = request.get_json()
    res = json_rpc(url, "saveEmailServer", emailServer)
    return jsonify(res)

@admin.route("/saveEmail", methods=['GET', 'POST'])
def save_email():
    email = request.get_json()
    res = json_rpc(url, "saveEmail", email)
    return jsonify(res)

@admin.route("/sendTestEmail", methods=['GET', 'POST'])
def send_test_email():
    res = json_rpc(url, "sendTestEmail", {})
    return jsonify(res)
