import {createHighchartSeries} from 'chart';
import * as ko from 'knockout';
import Gettext from 'node-gettext';
import Highcharts from 'highcharts';
import {getJson} from 'jsonhelper';
import 'jquery';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

var formatNumber = function (element, valueAccessor, allBindingsAccessor) {
	// Provide a custom text value
	var value = valueAccessor();
	var strNumber = ko.utils.unwrapObservable(value);
	if (strNumber != null) {
		return (strNumber / 1000).toFixed(2)
	}
	return '';
};

ko.bindingHandlers.energy = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			$(element).text(formatNumber(element, valueAccessor, allBindingsAccessor));  
		},
		update: function (element, valueAccessor, allBindingsAccessor) {
			$(element).text(formatNumber(element, valueAccessor, allBindingsAccessor));
		}
};


function formatEnergy(dateEnergy) {
	let res = [];
	for (let entry of dateEnergy) {
		entry.energy = entry.energy / 1000
	}
	return dateEnergy;
}

function DataModel(topDays, lowDays, topMonths, lowMonths) {
	var self = this;

	self.topDays = topDays;
	self.lowDays = lowDays;
	self.topMonths = topMonths;
	self.lowMonths = lowMonths;
	
	self.dailyUrl = function(date) {
		return SCRIPT_ROOT + "/daily/" + date;
	}
	
	self.monthlyUrl = function(date) {
		return SCRIPT_ROOT + "/monthly/" + date;
	}
}


$(function() {
	$('#statistics').addClass("active");
	
	ko.applyBindings(new DataModel(data.topDays, data.lowDays, data.topMonths, data.lowMonths));
});