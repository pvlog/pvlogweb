import Gettext from 'node-gettext';
import * as v from 'valib';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

class Inverter {
	constructor(i, plant) {
		var templateRow = $('#inverterRowTemplate');//Fixme
		var row = templateRow.clone().removeAttr('id');//.removeAttr('style');

		var id   = row.find('*[data-id]');
		var name = row.find('*[data-name]');
		var wattpeak = row.find('*[data-wattpeak]');
		var phases   = row.find('*[data-phases]');
		var trackers = row.find('*[data-trackers]');

		if (i != null) {
			row.attr("id", 'inverter-' + i.id);
			id.html(i.id);
			name.html(i.name);
			wattpeak.html(i.wattpeak);
			phases.html(i.phases);
			trackers.html(i.trackers);
		} else {
			i = {};
		}

		id.editable({
			type: 'text',
			title: _('Enter id'),
			success: function(response, newValue) {
				//TODO validate
				if (v.String.isNumeric(newValue, {canBeSigned: false, simple: true}) == false) {
					return _('Insert valid id');
				}
				i.id = newValue;
			}
		});

		name.editable({
			type: 'text',
			title: _('Enter name'),
			success: function(response, newValue) {
				if (v.Type.isString(newValue) == false) {
					return _('Insert valid name');
				}
				i.name = newValue;
			}
		});

		wattpeak.editable({
			type: 'text',
			title: _('Enter wattpeak'),
			success: function(response, newValue) {
				if (v.String.isNumeric(newValue, {canBeSigned: false, simple: true}) == false) {
					return _('Insert valid wattpeak');
				}
				i.wattpeak = newValue;
			}
		});

		phases.editable({
			type: 'text',
			title: _('Enter phases number'),
			success: function(response, newValue) {
				let val = v.String.toNumber(newValue, {canBeSigned: false})
				if (v.Number.inRange(val, 1, 3) == false) {
					return _('Insert valid phase number');
				}
				i.phases = newValue;
			}
		});

		trackers.editable({
			type: 'text',
			title: _('Enter tracker number'),
			success: function(response, newValue) {
				let val = v.String.toNumber(newValue, {canBeSigned: false})
				if (v.Number.inRange(val, 1, 3) == false) {
					return _('Insert valid tracker number');
				}
				i.trackers = newValue;
			}
		});

		row.find('.deleteInverterButton').click($.proxy(function() {
			this.deleteInverter();
		}, this));

		this.$inverter = row;
		this.inverter = i;
		this.plant = plant;
	}

	deleteInverter() {
		if (this.inverter.id == null) {
			this.$inverter.remove();
			this.plant.removeInverter(this);
		}
	}
}

//function createInverter(i) {
//	var templateRow = $('#inverterRowTemplate');//Fixme
//	var row = templateRow.clone().removeAttr('id');//.removeAttr('style');
//	
//	var id   = row.find('*[data-id]');
//	var name = row.find('*[data-name]');
//	var wattpeak = row.find('*[data-wattpeak]');
//	var phases   = row.find('*[data-phases]');
//	var trackers = row.find('*[data-trackers]');
//	
//	if (i != null) {
//		row.attr("id", 'inverter-' + i.id);
//		id.html(i.id);
//		name.html(i.name);
//		wattpeak.html(i.wattpeak);
//		phases.html(i.phases);
//		trackers.html(i.trackers);
//	} else {
//		i = {};
//	}
//	
//	id.editable({
//		type: 'text',
//		title: _('Enter id'),
//		success: function(response, newValue) {
//			//TODO validate
//			if (v.String.isNumeric(newValue, {canBeSigned: false, simple: true}) == false) {
//				return _('Insert valid id');
//			}
//			i.id = newValue;
//		}
//	});
//	
//	name.editable({
//		type: 'text',
//		title: _('Enter name'),
//		success: function(response, newValue) {
//			if (v.Type.isString(newValue) == false) {
//				return _('Insert valid name');
//			}
//			i.name = newValue;
//		}
//	});
//	
//	wattpeak.editable({
//		type: 'text',
//		title: _('Enter wattpeak'),
//		success: function(response, newValue) {
//			if (v.String.isNumeric(newValue, {canBeSigned: false, simple: true}) == false) {
//				return _('Insert valid wattpeak');
//			}
//			i.wattpeak = newValue;
//		}
//	});
//	
//	phases.editable({
//		type: 'text',
//		title: _('Enter phases number'),
//		success: function(response, newValue) {
//			let val = v.String.toNumber(newValue, {canBeSigned: false})
//			if (v.Number.inRange(val, 1, 3) == false) {
//				return _('Insert valid phase number');
//			}
//			i.phases = newValue;
//		}
//	});
//	
//	trackers.editable({
//		type: 'text',
//		title: _('Enter tracker number'),
//		success: function(response, newValue) {
//			let val = v.String.toNumber(newValue, {canBeSigned: false})
//			if (v.Number.inRange(val, 1, 3) == false) {
//				return _('Insert valid tracker number');
//			}
//			i.trackers = newValue;
//		}
//	});
//	
//	row.find('.deleteInverterButton').click(function() {
//		deleteInverter(row, i);
//	});
//	
//	
//	return row;
//}

