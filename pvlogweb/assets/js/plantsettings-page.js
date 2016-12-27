import Gettext from 'node-gettext';
import * as v from 'valib';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

function createInverter(i) {
	var templateRow = $('#inverterRowTemplate');
	var row = templateRow.clone().removeAttr('id').removeAttr('style');
	
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
	
	row.find('.deleteInverterButton').click(function() {
		deleteInverter(row, i);
	});
	
	
	return row;
}

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

function createInverters(inverters, plantId) {
	var rows = [];
	
	for (let i of inverters) {
		if (i.plantId == plantId) {
			let row = createInverter(i);
			rows.push(row);
		}
	}
	
	return rows;
}

function createPlant(p) {
	var plantTemplate = $('#plantsTemplate')
	var $plant = plantTemplate.clone().removeAttr('id').removeAttr('style');
	
	var id   = $plant.find('*[data-id]')
	var name = $plant.find('*[data-name]')
	var connection = $plant.find('*[data-connection]')
	var protocol = $plant.find('*[data-protocol]')
	var connectionParam = $plant.find('*[data-connectionParameter]')
	var protocolParam   = $plant.find('*[data-protocolParameter]')
	
	if (p != null) {
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
				if (v.Type.isString(newValue) == false) {
					return _('Insert valid name');
				}
				p.name = newValue;
			}
	});
	
	let selectConnections = [];
	for (let con of connections) {
		selectConnections.push({value: con, text: con});
	}
	let selectConnectionsInitial = null;
	if (p != null) {
		selectConnectionsInitial = p.connections;
	}
	
	connection.editable({
		type: 'text',
		title: _('Enter connection'),
		success: function(response, newValue) {
			//TODO validate
			p.connection = newValue;
			return true
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
		source: selectProtocols,
		value: selectProtocolsInitial
	});
	
	connectionParam.editable({
		type: 'text',
		title: _('Enter connection parameter'),
		success: function(response, newValue) {
			if (v.Type.isString(newValue) == false) {
				return _('Insert valid connection parameter');
			}
			p.connectionParam = newValue;
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
		}
	});
	
//	$(name).on('save', function(e, params) {
//		alert('Saved value: ' + params.newValue);
//		console.log(params);
//	});
	
	$plant.find('.saveButton').click(function() {
		savePlant(p);
		
	});
	
	$plant.find('.scanButton').click(function() {
		scanForInverters(p);
	});
	
	$plant.find('.addInverterButton').click(function() {
		let inv = createInverter(null);
		$plant.find('*[data-inverterRows]').append(inv);
		
	});
	
	$plant.find('.deletePlantButton').click(function() {
		deleteInverter($plant, p);
		
	});
	
//	$('#scanForInvertes').click(scanForInverters(plant));
	
	return $plant
}

function savePlant(plant) {
	//validate plant data
	console.log("Saving plant");
	console.log(plant);
	var plantValidation = $('#plant-' + plant.id + '.editable').editable('validate');
	if (!$.isEmptyObject(plantValidation)) {
		console.log("Validation error: " +  plantValidation);
		return;
	}
	
	$.ajax({
		type: 'POST',
		url: SCRIPT_ROOT + '/savePlant',
		data: JSON.stringify(plant),
		dataType: 'json',
		contentType: 'application/json; charset=utf-8'
	}).done(function(result) {
		plant.id = result;
		$('#plant-' + plant.id + ' .editable').removeClass('editable-unsaved');
	});

	for (let inverter of inverters) {
		if (inverter.plantId = plant.id) {
			let inverterValidation = $('#inverter-' + inverter.id + '.editable').editable('validate');
			if (!$.isEmptyObject(inverterValidation)) {
				console.log("Inverter Validation error: ");
				return;
			}
			
			$.ajax({
				type: 'POST',
				url: SCRIPT_ROOT + '/saveInverter',
				data: JSON.stringify(inverter),
				dataType: 'json',
				contentType: 'application/json; charset=utf-8'
			}).done(function(result) {
				inverter.id = result;
				$('#inverter-' + plant.id + ' .editable').removeClass('editable-unsaved');
			});
		}
	}
}

function existsInverter(inverterId) {
	for (existingInverters of inverters) {
		if (inverterId = existingInverters.id) {
			return true;
		}
	}
	
	return false;
}

function scanForInverters(plant) {
	$.getJSON(SCRIPT_ROOT + '/scanForInverters', {plantId: plant.id}, function(result) {
		for (inverterId of result) {
			if (!existsInverter(inverterId)) {
				let inverter = createInverter({inverterId: inverterId});
				$('#plant-' + plant.id).find('*[data-inverterRows]').append(inverter);
			}
		}
	});
}

function createPlants(plants, inverters) {
	for (let p of plants) {
		let inverterRows = createInverters(inverters, p.id);
		
		let plant = createPlant(p);
		
		
		for (let i of inverterRows) {
			// plant.find('*[data-inverterRows]').append(inverterRows.join(''));
			plant.find('*[data-inverterRows]').append(i);
		}
		
		$('#plants').append(plant);
	}
}

//function createEditable(plants, inverters) {
//	for (let p of plants) {
//		
//	}
//}



//function loadInverters() {
//	$.getJSON(SCRIPT_ROOT + '/get_plants', {}, function(plants) {
//		$.getJSON(SCRIPT_ROOT + "/get_inverters", {}, function(inverters) {
//			createPlants(plants, inverters);
//			
//			//create editable
//			createEditable(plants, inverters);
//		});
//	});
//	
//}



$(function() {
	//load all plants and inverters
	createPlants(plants, inverters);
	
	$('#addPlantButton').click(function() {
		let p = createPlant(null);
		$('#plants').append(p);
		//p.find('.editable').addClass('editable-empty');
	});
	
	
});