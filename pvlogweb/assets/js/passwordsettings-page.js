import Gettext from 'node-gettext';
import 'knockout.validation';
import 'bootstrap-notify';
import * as ko from 'knockout';
import {getJson} from 'jsonhelper';

var gt = new Gettext({domain: 'pvlogweb'});
var _ = function(msgid) { return gt.gettext(msgid); };

function PasswordModel() {
	var self = this;
	self.oldPassword =  ko.observable().extend({required: true})
	self.newPassword1 =  ko.observable().extend({required: true});
	self.newPassword2 =  ko.observable().extend({required: true});
	
	self.save = function() {
		var isValid = ko.validatedObservable(self).isValid();
		
		if (!isValid) {
			ko.validation.group(self).showAllMessages();
			return;
		}
		
		getJson(SCRIPT_ROOT + '/changePassword', ko.toJSON(self), function(result) {
			$.notify({message: _("Successfully changed password!")},{type: 'success'});	
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
	ko.applyBindings(new PasswordModel());
});
