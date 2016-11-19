function extractInverterData(inverter_day_data) {
	//generate all series data
	var data = {
		//times: [],
		total_power : [],
		frequency : [],
		tracker_power : {},
		tracker_voltage : {},
		tracker_current : {},
		phases_power : {},
		phases_voltage : {},
		phases_current : {}
	};

	for ( var time_key in inverter_day_data) {
		var spot_data = inverter_day_data[time_key];
		time = time_key * 1000; //convert to milliseconds

		var value = {};

		data.frequency.push([ time, spot_data["frequency"] / 1000 ]);

		data.total_power.push([ time, spot_data["power"] ]);

		for ( var tracker_key in spot_data["dc_inputs"]) {
			var tracker = spot_data["dc_inputs"][tracker_key];

			if (!data.tracker_power[tracker_key]) {
				data.tracker_power[tracker_key] = [];
			}
			data.tracker_power[tracker_key].push([ time, tracker["power"] ]);

			if (!data.tracker_voltage[tracker_key]) {
				data.tracker_voltage[tracker_key] = [];
			}
			data.tracker_voltage[tracker_key].push([ time,
					tracker["voltage"] / 1000 ]);

			if (!data.tracker_current[tracker_key]) {
				data.tracker_current[tracker_key] = [];
			}
			data.tracker_current[tracker_key].push([ time,
					tracker["current"] / 1000 ]);
		}

		for ( var phase_key in spot_data["phases"]) {
			var phase = spot_data["phases"][phase_key];

			var value = {};

			if (!data.phases_power[phase_key]) {
				data.phases_power[phase_key] = [];
			}
			data.phases_power[phase_key].push([ time, phase["power"] ]);

			if (!data.phases_voltage[phase_key]) {
				data.phases_voltage[phase_key] = [];
			}
			data.phases_voltage[phase_key]
					.push([ time, phase["voltage"] / 1000 ]);

			if (!data.phases_current[phase_key]) {
				data.phases_current[phase_key] = [];
			}
			data.phases_current[phase_key]
					.push([ time, phase["current"] / 1000 ]);
		}
	}

	return data;
}

function extractInverterDataSeries(day_data) {
	var data = {};

	for ( var inverter_id in day_data) {
		data[inverter_id] = extractInverterData(day_data[inverter_id]);
	}

	return data;
}

function createHighchartSeries(day_data) {
	var invertersData = extractInverterDataSeries(day_data);
	var series = [];

	for (var inverterId in invertersData) {
		var data = invertersData[inverterId];

		series.push({
			name : "Power",
			data : data.total_power,
			type : 'line',
			yAxis : 0,
			inverter_id : inverterId,
			data_type : "power",
			tooltip : {
				valueSuffix : ' W',
				valueDecimals : 0
			},
			marker : {
				enabled : true,
				radius : 2
			}
		});

		series.push({
			name : "Frequency",
			data : data.frequency,
			type : 'line',
			yAxis : 1,
			inverter_id : inverterId,
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

		for (var tracker in data.tracker_power) {
			series.push({
				name : "Tracker " + tracker + " Power ",
				data : data.tracker_power[tracker],
				type : 'line',
				yAxis : 0,
				inverter_id : inverterId,
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

		for (var tracker in data.tracker_voltage) {
			series.push({
				name : "Tracker " + tracker + " Voltage ",
				data : data.tracker_voltage[tracker],
				type : 'line',
				yAxis : 2,
				inverter_id : inverterId,
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

		for (var tracker in data.tracker_current) {
			series.push({
				name : "Tracker " + tracker + " Current",
				data : data.tracker_current[tracker],
				type : 'line',
				yAxis : 3,
				inverter_id : inverterId,
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
		for (var phase in data.phases_power) {
			series.push({
				name : "Phase " + phase + " Power ",
				data : data.phases_power[phase],
				type : 'line',
				yAxis : 0,
				inverter_id : inverterId,
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

		for (var phase in data.phases_voltage) {
			series.push({
				name : "Phase " + phase + " Voltage ",
				data : data.phases_voltage[phase],
				type : 'line',
				yAxis : 2,
				inverter_id : inverterId,
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

		for (var phase in data.phases_current) {
			series.push({
				name : "Phase " + phase + " Current",
				data : data.phases_current[phase],
				type : 'line',
				yAxis : 3,
				inverter_id : inverterId,
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
	var chart_data = createHighchartSeries(data);

	$('#daily-chart').highcharts({
		title : {
			text : 'Day Data',
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
				text : 'Time'
			}
		//			data: chart_data.times
		},
		yAxis : [ {
			labels : {
				format : '{value} W',
				style : {
				// color: Highcharts.getOptions().colors[2]
				}
			},
			title : {
				text : 'Power',
				style : {
				//color: Highcharts.getOptions().colors[2]
				}
			},
			showEmpty : false
		}, { // Secondary yAxis
			//gridLineWidth: 0,
			title : {
				text : 'Frequency',
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
				text : 'Voltage',
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
				text : 'Current',
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
		} ],
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
		series : chart_data
	});
});