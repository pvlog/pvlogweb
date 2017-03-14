from pvlogweb.util.util import json_rpc
from flask.json import jsonify
from flask.templating import render_template
from flask import request, Blueprint

url = "http://192.168.178.82:8384"

admin = Blueprint('admin', __name__,
                        template_folder='templates')

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
    print "plant:"
    print plant

    inverters = json_rpc(url, "scanForInverters", {"plant": plant})
    return jsonify(inverters);


@admin.route('/savePlant', methods=['GET', 'POST'])
def save_plant():
    plant = request.get_json()
    print "Saving:"
    print plant
    return jsonify(0);
    #result = json_rpc(url, "savePlant", {plant});
    #return jsonify(result);


@admin.route('/deletePlant', methods=['GET', 'POST'])
def delete_plant():
    plantId = request.get_json()
    result = json_rpc(url, "deletePlant", {plantId})
    return jsonify(result);


@admin.route('/saveInverter', methods=['GET', 'POST'])
def save_inverter():
    inverter = request.get_json()
    print "Saving:"
    print inverter
    return jsonify(inverter.id)
    #result = json_rpc(url, "saveInverter", {inverter});
    #jsonify(result);


@admin.route('/deleteInverter', methods=['GET', 'POST'])
def delete_inverter():
    inverterId = request.get_json()
    result = json_rpc(url, "deleteInverter", {inverterId})
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