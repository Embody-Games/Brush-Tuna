import * as PACKAGE from '../package.json'

//-------------------------------
// Import your source files here
//-------------------------------

// Blockbench Patches
import 'import_folder_recursive:./patches'
// Misc imports
import type { BrushPreset } from './brushPresets'

// Provide a global object for other plugins to interact with
// @ts-expect-error
window.BrushTuna = {
	brushPreset: null as BrushPreset | null,
}

// This must be imported last.
import './plugin'
