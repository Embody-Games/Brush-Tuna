import { SvelteDialog } from 'svelte-patching-tools/blockbench'
import PACKAGE from '../../../../package.json'
import { localize } from '../../../util/lang'
import BrushSettingsDialogComponent from './brushSettingsDialog.svelte'

export function openBrushTunaSettingsDialog() {
	const dialog = new SvelteDialog({
		id: `${PACKAGE.name}:brush_settings`,
		title: localize('brush_tuna.dialog.brush_settings.title'),
		component: BrushSettingsDialogComponent,
		singleButton: true,
	})
	dialog.show()
}
