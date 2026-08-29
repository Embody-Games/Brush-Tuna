import { registerPropertyOverridePatch } from 'blockbench-patch-manager'
import PACKAGE from '../../../package.json'
import type { BrushPreset } from '../../brushPresets'
import { localize } from '../../util/lang'
import { openBrushTunaSettingsDialog } from '../dialogs/brushSettings/brushSettings'

// Wrap the brush tool's preset dropdown to add a "Brush Settings..." entry and
// apply each preset's custom icon to its menu item.
type MenuStructureFn = (context?: unknown) => unknown[]

function applyPresetIcons(list: unknown[]) {
	// @ts-expect-error - Missing type declaration for StateMemory
	const presets = StateMemory.brush_presets as BrushPreset[]
	const iconByName = new Map<string, string | null>()
	for (const preset of presets) {
		// Skip ambiguous names so we never mislabel a menu item.
		iconByName.set(preset.name, iconByName.has(preset.name) ? null : (preset.icon ?? null))
	}
	for (const item of list) {
		if (!item || typeof item !== 'object' || !('name' in item)) continue
		const icon = iconByName.get((item as { name: string }).name)
		if (icon) (item as { icon?: string }).icon = icon
	}
}

const brushToolSideMenu = (BarItems.brush_tool as Tool).side_menu as Menu | undefined

if (brushToolSideMenu) {
	registerPropertyOverridePatch({
		id: `${PACKAGE.name}:brushToolMenu/structure`,
		target: brushToolSideMenu,
		key: 'structure',

		get(this: Menu, original: unknown) {
			const buildList: MenuStructureFn = context =>
				typeof original === 'function'
					? [...(original as MenuStructureFn).call(this, context)]
					: [...(original as unknown[])]

			return ((context?: unknown) => {
				const list = buildList(context)
				applyPresetIcons(list)
				list.push({
					id: `${PACKAGE.name}:brush_settings`,
					name: localize('brush_tuna.action.brush_settings'),
					icon: 'tune',
					click() {
						openBrushTunaSettingsDialog()
					},
				})
				return list
			}) as unknown as Menu['structure']
		},
	})
}
