import { registerPropertyOverridePatch } from 'blockbench-patch-manager'
import PACKAGE from '../../package.json'
import { openPenPusherBrushOptions } from '../dialogs/brushOptions/brushOptions'

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
