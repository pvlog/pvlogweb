function zip(array_1, array_2) {
	var c = [];
	for(var i = 0; i < array_2.length; i++){
	   c.push([array_1[i], array_2[i]]);
	}
	
	return c;
}

function extractInverterData(inverter_data) {
	//generate all series data
	var data = [];
	
	for (var date_key in inverter_data) {
		var d = inverter_data[date_key];
		time = Date.parse(date_key); //convert to milliseconds
		
		data.push([time, d / 1000]);
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
			name: inverterId,
			data: data,
			type: 'column',
			yAxis: 0,
			inverter_id: inverterId,
			data_type: "power",
			tooltip : {
				valueSuffix: ' kWh'
			}
		});
	}
	return series;
}

$(function () {
	var chart_data = createHighchartSeries(data);

	$('#chart').highcharts({
		title: {
			text: 'Month Data',
			x: -20 // center
		},
		subtitle: {
			text: 'Pvlog',
			x: -20
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
		yAxis: [{
			labels: {
				format: '{value} kWh',
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
			showEmpty: false,
			tooltip : {
				valueDecimals : 2,
				valueSuffix: 'kWh'
			}
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