import * as ko from 'knockout';
import 'knockout.x-editable'

function Config(key, value) {
	var self = this;
	self.key = key;
	self.value = value;

	self.url = function(params) {
		var d = new $.Deferred();
		var key1 = self.key;
		var config = {"key": key1, "value": params.value};
		
		$.ajax({
			type: 'POST',
			url: SCRIPT_ROOT + '/saveConfig',
			data: JSON.stringify(config),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8'
		}).done(function(result) {
			if (result.error != null) {
				d.reject(result.error.message);
			}
			d.resolve();
		}).fail(function(jqXHR, textStatus) {
			d.reject(textStatus);
		});
		
		return d.promise();
	}
}

function ConfigModel(configs) {
	this.self = this;
	self.configs = [];
	
	for (let c of configs) {
		self.configs.push(new Config(c.key, c.value));
	}
}

$(function() {
	ko.applyBindings(new ConfigModel(configs));
	
});