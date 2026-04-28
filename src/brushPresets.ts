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

export interface BrushPreset {
	name: string
	size: number | null
	use_pen_pressure_for_size: boolean
	softness: number | null
	use_pen_pressure_for_softness: boolean
	opacity: number | null
	use_pen_pressure_for_opacity: boolean
	pixel_perfect?: boolean
	color: string | null
	shape: BrushShape
	blend_mode: BlendMode
}
