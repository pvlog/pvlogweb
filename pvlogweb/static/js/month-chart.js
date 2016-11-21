$(function() {
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };
	
	var chartData = createHighchartSeries(data, 2);

	$('#chart').highcharts({
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
		series : chartData
	});
});