import { registerPropertyOverridePatch } from 'blockbench-patch-manager'
import PACKAGE from '../../../package.json'
import { getCurveY } from '../../util/curve'
import { getPressureDataFromEvent } from '../../util/pen'
import { openPenPusherBrushOptions } from '../dialogs/brushOptions/brushOptions'

registerPropertyOverridePatch({
	id: `${PACKAGE.name}:painter/openBrushOptions`,
	target: Painter,
	key: 'openBrushOptions',

	get(this: typeof Painter, original) {
		return function (this: typeof Painter) {
			openPenPusherBrushOptions()
		}
	},
})

registerPropertyOverridePatch({
	id: `${PACKAGE.name}:painter/loadBrushPreset`,
	target: Painter,
	key: 'loadBrushPreset',

	get(this: typeof Painter, original) {
		return function (this: typeof Painter, preset) {
			original.call(this, preset)
			BrushTuna.brushPreset = preset
		}
	},
})

registerPropertyOverridePatch({
	id: `${PACKAGE.name}:painter/useBrush`,
	target: Painter,
	// @ts-expect-error
	key: 'useBrush',

	get(this: typeof Painter, original) {
		return function (
			this: typeof Painter,
			texture: Texture,
			ctx: CanvasRenderingContext2D,
			x: number,
			y: number,
			event: TouchEvent | PointerEvent
		) {
			const sizeSlider = BarItems.slider_brush_size as NumSlider
			const softnessSlider = BarItems.slider_brush_softness as NumSlider
			const opacitySlider = BarItems.slider_brush_opacity as NumSlider

			const originalSize = sizeSlider.get()
			const originalSoftness = softnessSlider.get()
			const originalOpacity = opacitySlider.get()

			if (BrushTuna.brushPreset) {
				const preset = BrushTuna.brushPreset

				const { pressure, angle } = getPressureDataFromEvent(event)

				console.log('Event:', event)
				console.log('Pressure:', pressure, 'Angle:', angle)

				if (pressure !== undefined) {
					if (preset.size_pressure_curve) {
						sizeSlider.setValue(
							originalSize * getCurveY(pressure, preset.size_pressure_curve)
						)
					}
					if (preset.softness_pressure_curve) {
						softnessSlider.setValue(
							originalSoftness * getCurveY(pressure, preset.softness_pressure_curve)
						)
					}
					if (preset.opacity_pressure_curve) {
						opacitySlider.setValue(
							originalOpacity * getCurveY(pressure, preset.opacity_pressure_curve)
						)
					}
				}
			}

			original.call(this, texture, ctx, x, y, event)

			sizeSlider.setValue(originalSize)
			softnessSlider.setValue(originalSoftness)
			opacitySlider.setValue(originalOpacity)
		}
	},
})
