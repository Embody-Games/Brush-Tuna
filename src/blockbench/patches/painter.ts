import { registerPropertyOverridePatch } from 'blockbench-patch-manager'
import PACKAGE from '../../../package.json'
import { getActivePressureCurve } from '../../brushTunaSettings'
import { getCurveY } from '../../util/curve'
import { getPressureDataFromEvent } from '../../util/pen'
import { openPenPusherBrushOptions } from '../dialogs/brushOptions/brushOptions'

// Temporarily shadows an event's reported pressure so Blockbench's painting code
// sees the remapped value. Returns a function that restores the original state.
function overrideEventPressure(event: TouchEvent | PointerEvent, value: number): () => void {
	// Blockbench treats an exact pressure of 0.5 as "no stylus", so nudge past it.
	if (value === 0.5) value = 0.5001

	const restores: Array<() => void> = []

	const shadow = (obj: object, key: string) => {
		try {
			const descriptor = Object.getOwnPropertyDescriptor(obj, key)
			Object.defineProperty(obj, key, { value, configurable: true, writable: true })
			restores.push(() => {
				if (descriptor) {
					Object.defineProperty(obj, key, descriptor)
				} else {
					delete (obj as Record<string, unknown>)[key]
				}
			})
		} catch {
			// Property isn't configurable; leave it untouched.
		}
	}

	if ('pressure' in event) {
		shadow(event, 'pressure')
	}
	const touch = (event as TouchEvent).touches?.[0] as (Touch & { force?: number }) | undefined
	if (touch && touch.force !== undefined) {
		shadow(touch, 'force')
	}

	return () => restores.forEach(restore => restore())
}

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

			const lockAlpha = BarItems.lock_alpha as Toggle
			lockAlpha.set(preset.lock_alpha)

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

			const preset = BrushTuna.brushPreset

			// Remap raw pen pressure through the active default pressure curve, so
			// both Blockbench's native handling and the per-property curves use it.
			const { pressure: rawPressure } = getPressureDataFromEvent(event)
			let pressure = rawPressure
			let restorePressure: (() => void) | undefined

			if (rawPressure !== undefined) {
				pressure = Math.clamp(getCurveY(rawPressure, getActivePressureCurve(preset)), 0, 1)
				restorePressure = overrideEventPressure(event, pressure)
			}

			if (preset && pressure !== undefined) {
				if (preset.size_pressure_curve) {
					sizeSlider.setValue(originalSize * getCurveY(pressure, preset.size_pressure_curve))
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

			original.call(this, texture, ctx, x, y, event)

			restorePressure?.()
			sizeSlider.setValue(originalSize)
			softnessSlider.setValue(originalSoftness)
			opacitySlider.setValue(originalOpacity)
		}
	},
})
