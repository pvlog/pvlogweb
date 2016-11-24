import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import 'bootstrap-datepicker';

function extractInverterData(inverterDayData) {
	//generate all series data
	var data = {
		//times: [],
		totalPower : [],
		frequency : [],
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

		data.frequency.push([ time, spotData["frequency"] / 1000 ]);

		data.totalPower.push([ time, spotData["power"] ]);

		let trackerTotalPower = 0;
		for (let tracker_key in spotData["dc_inputs"]) {
			var tracker = spotData["dc_inputs"][tracker_key];

			if (!data.trackerPower[tracker_key]) {
				data.trackerPower[tracker_key] = [];
			}
			data.trackerPower[tracker_key].push([ time, tracker["power"] ]);
			trackerTotalPower += tracker["power"]

			if (!data.trackerVoltage[tracker_key]) {
				data.trackerVoltage[tracker_key] = [];
			}
			data.trackerVoltage[tracker_key].push([ time,
					tracker["voltage"] / 1000 ]);

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
			data.phasesPower[phase_key].push([ time, phase["power"] ]);

			if (!data.phasesVoltage[phase_key]) {
				data.phasesVoltage[phase_key] = [];
			}
			data.phasesVoltage[phase_key]
					.push([ time, phase["voltage"] / 1000 ]);

			if (!data.phasesCurrent[phase_key]) {
				data.phasesCurrent[phase_key] = [];
			}
			data.phasesCurrent[phase_key]
					.push([ time, phase["current"] / 1000 ]);
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

function createHighchartSeries(dayData) {
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	//var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };
	
	var invertersData = extractInverterDataSeries(dayData);
	var series = [];

	for (let inverterId in invertersData) {
		let data = invertersData[inverterId];

		series.push({
			name : _("Power AC"),
			data : data.totalPower,
			type : 'line',
			yAxis : 0,
			inverterId : inverterId,
			data_type : "power",
			tooltip : {
				valueSuffix : ' W',
				valueDecimals : 1
			},
			marker : {
				enabled : true,
				radius : 2
			}
		});

		series.push({
			name : _("Frequency"),
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
				enabled : true,
				radius : 2
			}
		});

		series.push({
			name : _("Power DC"),
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
				enabled : true,
				radius : 2
			}
		});

		series.push({
			name : _("Efficiency"),
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
				enabled : true,
				radius : 2
			}
		});

		for (let tracker in data.trackerPower) {
			series.push({
				name : "Tracker " + tracker + " Power ",
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
					enabled : true,
					radius : 2
				}
			});
		}

		for (let tracker in data.trackerVoltage) {
			series.push({
				name : "Tracker " + tracker + " Voltage ",
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
					enabled : true,
					radius : 2
				}
			});
		}

		for (let tracker in data.trackerCurrent) {
			series.push({
				name : "Tracker " + tracker + " Current",
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
					enabled : true,
					radius : 2
				}
			});
		}

		for (let phase in data.phasesPower) {
			series.push({
				name : "Phase " + phase + " Power ",
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
					enabled : true,
					radius : 2
				}
			});
		}

		for (let phase in data.phasesVoltage) {
			series.push({
				name : "Phase " + phase + " Voltage ",
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
					enabled : true,
					radius : 2
				}
			});
		}

		for (let phase in data.phasesCurrent) {
			series.push({
				name : "Phase " + phase + " Current",
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
					enabled : true,
					radius : 2
				}
			});
		}
	}

	return series;
}

$(function() {
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };
	
	var charData = createHighchartSeries(data);
	
	$('#datepicker').datepicker( {
		useCurrent: false,
	}).on('changeDate', function(e) {
		var month =  String("00" + (e.date.getMonth() + 1)).slice(-2);
		var day   =  String("00" + (e.date.getDate())).slice(-2);
		var dayDate = e.date.getFullYear() + "-" + month + "-" + day
		location.href = SCRIPT_ROOT + "/daily/" + dayDate
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
			//			dateTimeLabelFormats : { // don't display the dummy year
			//				month : '%e. %b',
			//				year : '%b'
			//			},
			title : {
				text : _('Time')
			}
		//			data: charData.times
		},
		yAxis : [ {
			labels : {
				format : '{value} W',
				style : {
				// color: Highcharts.getOptions().colors[2]
				}
			},
			title : {
				text : _('Power'),
				style : {
				//color: Highcharts.getOptions().colors[2]
				}
			},
			showEmpty : false
		}, { // Secondary yAxis
			//gridLineWidth: 0,
			title : {
				text : _('Frequency'),
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			labels : {
				format : '{value} Hz',
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty : false
		}, { // third yAxis
			//gridLineWidth: 0,
			title : {
				text : _('Voltage'),
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			labels : {
				format : '{value} V',
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty : false
		}, { // fourth yAxis
			//gridLineWidth: 0,
			title : {
				text : _('Current'),
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			labels : {
				format : '{value} A',
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty : false
		}, { // fifth yAxis
			//gridLineWidth: 0,
			title : {
				text : "",
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			labels : {
				format : '{value} %',
				style : {
				//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty : false
		},
		],
		tooltip : {
			shared : true
		},
		legend : {
			enable : true,
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : charData
	});
});