import { SvelteDialog } from 'svelte-patching-tools/blockbench'
import PACKAGE from '../../../package.json'
import BrushOptionsComponent from './brushOptions.svelte'

export function openPenPusherBrushOptions() {
	new SvelteDialog({
		id: `${PACKAGE.name}:brush_options`,
		title: 'menu.brush_presets.dialog',
		component: BrushOptionsComponent,
		singleButton: true,
	}).show()
}
