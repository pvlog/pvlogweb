import {createHighchartSeries} from 'chart';
import {getInverterInfo} from 'pvlogwebutil';
import * as ko from 'knockout';
import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import {getJson} from 'jsonhelper';
import moment from 'moment';
import $ from'jquery';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };


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
				id: inverterId,
				status: 'OK',
				pac: pac,
				pdc: pdc
			});
		}
	}
		
	return result;
}


function InverterDataModel(id, name, status, pac, pdc) {
	var self = this;
	self.id   = ko.observable(id);
	self.name = ko.observable(name);
	self.status = ko.observable(status);
	self.pac  = ko.observable(pac);
	self.pdc  = ko.observable(pdc);
}


function LiveDataModel(inverters) {
	var self = this;

	self.invertersData = ko.observableArray();

	self.dataloggerStatus = ko.observable(_('UNKNOWN'));
	
	self.loadData = function() {
		getJson(SCRIPT_ROOT + '/liveData', {}, function(result) {
			const invertersData = extractLiveData(result);

			let newInverterData = []
			for (let invData of invertersData) {
				let name = getInverterInfo(inverters, invData.id).name;
				if (name == null) {
					name = invData.id;
				}
				newInverterData.push(new InverterDataModel(invData.id, name, invData.status, invData.pac, invData.pdc))
			}
			self.invertersData(newInverterData);
		});

		getJson(SCRIPT_ROOT + '/dataloggerStatus', {}, function(result) {
			let dataloggerStatus = _('UNKNOWN');
			switch (result.dataloggerStatus) {
				case 0: dataloggerStatus = _('OK'); break;
				case 1: dataloggerStatus = _('SLEEPING (NIGHT)'); break;
				case 2: dataloggerStatus = _('WARNING'); break;
				case 3: dataloggerStatus = _('ERROR'); break;
				case 4: dataloggerStatus = _('PAUSED'); break;
				default: dataloggerStatus = _('UNKNOWN'); break;
			}

			self.dataloggerStatus(dataloggerStatus);
		});
	}
}


$(function() {
	$('#overview').addClass("active");
	
	const liveDataModel = new LiveDataModel(inverters);
	let refreshId = setInterval(liveDataModel.loadData, 10 * 1000);

	ko.applyBindings(liveDataModel);
	liveDataModel.loadData();

	var chartData = createHighchartSeries(data, 2, inverters);
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
		plotOptions : {
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
