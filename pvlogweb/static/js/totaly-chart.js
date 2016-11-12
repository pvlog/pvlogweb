$(function () {
	var chart_data = createHighchartSeries(data, 0);

	$('#chart').highcharts({
		title: {
			text: 'Year Data',
			x: -20 // center
		},
		subtitle: {
			text: 'Pvlog',
			x: -20
		},
		xAxis : {
			type : 'datetime',
//			dateTimeLabelFormats : { // don't display the dummy year
//				month : '%b',
//				year : '%b'
//			},
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
				text: 'Energy',
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
		plotOptions : {
			series : {
				cursor : 'pointer',
				point : {
					events : {
						click : function() {
							var year = new Date(this.category).getFullYear();
							location.href = SCRIPT_ROOT + "/yearly/" + year
						}
					}
				}
			}
		},
		series : chart_data
	});
});