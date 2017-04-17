import {createHighchartSeries} from 'chart';
import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import 'bootstrap-datepicker';
import 'jquery';

$(function () {
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	//var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };

	$('#chartNav').addClass('collapse in');
	$('#total').addClass("active");
	
	var chartData = createHighchartSeries(data, 0, inverters);

	Highcharts.chart('chart', {
		title: {
			text: _('Year Data'),
			x: -20 // center
		},
		subtitle: {
			text: _('Pvlog'),
			x: -20
		},
		xAxis : {
			type : 'datetime',
//			dateTimeLabelFormats : { // don't display the dummy year
//				month : '%b',
//				year : '%b'
//			},
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
		series : chartData
	});
});
