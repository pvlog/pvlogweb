import {createHighchartSeries} from 'chart';
import Gettext from 'node-gettext';
import Highcharts from 'highcharts';

/**
 * 
 * @param liveData json live data
 * @returns return array of rows id the following format:
 *          <tr><th>inverterId</th> <th>status</th> <th>pac</th> <th>pdc</th></tr>
 */
function extractLiveData(liveData) {
	if (liveData == null) {
		return null;
	}
	var result = [];
	for (let inverterId in liveData) {
		let inverterData = liveData[inverterId];
		
		for (let time in inverterData) {
			let data = inverterData[time];
			let pac = data['power'];
			let pdc = 0;
			
			let dcData = data['dc_inputs'];
			for (let tracker in dcData) {
				let pdcTracker = dcData[tracker];
				if (pdcTracker['power'] != null && pdcTracker['power'] > 0) {
					pdc = pdc + pdcTracker['power'];
				}
			}
			
			result.push({
				inverter: inverterId,
				status: '?',
				pac: pac,
				pdc: pdc
			});
		}
	}
		
	return result;
		
//		let row = '<th>' + inverterId + '</th>' + 
//		          '<th>' + '?' + '</th>' + 
//		          '<th>' + pac + '</th>' +
//		          '<th>' + pdc + '</th>';
//		
//		result.push('<tr>' + row + '</tr>');
}

/**
 * Update live data table.
 */
function loadData() {
	$.getJSON(SCRIPT_ROOT + '/live_data', {}, function(data) {
		let rowData = extractLiveData(data);
		
		let templateRow = $('#templateRow');
		
		let status = [];
		for (let r of rowData) {
			let row = templateRow.clone().removeAttr('id').removeAttr('style');
		
			row.find('*[data-device]').html(r.inverter);
			row.find('*[data-status]').html(r.status);
			row.find('*[data-pac]').html(r.pac + 'W');
			row.find('*[data-pdc]').html(r.pdc + 'W');
			
			$('#statusContent').html(row);
		}
	})
}

$(function() {
	var refreshId = setInterval(loadData, 10 * 1000);
	
	loadData();
	
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	//var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };
	
	var chartData = createHighchartSeries(data, 2);

//	$('#chart').highcharts({
		
	Highcharts.chart('chart', {
		title : {
			text : _('Last 30 Days Production'),
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