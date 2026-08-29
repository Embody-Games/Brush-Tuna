import type { BrushPreset } from '../brushPresets'
import {
	FA_BRAND_ICONS,
	FA_SOLID_ICONS,
	ICOMOON_ICONS,
	MATERIAL_ICONS,
} from '../data/blockbenchIcons'

export interface IconOption {
	value: string
	label: string
}

let cached: IconOption[] | undefined

function toLabel(name: string): string {
	return name.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

// Every icon bundled with Blockbench (Material Symbols, Font Awesome, Icomoon).
export function getAllIconOptions(): IconOption[] {
	if (cached) return cached

	const options: IconOption[] = []
	for (const name of MATERIAL_ICONS) options.push({ value: name, label: toLabel(name) })
	for (const name of FA_SOLID_ICONS) options.push({ value: `fa-${name}`, label: toLabel(name) })
	for (const name of FA_BRAND_ICONS)
		options.push({ value: `fab.fa-${name}`, label: toLabel(name) })
	for (const name of ICOMOON_ICONS) options.push({ value: `icon-${name}`, label: toLabel(name) })

	options.sort((a, b) => a.label.localeCompare(b.label) || a.value.localeCompare(b.value))
	cached = options
	return options
}

// The icon to render for a preset: its own icon, or one derived from the shape.
export function getPresetIconString(preset: BrushPreset): string {
	if (preset.icon) return preset.icon
	return preset.shape === 'circle' ? 'fa-circle' : 'fa-square'
}