function deleteInverter(inverterRow, inv) {
	if (inv == null || inv.id == null) {
		inverterRow.remove();
	}
}

function deletePlant($plant, plant) {
	if (plant == null || plant.id == null) {
		$plant.remove();
	}
}

//function createInverters(inverters, plantId) {
//	var rows = [];
//	
//	for (let i of inverters) {
//		if (i.plantId == plantId) {
//			let row = createInverter(i);
//			rows.push(row);
//		}
//	}
//	
//	return rows;
//}

class Plant {
	constructor(p) {
		var plantTemplate = $('#plantsTemplate')
		var $plant = plantTemplate.clone().removeAttr('id').removeAttr('style');

		var id   = $plant.find('*[data-id]')
		var name = $plant.find('*[data-name]')
		var connection = $plant.find('*[data-connection]')
		var protocol = $plant.find('*[data-protocol]')
		var connectionParam = $plant.find('*[data-connectionParameter]')
		var protocolParam   = $plant.find('*[data-protocolParameter]')

		//all inverters of plant
		var plantInverters = [];
		
		if (p != null) {
			for (let inv of inverters) {
				if (inv.plantId == p.id) {
					plantInverters.push(inv);
				}
			}

			$plant.attr('id', 'plant-' + p.id);
			id.html(p.id);
			name.html(p.name);
			connection.html(p.connection);
			protocol.html(p.protocol);
			connectionParam.html(p.connectionParam);
			protocolParam.html(p.protocolParam);
		} else {
			p = {};
		}

		name.editable({
				type: 'text',
				title: _('Enter name'),
				success: function(response, newValue) {
					p.name = newValue;
				},
				validate: function(value) {
					if (!v.Type.isString(value) || value == '') {
						return _('Insert valid name') + ', is invalid: ' + value;
					}
				}
		});

		let selectConnections = [];
		for (let con of connections) {
			selectConnections.push({value: con, text: con});
		}
		let selectConnectionsInitial = null;
		if (p != null) {
			selectConnectionsInitial = p.connection;
		}

		connection.editable({
			type: 'text',
			title: _('Enter connection'),
			success: function(response, newValue) {
				p.connection = newValue;
			},
			validate: function(value) {
				if (connections.indexOf(value) == -1) {
					return _('Invalid connection!');
				}
			},
			source: selectConnections,
			value: selectConnectionsInitial
		});

		let selectProtocols = [];
		for (let prot of protocols) {
			selectProtocols.push({value: prot, text: prot});
		}
		let selectProtocolsInitial = null;
		if (p != null) {
			selectProtocolsInitial = p.protocol;
		}

		protocol.editable({
			type: 'text',
			title: _('Enter protocol'),
			success: function(response, newValue) {
				p.protocol = newValue;
			},
			validate: function(value) {
				if (protocols.indexOf(value) == -1) {
					return _('Invalid protocol!');
				}
			},
			source: selectProtocols,
			value: selectProtocolsInitial
		});

		connectionParam.editable({
			type: 'text',
			title: _('Enter connection parameter'),
			success: function(response, newValue) {
				p.connectionParam = newValue;
			},
			validate: function(value) {
				if (v.Type.isString(value) == false) {
					return _('Insert valid connection parameter');
				}
			}
		});

		protocolParam.editable({
			type: 'text',
			title: _('Enter protocol parameter'),
			success: function(response, newValue) {
				if (v.Type.isString(newValue) == false) {
					return _('Insert valid protocol parameter');
				}
				p.protocolParam = newValue;
			},
			validate: function(value) {
				if (v.Type.isString(value) == false) {
					return _('Insert valid connection parameter');
				}
			}
		});

		//add inverters
		let inverterList = [];
		for (let i of plantInverters) {
			let inverter = new Inverter(i, this);
			inverterList.push(inverter);
			$plant.find('*[data-inverterRows]').append(inverter.$inverter);
		}

		$plant.find('.saveButton').click($.proxy(function() {
			this.savePlant($plant, p);
			
		}, this));

		$plant.find('.scanButton').click($.proxy(function() {
			this.scanForInverters();
		}, this));

		$plant.find('.addInverterButton').click($.proxy(function() {
			this.addNewInverter();
		}, this));

		$plant.find('.deletePlantButton').click($.proxy(function() {
			this.deletePlant();
		}, this));

		this.plant     = p;
		this.$plant    = $plant;
		this.inverters = inverterList;
	}

