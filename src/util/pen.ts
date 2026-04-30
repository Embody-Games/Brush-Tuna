export function getPressureDataFromEvent(event: PointerEvent | TouchEvent) {
	let pressure: number | undefined
	let angle: number | undefined
	if (
		event instanceof TouchEvent &&
		event.touches &&
		event.touches[0] &&
		// @ts-expect-error
		event.touches[0]?.touchType === 'stylus' &&
		event.touches[0]?.force !== undefined
	) {
		pressure = event.touches[0].force
		// @ts-expect-error
		angle = event.touches[0].altitudeAngle
	} else if (
		// @ts-expect-error
		event.pressure >= 0 &&
		// @ts-expect-error
		event.pressure <= 1 &&
		// @ts-expect-error
		(event.pressure < 1 || event.pointerType !== 'touch') &&
		// @ts-expect-error
		event.pressure !== 0.5
	) {
		// @ts-expect-error
		pressure = event.pressure
		// @ts-expect-error
		angle = event.altitudeAngle
	}
	return { pressure, angle }
}
