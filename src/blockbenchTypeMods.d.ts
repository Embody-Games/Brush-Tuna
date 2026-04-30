import type { BrushPreset } from './brushPresets'

declare global {
	// Replace BlockbenchPluginTemplate with the name of your plugin.
	const BrushTuna: {
		brushPreset: BrushPreset | null
	}
}

export {}
