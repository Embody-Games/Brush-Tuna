import { registerDeletableHandlerPatch } from 'blockbench-patch-manager'
import PACKAGE from '../../../package.json'
import type { BrushPreset } from '../../brushPresets'
import { localize } from '../../util/lang'

function switchBrushPreset(direction: 'next' | 'previous') {
	// @ts-expect-error - Missing type definitions for StateMemory
	const presets = StateMemory.brush_presets as BrushPreset[]
	if (!presets.length) return

	if (!BrushTuna.brushPreset) {
		BrushTuna.brushPreset = presets[0]
	}

	const step = direction === 'next' ? 1 : -1
	const index = presets.indexOf(BrushTuna.brushPreset)
	const nextIndex = (index + step + presets.length) % presets.length
	Painter.loadBrushPreset(presets[nextIndex])

	Blockbench.showQuickMessage(
		localize('brush_tuna.message.brush_preset_switched', BrushTuna.brushPreset.name)
	)
}

registerDeletableHandlerPatch({
	id: `${PACKAGE.name}:actions/next_brush_preset`,
	create() {
		const action = new Action(`${PACKAGE.name}:next_brush_preset`, {
			name: localize('brush_tuna.action.next_brush_preset'),
			icon: 'fa-forward',
			category: 'paint',
			click: () => switchBrushPreset('next'),
			keybind: new Keybind({
				key: 221,
			}),
		})
		return action
	},
})

registerDeletableHandlerPatch({
	id: `${PACKAGE.name}:actions/previous_brush_preset`,
	create() {
		const action = new Action(`${PACKAGE.name}:previous_brush_preset`, {
			name: localize('brush_tuna.action.previous_brush_preset'),
			icon: 'fa-backward',
			category: 'paint',
			click: () => switchBrushPreset('previous'),
			keybind: new Keybind({
				key: 219,
			}),
		})
		return action
	},
})
