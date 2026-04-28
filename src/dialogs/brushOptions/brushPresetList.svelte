<script lang="ts">
	import { onDestroy } from 'svelte'
	import type { BrushPreset } from '../../brushPresets'

	interface Props {
		selectedPresetIndex: number
		presets: BrushPreset[]
	}

	let { selectedPresetIndex = $bindable(), presets }: Props = $props()

	function createPreset() {
		const newPreset: BrushPreset = {
			name: `Preset ${presets.length + 1}`,
			size: 16,
			shape: 'circle',
			use_pen_pressure_for_size: false,
			softness: 0.5,
			use_pen_pressure_for_softness: false,
			opacity: 1,
			use_pen_pressure_for_opacity: false,
			color: null,
			blend_mode: 'default',
		}
		presets.push(newPreset)
		selectedPresetIndex = presets.length - 1
	}

	onDestroy(() => {
		// @ts-expect-error - Missing type declaration for StateMemory
		StateMemory.save('brush_presets')
	})
</script>

{#snippet brushPresetItem(preset: BrushPreset, index: number)}
	<div
		class="brush-preset-item {selectedPresetIndex === index ? 'selected' : ''}"
		title={preset.name}
		onclick={() => (selectedPresetIndex = index)}
	>
		<i class="fa fa-{preset.shape === 'circle' ? 'circle' : 'square'}"></i>
		{preset.name}
	</div>
{/snippet}

<div class="brush-preset-list">
	{#key selectedPresetIndex}
		{#each presets as preset, index (index + preset.name + preset.shape)}
			{@render brushPresetItem(preset, index)}
		{/each}
	{/key}
	<div class="add-preset-button">
		<i class="fa fa-plus" onclick={createPreset}></i>
	</div>
</div>

<style>
	.brush-preset-list {
		display: flex;
		padding: 8px;
		border-radius: 8px;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 8px;
		background: var(--color-back);
		margin-bottom: 24px;
		max-height: 128px;
		overflow-y: auto;
	}

	.brush-preset-item {
		gap: 4px;
		background: var(--color-button);
		border-radius: 8px;
		padding: 4px 8px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.selected {
		box-shadow: 0px 3px 0px 0px var(--color-accent);
	}

	.add-preset-button {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.add-preset-button:hover {
		background-color: var(--color-secondary);
		border-radius: 4px;
	}
</style>
