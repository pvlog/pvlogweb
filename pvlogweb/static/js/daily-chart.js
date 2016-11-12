//$(document).ready(function() {
//	var plot1 = $.jqplot('daily-chart', [ ac_total_energy, ac_total_power ], {
//		seriesColors: ["rgba(78, 135, 194, 0.7)", "orange"],
//		title : 'Daily Power Production',
//	    highlighter: {
//            show: true,
//            sizeAdjust: 4,
//            tooltipOffset: 9,
//            fadeToolTip: true,
//            bringSeriesToFront: false
//        },
////		axesDefaults : {
////			labelRenderer : $.jqplot.CanvasAxisLabelRenderer
////		},
//		seriesDefaults : {
//			rendererOptions : {
//				smooth : true
//			}
//		},
//		legend : {
//			show : true,
//			placement : 'inside'
//		},
//	    seriesDefaults: {
//            rendererOptions: {
//                smooth: true,
//                animation: {
//                    show: false
//                }
//            },
//            showMarker: false
//        },
//        grid: {
//            drawBorder: false,
//            shadow: true,
//            gridLineWidth: 1
//        },
//		axes : {
//			// options for each axis are specified in seperate option objects.
//			xaxis : {
//				label : "Time",
//				pad: 1
//			},
//			yaxis : {
//				label : "Power"
//			},
//			y2axis : {
//				label : "Energy"
//			}
//		},
//		series : [ {
//			yaxis : 'y2axis',
//			fill : true,
//			label : 'Power',
//			neighborThreshold: 40
//		}, {
//			yaxis : 'yaxis',
//			label : 'Energy',
//			neighborThreshold: 40
//		} ],
//	});
//});
//
//$('.jqplot-highlighter-tooltip').addClass('ui-corner-all')

//$(document).ready(function() {
//	var trace1 = {
//		x : ac_total_power[0],
//		y : ac_total_power[1],
//		mode : 'lines',
//		name : 'Scatter'
//	};
//
//	var trace2 = {
//		x : ac_total_energy[0],
//		y : ac_total_energy[1],
//		mode : 'lines',
//		name : 'Lines',
//		fill : 'tozeroy',
//		yaxis: 'y2',
//	};
//
//	var data = [ trace1, trace2 ];
//
//	var layout = {
//		title : 'Daily Data',
//		xaxis : {
//			title : 'x-axis title',
//			zeroline: false
//		},
//		yaxis : {
//			title : 'y-axis title',
//			zeroline: false,
//			//autorange: true
//		},
//		yaxis2 : {
//			title : 'yaxis2 title',
//			overlaying : 'y',
//			side : 'right',
//			zeroline: false,
//			showgrid: false
//			//autorange: true
//		},
//		yaxis3 : {
//			title : 'yaxis3 title 2222',
//			overlaying : 'y',
//			side : 'right',
//			zeroline: false,
//			showgrid: false
//			//autorange: true
//		},
//		yaxis4 : {
//			title : 'yaxis4 title',
//			overlaying : 'y',
//			side : 'right',
//			zeroline: false,
//			showgrid: false
//			//autorange: true
//		}
//	};
//
//	var d3 = Plotly.d3;
//	var WIDTH_IN_PERCENT_OF_PARENT = 100, HEIGHT_IN_PERCENT_OF_PARENT = 50;
//
//	var gd3 = d3.select("div[id='daily-chart']").style({
//		width : WIDTH_IN_PERCENT_OF_PARENT + '%',
//	//	'margin-left' : (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
//		height : HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
//	//	'margin-top' : '1%',
//		'min-height': '400px'
//	});
//	var my_Div = gd3.node();
//
//	Plotly.newPlot(my_Div, data, layout, {
//		displayModeBar : false
//	});
//
//	window.onresize = function() {
//		console.log('resize')
//		Plotly.Plots.resize(my_Div)
//	}
//});

function zip(array_1, array_2) {
	var c = [];
	for(var i = 0; i < array_2.length; i++){
	   c.push([array_1[i], array_2[i]]);
	}
	
	return c;
}

function extractInverterData(inverter_day_data) {
	//generate all series data
	var data = {
		//times: [],
		total_power: [],
		frequency: [],
		tracker_power: {},
		tracker_voltage: {},
		tracker_current: {},
		phases_power: {},
		phases_voltage: {},
		phases_current: {}
	};
	
	for (var time_key in inverter_day_data) {
		var spot_data = inverter_day_data[time_key];
		time = time_key * 1000; //convert to milliseconds
		
		var value = {};
		
		data.frequency.push([time, spot_data["frequency"] / 1000]);
		
		data.total_power.push([time, spot_data["power"]]);
		
		for (var tracker_key in spot_data["dc_inputs"]) {
			var tracker = spot_data["dc_inputs"][tracker_key];
			
			if (!data.tracker_power[tracker_key]) {
				data.tracker_power[tracker_key] = [];
			}
			data.tracker_power[tracker_key].push([time, tracker["power"]]);
			
			if (!data.tracker_voltage[tracker_key]) {
				data.tracker_voltage[tracker_key] = [];
			}
			data.tracker_voltage[tracker_key].push([time, tracker["voltage"] /1000]);
			
			if (!data.tracker_current[tracker_key]) {
				data.tracker_current[tracker_key] = [];
			}
			data.tracker_current[tracker_key].push([time, tracker["current"] / 1000]);
		}
		
		for (var phase_key in spot_data["phases"]) {
			var phase = spot_data["phases"][phase_key];
			
			var value = {};
			
			if (!data.phases_power[phase_key]) {
				data.phases_power[phase_key] = [];
			}
			data.phases_power[phase_key].push([time, phase["power"]]);
			
			if (!data.phases_voltage[phase_key]) {
				data.phases_voltage[phase_key] = [];
			}
			data.phases_voltage[phase_key].push([time, phase["voltage"] / 1000]);
			
			if (!data.phases_current[phase_key]) {
				data.phases_current[phase_key] = [];
			}
			data.phases_current[phase_key].push([time, phase["current"] / 1000]);
		}
	}
	
	return data;
}

