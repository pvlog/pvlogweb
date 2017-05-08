import {createHighchartSeries} from 'chart';
import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import 'bootstrap-datepicker';
import moment from 'moment';
import 'jquery';

$(function() {
	$('#chartNav').addClass('collapse in');
	$('#month').addClass("active");
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	//var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };
	
	$('#datepicker').datepicker( {
		useCurrent: false,
		format: "yyyy-mm",
		startView: "months",
		minViewMode: "months",
		defaultViewDate: {"year": curDate.getFullYear(), "month": curDate.getMonth() }
	}).on('changeDate', function(e) {
		var month =  String("00" + (e.date.getMonth() + 1)).slice(-2);
		var monthDate = e.date.getFullYear() + "-" + month
		location.href = SCRIPT_ROOT + "/monthly/" + monthDate;
	});
	
	var chartData = createHighchartSeries(data, 2, inverters);

//	$('#chart').highcharts({
		
	Highcharts.chart('chart', {
		title : {
			text : _('Month Data'),
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
				text : _('Date')
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
				text : _('Energy'),
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
							location.href = SCRIPT_ROOT + "/daily/" + d.format("YYYY-MM-DD");
						}
					}
				}
			}
		},
		series : chartData
	});
});
