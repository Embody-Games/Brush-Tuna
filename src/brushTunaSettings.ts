import type { BrushPreset, BrushPressureCurve } from './brushPresets'

// Identity curve — passes raw pen pressure through unchanged.
export const DEFAULT_PRESSURE_CURVE: BrushPressureCurve = [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1]

export interface BrushTunaSettings {
	// Curve applied to raw pen pressure before painting. Presets can override it.
	default_pressure_curve: BrushPressureCurve
}

// @ts-expect-error - Missing type definitions for StateMemory
StateMemory.init('brush_tuna_settings', 'object', {
	default_pressure_curve: [...DEFAULT_PRESSURE_CURVE],
} satisfies BrushTunaSettings)

// Live settings object backed by StateMemory. Call saveBrushTunaSettings() to persist.
export function getBrushTunaSettings(): BrushTunaSettings {
	// @ts-expect-error - Missing type definitions for StateMemory
	const settings = StateMemory.brush_tuna_settings as BrushTunaSettings

	if (
		!Array.isArray(settings.default_pressure_curve) ||
		settings.default_pressure_curve.length !== 8
	) {
		settings.default_pressure_curve = [...DEFAULT_PRESSURE_CURVE]
	}

	return settings
}

export function saveBrushTunaSettings() {
	// @ts-expect-error - Missing type definitions for StateMemory
	StateMemory.save('brush_tuna_settings')
}

// The preset's own pressure curve override, or the global default.
export function getActivePressureCurve(preset: BrushPreset | null): BrushPressureCurve {
	if (preset?.pressure_curve) {
		return preset.pressure_curve
	}
	return getBrushTunaSettings().default_pressure_curve
}
