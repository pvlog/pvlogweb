export function getInverterInfo(inverters, inverterId) {
	for (let inverter of inverters) {
		if (inverter.id == inverterId) {
			return inverter;
		}
	}
	return null;
}
