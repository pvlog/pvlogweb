import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import 'bootstrap-datepicker';
import 'jquery';
import * as ko from 'knockout';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

function extractInverterData(inverterDayData) {
	//generate all series data
	var data = {
		totalPower: [],
		dayYield: [],
		frequency: [],
		trackerTotalPower: [],
		efficiency: [],
		trackerPower : {},
		trackerVoltage : {},
		trackerCurrent : {},
		phasesPower : {},
		phasesVoltage : {},
		phasesCurrent : {}
	};

	for (let timeKey in inverterDayData) {
		let spotData = inverterDayData[timeKey];
		let time = timeKey * 1000; //convert to milliseconds

		let value = {};

		if ("frequency" in data) {
			data.frequency.push([ time, spotData["frequency"] / 1000] );
		}

		if ("dayYield" in data) {
			data.dayYield.push([ time, spotData["dayYield"] / 1000])
		}

		data.totalPower.push([ time, spotData["power"]]);

		let trackerTotalPower = 0;
		for (let tracker_key in spotData["dc_inputs"]) {
			var tracker = spotData["dc_inputs"][tracker_key];

			if (!data.trackerPower[tracker_key]) {
				data.trackerPower[tracker_key] = [];
			}
			data.trackerPower[tracker_key].push([ time, tracker["power"]]);
			trackerTotalPower += tracker["power"]

			if (!data.trackerVoltage[tracker_key]) {
				data.trackerVoltage[tracker_key] = [];
			}
			data.trackerVoltage[tracker_key].push([ time,
					tracker["voltage"] / 1000]);

			if (!data.trackerCurrent[tracker_key]) {
				data.trackerCurrent[tracker_key] = [];
			}
			data.trackerCurrent[tracker_key].push([ time,
					tracker["current"] / 1000 ]);
		}

		data.trackerTotalPower.push([time, trackerTotalPower]);
		data.efficiency.push([time, spotData["power"] / trackerTotalPower * 100]);

		for (let phase_key in spotData["phases"]) {
			let phase = spotData["phases"][phase_key];

			let value = {};

			if (!data.phasesPower[phase_key]) {
				data.phasesPower[phase_key] = [];
			}
			data.phasesPower[phase_key].push([ time, phase["power"]]);

			if (!data.phasesVoltage[phase_key]) {
				data.phasesVoltage[phase_key] = [];
			}
			data.phasesVoltage[phase_key]
					.push([ time, phase["voltage"] / 1000]);

			if (!data.phasesCurrent[phase_key]) {
				data.phasesCurrent[phase_key] = [];
			}
			data.phasesCurrent[phase_key]
					.push([ time, phase["current"] / 1000]);
		}
	}

	return data;
}

function extractInverterDataSeries(dayData) {
	var data = {};

	for (let inverterId in dayData) {
		data[inverterId] = extractInverterData(dayData[inverterId]);
	}

	return data;
}


const dashStyles = [
	'Solid',
	'Dash',
	'ShortDot',
	'ShortDashDot',
	'ShortDashDotDot',
	'Dot',
	'ShortDash',
	'LongDash',
	'DashDot',
	'LongDashDot',
	'LongDashDotDot'
];