function extractInverterDataSeries(day_data) {
	var data = {};
	
	for (var inverter_id in day_data) {
		data[inverter_id] = extractInverterData(day_data[inverter_id]);
	}
	
	return data;
}

function createHighchartSeries(day_data) {
	var invertersData = extractInverterDataSeries(day_data);
	var series = [];
	
	for (var inverterId in invertersData ) {
		var data = invertersData[inverterId];
		
		series.push({
			name: "Power",
			data: data.total_power,
			type: 'line',
			yAxis: 0,
			inverter_id: inverterId,
			data_type: "power",
			tooltip : {
				valueSuffix: ' W'
			},
            marker: {
                enabled: true,
                radius: 2
            }
		});
		
		series.push({
			name: "Frequency",
			data: data.frequency,
			type: 'line',
			yAxis: 1,
			inverter_id: inverterId,
			data_type: "frequency",
			visible: false,
			tooltip : {
				valueDecimals : 2,
				valueSuffix: ' Hz'
			},
            marker: {
                enabled: true,
                radius: 2
            }
		});
		
		for (var tracker in data.tracker_power) {
			series.push({
				name: "Tracker " + tracker + " Power ",
				data: data.tracker_power[tracker],
				type: 'line',
				yAxis: 0,
				inverter_id: inverterId,
				data_type: "power",
				visible: false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix: ' W'
				},
	            marker: {
	                enabled: true,
	                radius: 2
	            }
			});
		}
		
		for (var tracker in data.tracker_voltage) {
			series.push({
				name: "Tracker " + tracker + " Voltage ",
				data: data.tracker_voltage[tracker],
				type: 'line',
				yAxis: 2,
				inverter_id: inverterId,
				data_type: "voltage",
				visible: false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix: ' V'
				},
	            marker: {
	                enabled: true,
	                radius: 2
	            }
			});
		}
		
		for (var tracker in data.tracker_current) {
			series.push({
				name: "Tracker " + tracker + " Current",
				data: data.tracker_current[tracker],
				type: 'line',
				yAxis: 3,
				inverter_id: inverterId,
				data_type: "current",
				visible: false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix: ' A'
				},
	            marker: {
	                enabled: true,
	                radius: 2
	            }
			});
		}
		for (var phase in data.phases_power) {
			series.push({
				name: "Phase " + phase + " Power ",
				data: data.phases_power[phase],
				type: 'line',
				yAxis: 0,
				inverter_id: inverterId,
				data_type: "power",
				visible: false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix: ' W'
				},
	            marker: {
	                enabled: true,
	                radius: 2
	            }
			});
		}
		
		for (var phase in data.phases_voltage) {
			series.push({
				name: "Phase " + phase + " Voltage ",
				data: data.phases_voltage[phase],
				type: 'line',
				yAxis: 2,
				inverter_id: inverterId,
				data_type: "voltage",
				visible: false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix: ' V'
				},
	            marker: {
	                enabled: true,
	                radius: 2
	            }
			});
		}
		
		for (var phase in data.phases_current) {
			series.push({
				name: "Phase " + phase + " Current",
				data: data.phases_current[phase],
				type: 'line',
				yAxis: 3,
				inverter_id: inverterId,
				data_type: "current",
				visible: false,
				tooltip : {
					valueDecimals : 2,
					valueSuffix: ' A'
				},
	            marker: {
	                enabled: true,
	                radius: 2
	            }
			});
		}
	}
	
	return series;
}

$(function () {
	var chart_data = createHighchartSeries(data);

	$('#daily-chart').highcharts({
		title: {
			text: 'Day Data',
			x: -20 // center
		},
		subtitle: {
			text: 'Pvlog',
			x: -20
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
		yAxis: [{
			labels: {
				format: '{value} W',
				style: {
					// color: Highcharts.getOptions().colors[2]
				}
			},
			title: {
				text: 'Power',
				style: {
					//color: Highcharts.getOptions().colors[2]
				}
			},
			showEmpty: false
		}, { // Secondary yAxis
			//gridLineWidth: 0,
			title: {
				text: 'Frequency',
				style: {
					//color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value} Hz',
				style: {
					//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty: false
		}, { // third yAxis
			//gridLineWidth: 0,
			title: {
				text: 'Voltage',
				style: {
					//color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value} V',
				style: {
					//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty: false
		}, { // fourth yAxis
			//gridLineWidth: 0,
			title: {
				text: 'Current',
				style: {
					//color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value} A',
				style: {
					//color: Highcharts.getOptions().colors[0]
				}
			},
			showEmpty: false
		}],
		tooltip: {
			shared: true
		},
		legend: {
			enable: true,
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		series: chart_data
	});
});