export function extractInverterData(inverterData) {
	// generate all series data
	var data = [];

	for (let dateKey in inverterData) {
		let d = inverterData[dateKey];
		let time = Date.parse(dateKey);

		data.push([ time, d / 1000 ]);
	}

	return data;
}

function extractData(data) {
	var invData = {};

	for (let inverterId in data) {
		invData[inverterId] = extractInverterData(data[inverterId]);
	}

	return invData;
}

export function createHighchartSeries(chartData, decimals) {
	var series = [];

	var invertersData = extractData(chartData);

	for (let inverterId in invertersData) {
		let data = invertersData[inverterId];

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