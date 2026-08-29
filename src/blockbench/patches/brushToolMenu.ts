import { registerPropertyOverridePatch } from 'blockbench-patch-manager'
import PACKAGE from '../../../package.json'
import { localize } from '../../util/lang'
import { openBrushTunaSettingsDialog } from '../dialogs/brushSettings/brushSettings'

// Wrap the brush tool's preset dropdown to add a "Brush Settings..." entry.
type MenuStructureFn = (context?: unknown) => unknown[]

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
