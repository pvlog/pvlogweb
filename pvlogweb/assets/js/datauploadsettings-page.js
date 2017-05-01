import Gettext from 'node-gettext';
import 'knockout.validation';
import 'bootstrap-notify';
import * as ko from 'knockout';
import {getJson} from 'jsonhelper';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

function PvoutputModel(configs) {
	var self = this;
	self.systemId =  ko.observable();
	self.apiKey   =  ko.observable();
	
	for (let config of configs) {
		if (config.key == 'pvoutputSystemId') {
			self.systemId(config.value);
		}
		if (config.key == 'pvoutputApiKey') {
			self.apiKey(config.value);
		}
	}
	
	self.save = function() {
		var isValid = ko.validatedObservable(self).isValid();
		
		if (!isValid) {
			ko.validation.group(self).showAllMessages();
			return;
		}
		
		const systemIdConfig = {key: "pvoutputSystemId", value: self.systemId()};
		const apiKeyConfig   = {key: "pvoutputApiKey", value: self.apiKey()};
		
		getJson(SCRIPT_ROOT + '/saveConfig', JSON.stringify(systemIdConfig), function(result) {
			getJson(SCRIPT_ROOT + '/saveConfig', JSON.stringify(apiKeyConfig), function(result) {
				$.notify({message: _("Successfully saved email server data!")},{type: 'success'});
			});
		});
	}
	
}

$(function() {
	ko.validation.init({
		decorateInputElement: true,
		errorElementClass: 'has-error',
		errorMessageClass: 'text-danger',
		registerExtenders: true,
		messagesOnModified: true,
		insertMessages: true,
		parseInputAttributes: true,
		messageTemplate: null
	}, true)
	ko.applyBindings(new PvoutputModel(configs), document.getElementById('pvuploadForm'));;
});
