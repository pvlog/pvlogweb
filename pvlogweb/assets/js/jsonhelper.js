export function getJson(url, data, success) {
	$.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: 'json',
		contentType: 'application/json; charset=utf-8'
	}).done(function(result) {
		if (result.error != null) {
			$.notify({
				message: result.error.message
			},{
				type: 'danger'
			});
		} else {
			success(result);
		}
	}).fail(function(jqXHR, textStatus) {
		$.notify({
			message: 'Ajax error'
		},{
			type: 'danger'
		});
	});
}