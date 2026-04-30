import type { BrushPressureCurve } from '../brushPresets'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const scale = (t: number, a: number, b: number) => (t - a) / (b - a)

export const getCurveX = (
	t: number,
	[startX, startY, control1X, control1Y, control2X, control2Y, endX, endY]: BrushPressureCurve
) => {
	// If t is before startX, return straight line until t=startX
	if (t <= startX) {
		return lerp(0, startX, t / startX)
	}
	// If t is after endX, return straight line from endX to 1
	if (t > endX) {
		return lerp(endX, 1, scale(t, endX, 1))
	}
	t = lerp(0, 1, scale(t, startX, endX))
	return (
		Math.pow(1 - t, 3) * startX +
		3 * t * Math.pow(1 - t, 2) * control1X +
		3 * t * t * (1 - t) * control2X +
		t * t * t * endX
	)
}

export const getCurveY = (
	t: number,
	[startX, startY, control1X, control1Y, control2X, control2Y, endX, endY]: BrushPressureCurve
) => {
	if (t <= startX) return startY
	if (t > endX) return endY
	t = lerp(0, 1, scale(t, startX, endX))
	return (
		Math.pow(1 - t, 3) * startY +
		3 * t * Math.pow(1 - t, 2) * control1Y +
		3 * t * t * (1 - t) * control2Y +
		t * t * t * endY
	)
}

export const getCurveXY = (t: number, curve: BrushPressureCurve) => ({
	x: getCurveX(t, curve),
	y: getCurveY(t, curve),
})
