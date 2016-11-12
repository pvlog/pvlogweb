function extractInverterData(inverterData) {
	// generate all series data
	var data = [];

	for ( var dateKey in inverterData) {
		var d = inverterData[dateKey];
		time = Date.parse(dateKey); // convert to milliseconds

		data.push([ time, d / 1000 ]);
	}

	return data;
}

$(function() {
	var invData = [];
	for ( var inverter_id in data) {
		invData[inverter_id] = extractInverterData(data[inverter_id]);
	}

	var chart_data = createHighchartSeries(invData);

	$('#chart').highcharts({
		title : {
			text : 'Month Data',
			x : -20
		// center
		},
		subtitle : {
			text : 'Pvlog',
			x : -20
		},
		xAxis : {
			type : 'datetime',
			dateTimeLabelFormats : { // don't display the dummy year
				month : '%e. %b',
				year : '%b'
			},
			title : {
				text : 'Date'
			}
		},
		yAxis : [ {
			labels : {
				format : '{value} kWh',
				style : {
				// color: Highcharts.getOptions().colors[2]
				}
			},
			title : {
				text : 'Energy',
				style : {
				// color: Highcharts.getOptions().colors[2]
				}
			},
			showEmpty : false,
			tooltip : {
				valueDecimals : 2,
				valueSuffix : 'kWh'
			}
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