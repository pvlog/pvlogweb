$(function () {
	var chartData = createHighchartSeries(data, 0);

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
				month : '%b',
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
							var d = new Date(this.category)
							var year = d.getFullYear();
							var month = String("00" + (d.getMonth() + 1)).slice(-2);
							location.href = SCRIPT_ROOT + "/monthly/" + year + "-" + month;
						}
					}
				}
			}
		},
		series: chartData
	});
});