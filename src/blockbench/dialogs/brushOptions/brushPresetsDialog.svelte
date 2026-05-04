<script lang="ts">
	import type { BrushPreset } from '../../../brushPresets'
	import BrushOptions from './brushOptions.svelte'
	import BrushPresetList from './brushPresetList.svelte'

	// @ts-expect-error
	const presets = StateMemory.brush_presets as BrushPreset[]

	let presetIndex = $state(0)
	let presetHash = $state('')

	const updatePresetHash = () => {
		const preset = presets[presetIndex]
		if (preset) {
			presetHash = JSON.stringify(preset)
		} else {
			presetHash = ''
		}
	}

	const deletePreset = () => {
		if (presets.length === 0) return
		presets.splice(presetIndex, 1)
		if (presetIndex >= presets.length) {
			presetIndex = presets.length - 1
		}
		updatePresetHash()
	}
</script>

<div class="brush-options-dialog">
	<BrushPresetList bind:presetIndex {presets} {updatePresetHash} bind:presetHash />
	{#if presets[presetIndex]}
		<BrushOptions {presets} bind:presetIndex {deletePreset} {updatePresetHash} />
	{/if}
</div>

<style>
	.brush-options-dialog {
		max-height: 75vh;
		overflow-y: auto;
	}
</style>
