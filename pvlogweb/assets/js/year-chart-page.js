import {createHighchartSeries} from 'chart';
import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import 'bootstrap-datepicker';
import moment from 'moment';
import 'jquery';

$(function () {
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };

	$('#chartNav').addClass('collapse in');
	$('#year').addClass("active");

	$('#datepicker').datepicker( {
		useCurrent: false,
		format: "yyyy",
		startView: "years",
		minViewMode: "years",
		defaultViewDate: {"year": curDate.getFullYear() }
	}).on('changeDate', function(e) {
	location.href = SCRIPT_ROOT + "/yearly/" + e.date.getFullYear()
	});

	var chartData = createHighchartSeries(data, 0, inverters);

	Highcharts.chart('chart', {
		title: {
			text: _('Month Data'),
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
				text : _('Date')
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
				text: _('Energy'),
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
			column: {
				stacking: 'normal'
			},
			series : {
				cursor : 'pointer',
				point : {
					events : {
						click : function() {
							var d = moment(this.category)
							location.href = SCRIPT_ROOT + "/monthly/" + d.format("YYYY-MM");
						}
					}
				}
			}
		},
		series: chartData
	});
})
