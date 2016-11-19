function extractInverterData(inverterData) {
	// generate all series data
	var data = [];

	for ( var dateKey in inverterData) {
		var d = inverterData[dateKey];
		var time = Date.parse(dateKey);

		data.push([ time, d / 1000 ]);
	}

	return data;
}

function extractData(data) {
	var invData = {};

	for ( var inverterId in data) {
		invData[inverterId] = extractInverterData(data[inverterId]);
	}

	return invData;
}

function createHighchartSeries(chartData, decimals) {
	var series = [];

	var invertersData = extractData(chartData);

	for ( var inverterId in invertersData) {
		var data = invertersData[inverterId];

		series.push({
			name : inverterId,
			data : data,
			type : 'column',
			yAxis : 0,
			inverter_id : inverterId,
			data_type : "energy",
			tooltip : {
				valueSuffix : ' kWh',
				valueDecimals : decimals
			}
		});
	}
	return series;
}