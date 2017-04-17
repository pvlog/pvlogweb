import moment from 'moment';
import 'datatables.net';
import 'datatables.net-bs'
import Gettext from 'node-gettext';
import 'datetime-moment';
import {getInverterInfo} from 'pvlogwebutil';
import 'jquery';

moment.locale(window.navigator.userLanguage || window.navigator.language);

$(function() {
	var gt = new Gettext({domain: 'pvlogweb'});
	var _ = function(msgid) { return gt.gettext(msgid); };
	//var ngettext = function(msgid, msgid_plural, n) { return gt.ngettext(msgid, msgid_plural, n); };

	$('#events').addClass("active");
	
	var dataSet = [];

	for (var inverterId in data) {
		const inverterEntry = data[inverterId];
		let name = getInverterInfo(inverters, inverterId).name;
		if (name == null) {
			name = inverterId;
		}
		for (var entry of inverterEntry) {
			dataSet.push([name, moment(entry.time * 1000).format('lll'), entry.number.toString(), entry.message]);
		}
	}

	$.fn.dataTable.moment('lll');

	$('#eventTable').DataTable( {
		data: dataSet,
		columns: [
			{ title: _("Inverter") },
			{ title: _("Time") },
			{ title: _("Number") },
			{ title: _("Message") },
		]
	} );
} );
