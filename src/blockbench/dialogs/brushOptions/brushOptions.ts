import { mount } from 'svelte'
import { SvelteDialog } from 'svelte-patching-tools/blockbench'
import PACKAGE from '../../../../package.json'
import BrushPresetsDialogComponent from './brushPresetsDialog.svelte'
import TitleComponent from './title.svelte'

export function openPenPusherBrushOptions() {
	const dialog = new SvelteDialog({
		id: `${PACKAGE.name}:brush_options`,
		title: 'menu.brush_presets.dialog',
		component: BrushPresetsDialogComponent,
		singleButton: true,
		onOpen() {
			const oldTitle = jQuery('dialog[id="brush_tuna:brush_options"] .dialog_title')[0]
			if (!oldTitle) return
			mount(TitleComponent, { target: oldTitle.parentElement! })
			oldTitle.remove()
		},
	})
	dialog.show()
}
