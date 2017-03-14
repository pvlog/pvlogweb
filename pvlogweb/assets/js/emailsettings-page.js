import Gettext from 'node-gettext';
import 'knockout.validation';
import 'bootstrap-notify';
import * as ko from 'knockout';
import {getJson} from 'jsonhelper';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

ko.extenders.numeric = function(target, precision) {
	var result = ko.pureComputed({
		read: target,
		write: function(newValue) {
			var valueToWrite;
			if (newValue == null || isNaN(newValue)) {
				valueToWrite = newValue;
			} else {
				valueToWrite = Number(newValue);
			}
			target(valueToWrite);
		}
	}).extend({ notify: 'always' });

	result(target());

	return result;
};

function EmailServerModel(emailServer) {
	var self = this;
	self.server =  ko.observable(emailServer.server).extend({required: true});
	self.port =  ko.observable(emailServer.port).extend({required: true, number: true, numeric: true});
	self.user =  ko.observable(emailServer.user).extend({required: true})
	self.password =  ko.observable(emailServer.password).extend({required: true});
	
	self.save = function() {
		var isValid = ko.validatedObservable(self).isValid();
		
		if (!isValid) {
			ko.validation.group(self).showAllMessages();
			return;
		}
		
		getJson(SCRIPT_ROOT + '/saveEmailServer', ko.toJSON(self), function(result) {
			$.notify({message: _("Successfully saved email server data!")},{type: 'success'});	
		});
	}
	
}

function EmailModel(email) {
	var self=this;
	
	self.email =  ko.observable(email.email).extend({required: true});
	
	self.save = function() {
		var isValid = ko.validatedObservable(self).isValid();
		
		if (!isValid) {
			ko.validation.group(self).showAllMessages();
			return;
		}
		
		getJson(SCRIPT_ROOT + '/saveEmail', JSON.stringify({email: self.email()}), function(result) {
			$.notify({message: _("Successfully saved Email!")},{type: 'success'});	
		});
	}
}
	
$("#sendTestEmailButton").click(function() {
	getJson(SCRIPT_ROOT + '/sendTestEmail', {}, function(result) {
		$.notify({message: _("Successfully send test email!")},{type: 'success'});	
	});
});

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
	ko.applyBindings(new EmailServerModel(emailServer), document.getElementById('emailServerForm'));
	ko.applyBindings(new EmailModel(email), document.getElementById('emailAddressForm'));
});
