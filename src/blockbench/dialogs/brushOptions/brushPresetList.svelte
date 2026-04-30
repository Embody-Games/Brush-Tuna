<script lang="ts">
	import { onDestroy } from 'svelte'
	import type { Attachment } from 'svelte/attachments'
	import type { BrushPreset } from '../../../brushPresets'

	interface Props {
		selectedPresetIndex: number
		presets: BrushPreset[]
	}

	let { selectedPresetIndex = $bindable(), presets }: Props = $props()

	function createPreset() {
		const newPreset: BrushPreset = {
			name: `Preset ${presets.length + 1}`,
			shape: 'circle',
			size: 16,
			size_pressure_curve: null,
			softness: 0.5,
			softness_pressure_curve: null,
			opacity: 1,
			opacity_pressure_curve: null,
			color: null,
			blend_mode: 'default',
		}
		presets.push(newPreset)
		selectedPresetIndex = presets.length - 1
	}

	const scrollSelectedIntoView: Attachment = element => {
		element.scrollIntoView({
			behavior: 'instant',
			block: 'center',
		})
	}

	onDestroy(() => {
		// @ts-expect-error - Missing type declaration for StateMemory
		StateMemory.save('brush_presets')
	})
</script>

{#snippet brushPresetItem(preset: BrushPreset, index: number)}
	{#if selectedPresetIndex === index}
		<div
			class="brush-preset-item selected"
			title={preset.name}
			onclick={() => (selectedPresetIndex = index)}
			{@attach scrollSelectedIntoView}
		>
			<i class="fa fa-{preset.shape === 'circle' ? 'circle' : 'square'}"></i>
			{preset.name}
		</div>
	{:else}
		<div
			class="brush-preset-item"
			title={preset.name}
			onclick={() => (selectedPresetIndex = index)}
		>
			<i class="fa fa-{preset.shape === 'circle' ? 'circle' : 'square'}"></i>
			{preset.name}
		</div>
	{/if}
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