function createHighchartSeries(dayData) {
	let gt = new Gettext({domain: 'pvlogweb'});
	let _ = function(msgid) { return gt.gettext(msgid); };
	
	let invertersData = extractInverterDataSeries(dayData);
	let series = [];

	let dashStyleIdx = 0;
	for (let inverterId in invertersData) {
		const dashStyle = dashStyles[dashStyleIdx];
		dashStyleIdx = (dashStyleIdx + 1) % dashStyle.length;
		let data = invertersData[inverterId];

		series.push({
			name : _("Power AC"),
			dashStyle : dashStyle,
			typeId : 'powerAc',
			data : data.totalPower,
			type : 'line',
			yAxis : 0,
			inverterId : inverterId,
			data_type : "power",
			visible : false,
			tooltip : {
				valueSuffix : ' W',
				valueDecimals : 1
			},
			marker : {
				enabled : false,
				//radius : 2
			}
		});

		series.push({
			name : _("Frequency"),
			dashStyle : dashStyle,
			typeId : 'frequency',
			data : data.frequency,
			type : 'line',
			yAxis : 1,
			inverterId : inverterId,
			data_type : "frequency",
			visible : false,
			tooltip : {
				valueDecimals : 3,
				valueSuffix : ' Hz'
			},
			marker : {
				enabled : false,
				//radius : 2
			}
		});

		series.push({
			name : _("Current Day Yield"),
			dashStyle : dashStyle,
			typeId: 'dayYield',
			data : data.dayYield,
			type : 'area',
			fillOpacity: 0.2,
			yAxis : 5,
			inverterId : inverterId,
			data_type : "kWh",
			visible : true,
			tooltip : {
				valueDecimals : 3,
				valueSuffix : ' kWh'
			},
			marker : {
				enabled : false,
				//radius : 2
			}
		});

		series.push({
			name : _("Power DC"),
			dashStyle : dashStyle,
			typeId : 'powerDc',
			data : data.trackerTotalPower,
			type : 'line',
			yAxis : 0,
			inverterId : inverterId,
			data_type : "power",
			visible : false,
			tooltip : {
				valueDecimals : 1,
				valueSuffix : ' W'
			},
			marker : {
				enabled : false,
				//radius : 2
			}
		});

		series.push({
			name : _("Efficiency"),
			dashStyle : dashStyle,
			typeId : 'efficiency',
			data : data.efficiency,
			type : 'line',
			yAxis : 4,
			inverterId : inverterId,
			data_type : "percent",
			visible : false,
			tooltip : {
				valueDecimals : 2,
				valueSuffix : ' %'
			},
			marker : {
				enabled : false,
				//radius : 2
			}
		});

		for (let tracker in data.trackerPower) {
			series.push({
				name : "Tracker " + tracker + " Power ",
				dashStyle : dashStyle,
				typeId : 'trackerPower' + tracker,
				data : data.trackerPower[tracker],
				type : 'line',
				yAxis : 0,
				inverterId : inverterId,
				data_type : "power",
				visible : false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix : ' W'
				},
				marker : {
					enabled : false,
					//radius : 2
				}
			});
		}

		for (let tracker in data.trackerVoltage) {
			series.push({
				name : "Tracker " + tracker + " Voltage ",
				dashStyle : dashStyle,
				typeId : 'trackerVoltage' + tracker,
				data : data.trackerVoltage[tracker],
				type : 'line',
				yAxis : 2,
				inverterId : inverterId,
				data_type : "voltage",
				visible : false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix : ' V'
				},
				marker : {
					enabled : false,
					//radius : 2
				}
			});
		}

		for (let tracker in data.trackerCurrent) {
			series.push({
				name : "Tracker " + tracker + " Current",
				dashStyle : dashStyle,
				typeId : 'trackerCurrent' + tracker,
				data : data.trackerCurrent[tracker],
				type : 'line',
				yAxis : 3,
				inverterId : inverterId,
				data_type : "current",
				visible : false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix : ' A'
				},
				marker : {
					enabled : false,
					//radius : 2
				}
			});
		}

		for (let phase in data.phasesPower) {
			series.push({
				name : "Phase " + phase + " Power ",
				dashStyle : dashStyle,
				typeId : 'phasePower' + phase,
				data : data.phasesPower[phase],
				type : 'line',
				yAxis : 0,
				inverterId : inverterId,
				data_type : "power",
				visible : false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix : ' W'
				},
				marker : {
					enabled : false,
					//radius : 2
				}
			});
		}

		for (let phase in data.phasesVoltage) {
			series.push({
				name : "Phase " + phase + " Voltage ",
				dashStyle : dashStyle,
				typeId : 'phaseVoltage' + phase,
				data : data.phasesVoltage[phase],
				type : 'line',
				yAxis : 2,
				inverterId : inverterId,
				data_type : "voltage",
				visible : false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix : ' V'
				},
				marker : {
					enabled : false,
					//radius : 2
				}
			});
		}

		for (let phase in data.phasesCurrent) {
			series.push({
				name : "Phase " + phase + " Current",
				dashStyle : dashStyle,
				typeId : 'phaseCurrent' + phase,
				data : data.phasesCurrent[phase],
				type : 'line',
				yAxis : 3,
				inverterId : inverterId,
				data_type : "current",
				visible : false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix : ' A'
				},
				marker : {
					enabled : false,
					//radius : 2
				}
			});
		}
	}

	return series;
}

ko.bindingHandlers.renderDashLine = {
	update: function(element, valueAccessor, allBindings) {
		let value = ko.utils.unwrapObservable(valueAccessor());
		console.log(allBindings.get('color'));
		let color = allBindings.get('color') || 'black';
		if (value) {
			$(element).empty();
			let $element = $(element)[0];
			let renderer = new Highcharts.Renderer($element, 100, 20);
			renderer.path(['M', 0, 10, 'L', 100, 10])
			.attr({
				'stroke-width': 2,
				stroke: color,
				dashstyle: value
			}).add();
		}
	}
};

function InverterModel(id, name, enabled, series, dashStyle) {
	var self = this;
	self.id   = id;
	self.name = name;
	self.series = series;
	self.dashStyle = dashStyle;
	self.enabled = ko.observable(enabled);
}

