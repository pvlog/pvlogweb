import Gettext from 'node-gettext';
import 'bootstrap'
import 'bootstrap-editable';
import 'knockout.x-editable';
import 'knockout.validation';
import 'bootstrap-notify'
import * as ko from 'knockout';
import {getJson} from 'jsonhelper';
import $ from'jquery';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

ko.extenders.numeric = function(target, precision) {
	var result = ko.pureComputed({
		read: target,
		write: function(newValue) {
			var valueToWrite;
			if (newValue == null || isNaN(newValue)) {
				valueToWrite = newValue;
			} else {
				valueToWrite = Number(newValue);
			}
			target(valueToWrite);
		}
	}).extend({ notify: 'always' });

	result(target());

	return result;
};

function Inverter(inverterData) {
	var self = this;
	
	if (inverterData == null) {
		inverterData = {};
		inverterData.id       = null;
		inverterData.plantId  = null;
		inverterData.name     = null;
		inverterData.wattpeak = null;
		inverterData.phases   = null;
		inverterData.trackers = null;
		inverterData.active   = 1;		
	
	}
	
	self.id       = ko.observable(inverterData.id).extend({number: true, required: true, numeric: true});
	self.plantId  = ko.observable(inverterData.plantId);
	self.name     = ko.observable(inverterData.name).extend({required: true});
	self.wattpeak = ko.observable(inverterData.wattpeak).extend({number: true, required: true, numeric: true});
	self.phases   = ko.observable(inverterData.phases).extend({required: true, required: true, numeric: true});
	self.trackers = ko.observable(inverterData.trackers).extend({required: true, required: true, numeric: true});
	self.active   = 1;
}

function Plant(plantData, isDataloggerRunning) {
	var self = this;
	
	if (plantData == null) {
		plantData = {};
		
		plantData.id              = null;
		plantData.name            = null;
		plantData.connection      = null;
		plantData.protocol        = null;
		plantData.connectionParam = null;
		plantData.protocolParam   = null;
	}

	self.id              = ko.observable(plantData.id);
	self.name            = ko.observable(plantData.name).extend({required: true});
	self.connection      = ko.observable(plantData.connection).extend({required: true});
	self.protocol        = ko.observable(plantData.protocol).extend({required: true});
	self.connectionParam = ko.observable(plantData.connectionParam).extend({required: true});
	self.protocolParam   = ko.observable(plantData.protocolParam).extend({required: true});
	
	self.inverters = ko.observableArray();
	
	self.saved = ko.observable(false);
	
	self.save = function() {
		var isValid = ko.validatedObservable(self).isValid();
		
		ko.validation.group(self).showAllMessages();
		self.inverters().forEach(function(v,i) {
			isValid = isValid && ko.validatedObservable(v).isValid();
			ko.validation.group(v).showAllMessages();
		});
		
		if (!isValid) {
			return;
		}

		getJson(SCRIPT_ROOT + '/savePlant', ko.toJSON(self), function(result) {
			self.id(result.id);
			$.notify({message: 'Successfully saved plant ' + self.name() + '!'}, {type: 'sucess'});

			for (let inverter of self.inverters()) {
				inverter.plantId(self.id());
				getJson(SCRIPT_ROOT + '/saveInverter', ko.toJSON(inverter), function(result) {
					$.notify({message: 'Successfully saved inverter' + inverter.name() + '!'}, {type: 'sucess'});
				});
			}
		});

		self.saved(true);
		self.saved(false);
	}
	
	self.deleteInverter = function(inverter) {
		if (inverter.id() == null) {
			self.inverters.remove(inverter);
			return;
		}

		getJson(SCRIPT_ROOT + '/deleteInverter', JSON.stringify({"inverterId": String(inverter.id())}), function(result) {
			self.inverters.remove(inverter);
		});
	}
	
	self.addInverter = function() {
		self.inverters.push(new Inverter(null));
	}
	
	self.isInverterAvailable = function(inverterId) {
		for (inverter of self.inverters()) {
			if (inverter.id() == inverterId) {
				return true;
			}
		}
		
		return false;
	}
	
	self.scanForInverters = function() {
		if (isDataloggerRunning()) {
			$.notify({message: 'You need to stop the datelogger before scanning for inverters!'}, {type: 'danger'});
			return;
		}

		getJson(SCRIPT_ROOT + '/scanForInverters', ko.toJSON(self), function(result) {
			for (let inverter of result) {
				if (!self.isInverterAvailable(inverter.id)) {
					let inv = new Inverter(inverter);
					self.inverters.push(inv);
				}
			}
		});
	}
}

function PlantListModel(plantsData, invertersData, connections, protocols) {
	var self = this;

	self.plants = ko.observableArray();
	
	self.connections = $.map(connections, function(n) {
		return {text: n, value: n};
	});

	self.protocols = $.map(protocols, function(n) {
		return  {text: n, value: n};
	});

	self.phases = [{text: "1", value: 1}, {text: "2", value: 2}, {text: "3", value: 3}];

	self.activeStates = [{text:"enabled", value: 1},{text: "disabled", value: 0}];

	self.isDataloggerRunning = ko.observable(isDataloggerRunning);

	//create plants and inverters
	for (let pData of plantsData) {
		const plant = new Plant(pData, self.isDataloggerRunning);
		for (let iData of invertersData) {
			if (iData.plantId == pData.id) {
				const inverter = new Inverter(iData);
				plant.inverters.push(inverter);
			}
		}
		self.plants.push(plant);
	}
	
	self.deletePlant = function(plant) {
		if (plant.inverters().length != 0) {
			$.notify({
				message: "You need to delete all inverters first!"
			},{
				type: 'danger'
			});
			return;
		}

		if (plant.id() == null) {
			self.plants.remove(plant);
			return;
		}

		getJson(SCRIPT_ROOT + '/deletePlant', JSON.stringify({"plantId": String(plant.id())}), function(result) {
			self.plants.remove(plant);
		});
	}

	self.addPlant = function() {
		self.plants.push(new Plant(null, self.isDataloggerRunning));
	}

	self.startDatalogger = function() {
		if (self.isDataloggerRunning() == true) {
			return;
		}

		getJson(SCRIPT_ROOT + '/startDatalogger', {}, function(result) {
			self.isDataloggerRunning(true);
		});
	}

	self.stopDatalogger = function() {
		if (self.isDataloggerRunning() == false) {
			return;
		}

		getJson(SCRIPT_ROOT + '/stopDatalogger', {}, function(result) {
			self.isDataloggerRunning(false);
		});
	}
}

$(function() {

	$('[data-toggle="tooltip"]').tooltip();
	ko.validation.makeBindingHandlerValidatable('editable');
	ko.validation.init({
		decorateInputElement: true,
		errorElementClass: 'bg-danger',
		errorMessageClass: 'text-danger paddError',
		registerExtenders: true,
		messagesOnModified: true,
		insertMessages: true,
		parseInputAttributes: true,
		messageTemplate: null
	}, true)
	ko.applyBindings(new PlantListModel(plants, inverters, connections, protocols));
});
