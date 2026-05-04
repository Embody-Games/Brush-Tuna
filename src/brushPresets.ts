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

export type BrushPressureCurve = [
	StartX: number,
	StartY: number,
	CtrlAX: number,
	CtrlAY: number,
	CtrlBX: number,
	CtrlBY: number,
	EndX: number,
	EndY: number,
]

export interface BrushPreset {
	name: string
	shape: BrushShape
	blend_mode: BlendMode

	lock_alpha: boolean

	size: number | null
	size_pressure_curve: BrushPressureCurve | null

	softness: number | null
	softness_pressure_curve: BrushPressureCurve | null

	opacity: number | null
	opacity_pressure_curve: BrushPressureCurve | null

	pixel_perfect?: boolean

	color: string | null
}