function TypeModel(typeId, name, series, enabled, color) {
	var self = this;
	self.typeId = typeId;
	self.name = name;
	self.series = series;
	self.enabled = ko.observable(enabled);
	self.color = color;
}

function Model(inverters, typesMap, series) {
	var self = this;
	self.inverters = [];
	self.invertersMap = {};
	self.types = [];
	self.typesMap = {};
	self.series = series;

	for (let i = 0; i < inverters.length; i++) {
		const dashStyleIdx = i % dashStyles.length;
		const inv = new InverterModel(inverters[i].id, inverters[i].name, true, series, dashStyles[dashStyleIdx]);
		self.invertersMap[inverters[i].id] = inv;
		self.inverters.push(inv);
	}

	for (let [type,  value] of typesMap.entries()) {
		let enabled = false;
		if (type == 'dayYield') {
			enabled = true;
		}
		const ty = new TypeModel(type, value.name, series, enabled, value.color);
		self.typesMap[type] = ty;
		self.types.push(ty);
	}

	self.toggleInverter = function(inverter) {
		if (inverter.enabled()) {
			for (let serie of self.series) {
				if (serie.options.inverterId == inverter.id) {
					serie.setVisible(false);
				}
			}
			inverter.enabled(false)
		} else {
			for (let serie of self.series) {
				if (serie.options.inverterId == inverter.id && self.typesMap[serie.options.typeId].enabled()) {
					serie.setVisible(true);
				}
			}
			inverter.enabled(true);
		}
	}

	self.toggleType = function(type) {
		if (type.enabled()) {
			for (let serie of self.series) {
				if (serie.options.typeId == type.typeId) {
					serie.setVisible(false);
				}
			}
			type.enabled(false);
		} else {
			for (let serie of self.series) {
				if (serie.options.typeId == type.typeId && self.invertersMap[serie.options.inverterId].enabled()) {
					serie.setVisible(true);
				}
			}
			type.enabled(true);
		}
	}
}


$(function() {
	$('#chartNav').addClass('collapse in');
	$('#day').addClass("active");

	var series = createHighchartSeries(data);
	let typesMap = new Map();
	for (let serie of series) {
		typesMap.set(serie.typeId, {name: serie.name});
	}

	let colorIdx = 0;
	const colors = Highcharts.getOptions().colors
	for (let typeData of typesMap.values()) {
		typeData.color = colors[colorIdx];
		colorIdx = (colorIdx + 1) % colors.length;
	}

	for (let serie of series) {
		serie.color = typesMap.get(serie.typeId).color;
	}

	$('#datepicker').datepicker( {
		useCurrent: false,
	}).on('changeDate', function(e) {
		var month =  String("00" + (e.date.getMonth() + 1)).slice(-2);
		var day   =  String("00" + (e.date.getDate())).slice(-2);
		var dayDate = e.date.getFullYear() + "-" + month + "-" + day
		location.href = SCRIPT_ROOT + "/daily/" + dayDate
	});

	let inverters = [];
	inverters.push({id: series[0].inverterId, name: 'sunnyboy1'});

	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});

	Highcharts.chart('daily-chart',{
		title : {
			text : _('Day Data'),
			x : -20
		// center
		},
		subtitle : {
			text : 'Pvlog',
			x : -20
		},
		xAxis : {
			type : 'datetime',
			title : {
				text : _('Time')
			}
		},
		yAxis : [ {
			labels : {
				format : '{value} W',
				style : {
				}
			},
			title : {
				text : _('Power'),
				style : {
				}
			},
			showEmpty : false
		}, { // Secondary yAxis
			title : {
				text : _('Frequency'),
				style : {
				}
			},
			labels : {
				format : '{value} Hz',
				style : {
				}
			},
			showEmpty : false
		}, { // third yAxis
			title : {
				text : _('Voltage'),
				style : {
				}
			},
			labels : {
				format : '{value} V',
				style : {
				}
			},
			showEmpty : false
		}, { // fourth yAxis
			title : {
				text : _('Current'),
				style : {
				}
			},
			labels : {
				format : '{value} A',
				style : {
				}
			},
			showEmpty : false
		}, { // fifth yAxis
			title : {
				text : "",
				style : {
				}
			},
			labels : {
				format : '{value} %',
				style : {
				}
			},
			showEmpty : false
		}, { // six yAxis
			title : {
				text : _('Energy'),
				style : {
				}
			},
			labels : {
				format : '{value} kWh',
				style : {
				}
			},
			showEmpty : false
		}
		],
		tooltip : {
			shared : true
		},
		legend : {
			enabled : false,
		},
		series : series
	},function (chart) {
		ko.applyBindings(new Model(inverters, typesMap, chart.series));
	});
});