	addNewInverter() {
		let inv = new Inverter(null, this);
		this.inverters.push(inv);
		this.$plant.find('*[data-inverterRows]').append(inv.$inverter);
	}

	removeInverter(inverter) {
		inverters = inverters.filter(item => item !== inverter);
	}

	deletePlant() {
		if (this.plant.id == null) {
			this.$plant.remove();
		}
	}

	savePlant() {
		//validate plant data
		console.log("Saving plant");
		console.log(this.plant);

		var editables =  this.$plant.find('.editable');
		var plantValidation = editables.editable('validate');
		if (!$.isEmptyObject(plantValidation)) {
			console.log("Validation error: ")
			console.log(plantValidation);
			return;
		}

		for (let inverterData of this.inverters) {
			let inverter = inverterData.inverter;
			let $inverter = inverterData.$inverter;
			$.ajax({
				type: 'POST',
				url: SCRIPT_ROOT + '/saveInverter',
				data: JSON.stringify(inverter),
				dataType: 'json',
				contentType: 'application/json; charset=utf-8'
			}).done(function(result) {
				inverter.id = result;
				$inverter.find('.editable').removeClass('editable-unsaved');
			});
		}

		$.ajax({
			type: 'POST',
			url: SCRIPT_ROOT + '/savePlant',
			data: JSON.stringify(this.plant),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8'
		}).done($.proxy(function(result) {
			this.plant.id = result;
			this.$plant.find('.editable').removeClass('editable-unsaved');
			//let id  = row.find('*[data-id]');
			this.$plant.find('*[data-id]').html(this.plant.id);
		}, this));
	}

	isExistingInverter(inverterId) {
		for (inverter of this.inverters) {
			if (inverter.inverter.id != null && inverter.inverter.id == inverterId) {
				return true;
			}
		}
	}

	scanForInverters() {
		$.ajax({
			type: 'POST',
			url: SCRIPT_ROOT + '/scanForInverters',
			data: JSON.stringify(this.plant),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8'
		}).done($.proxy(function(result) {
			for (inverterId of result) {
				if (!this.isExistingInverter(inverterId)) {
					let inverter = new Inverter({inverterId: inverterId}, this);;
					inverters.push(inverter);
					$plant.find('*[data-inverterRows]').append(inverter.$inverter);
				}
			}
		}, this));
	}
}

function createPlants(plants, inverters) {
	for (let p of plants) {
		let plant = new Plant(p);

		$('#plants').append(plant.$plant);
	}
}

$(function() {
	//load all plants and inverters
	createPlants(plants, inverters);

	$('#addPlantButton').click(function() {
		let p = new Plant(null);
		$('#plants').append(p.$plant);
		//p.find('.editable').addClass('editable-empty');
	});
	
	
});