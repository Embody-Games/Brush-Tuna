<script lang="ts">
	import type { BrushPreset } from '../../../brushPresets'
	import { localize } from '../../../util/lang'
	import BrushOptions from './brushOptions.svelte'
	import BrushPresetList from './brushPresetList.svelte'

	// @ts-expect-error
	const presets = StateMemory.brush_presets as BrushPreset[]

	let presetIndex = $state(0)
	let presetHash = $state('')
	// presets isn't a reactive array, so track its length explicitly.
	let presetCount = $state(presets.length)

	const updatePresetHash = () => {
		presetCount = presets.length
		const preset = presets[presetIndex]
		presetHash = preset ? JSON.stringify(preset) : ''
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

<div class="brush-tuna-dialog">
	<BrushPresetList bind:presetIndex bind:presetHash {presets} {updatePresetHash} {deletePreset} />
	<div class="brush-tuna-dialog-form">
		{#if presetCount > 0 && presets[presetIndex]}
			<BrushOptions {presets} bind:presetIndex {deletePreset} {updatePresetHash} />
		{:else}
			<p class="brush-tuna-empty">{localize('brush_tuna.dialog.brush_presets.no_presets')}</p>
		{/if}
	</div>
</div>

<style>
	.brush-tuna-dialog {
		display: flex;
		gap: 20px;
		min-height: 420px;
	}

	.brush-tuna-dialog-form {
		flex: 1;
		min-width: 0;
		max-height: calc(100vh - 220px);
		overflow-y: auto;
		padding-right: 8px;
	}

	.brush-tuna-empty {
		margin-top: 16px;
		color: var(--color-subtle_text);
	}
</style>
