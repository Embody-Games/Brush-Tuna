export type BlendMode =
	| 'unset'
	| 'default'
	| 'set_opacity'
	| 'color'
	| 'behind'
	| 'multiply'
	| 'add'
	| 'lighten'
	| 'darken'
	| 'screen'
	| 'overlay'
	| 'difference'

export type BrushShape = 'unset' | 'circle' | 'square'

/**
 * 0 = start X
 * 1 = start Y
 * 2 = ctrl A X
 * 3 = ctrl A Y
 * 4 = ctrl B X
 * 5 = ctrl B Y
 * 6 = end X
 * 7 = end Y
 */
export type BrushPressureCurve = [number, number, number, number, number, number, number, number]

export interface BrushPreset {
	name: string
	shape: BrushShape
	blend_mode: BlendMode

	size: number | null
	size_pressure_curve: BrushPressureCurve | null

	softness: number | null
	softness_pressure_curve: BrushPressureCurve | null

	opacity: number | null
	opacity_pressure_curve: BrushPressureCurve | null

	pixel_perfect?: boolean

	color: string | null
}
