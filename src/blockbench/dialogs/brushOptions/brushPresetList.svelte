<script lang="ts">
	import { onDestroy } from 'svelte'
	import type { Attachment } from 'svelte/attachments'
	import type { BrushPreset } from '../../../brushPresets'
	import { getPresetIconString } from '../../../util/brushIcons'
	import { localize } from '../../../util/lang'

	interface Props {
		presetIndex: number
		presetHash: string
		presets: BrushPreset[]
		updatePresetHash: () => void
		deletePreset: () => void
	}

	let {
		presetIndex = $bindable(),
		presetHash = $bindable(),
		presets,
		updatePresetHash,
		deletePreset,
	}: Props = $props()

	function createPreset() {
		const newPreset: BrushPreset = {
			name: `Preset ${presets.length + 1}`,
			shape: 'circle',
			lock_alpha: false,
			size: 16,
			size_pressure_curve: null,
			softness: 0.5,
			softness_pressure_curve: null,
			opacity: 1,
			opacity_pressure_curve: null,
			color: null,
			blend_mode: 'default',
			pixel_perfect: false,
			screen_space: false,
			icon: null,
		}
		presets.push(newPreset)
		selectPreset(presets.length - 1)
		updatePresetHash()
	}

	function selectPreset(index: number) {
		presetIndex = index
		updatePresetHash()
	}

	function openContextMenu(index: number, event: MouseEvent) {
		event.preventDefault()
		selectPreset(index)
		new Menu([{ name: 'generic.delete', icon: 'delete', click: () => deletePreset() }]).open(
			event
		)
	}

	function onKeydown(index: number, event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			selectPreset(index)
		}
	}

	const scrollSelectedIntoView: Attachment = element => {
		if (element.classList.contains('selected')) {
			element.scrollIntoView({ behavior: 'instant', block: 'nearest' })
		}
	}

	onDestroy(() => {
		// @ts-expect-error - Missing type declaration for StateMemory
		StateMemory.save('brush_presets')
	})
</script>

<div class="brush-tuna-preset-sidebar">
	<ul role="listbox" class="brush-tuna-preset-list">
		{#key presetHash}
			{#each presets as preset, index (index + preset.name + preset.shape)}
				<li
					role="option"
					aria-selected={presetIndex === index}
					tabindex={presetIndex === index ? 0 : -1}
					class:selected={presetIndex === index}
					title={preset.name}
					onclick={() => selectPreset(index)}
					onkeydown={event => onKeydown(index, event)}
					oncontextmenu={event => openContextMenu(index, event)}
					{@attach scrollSelectedIntoView}
				>
					<span
						class="brush-tuna-preset-icon"
						{@attach node =>
							node.replaceChildren(
								Blockbench.getIconNode(
									getPresetIconString(preset),
									preset.color ?? undefined
								)
							)}
					></span>
					<span class="brush-tuna-preset-name">{preset.name}</span>
				</li>
			{/each}
		{/key}
	</ul>
	<button type="button" class="brush-tuna-add-preset" onclick={createPreset}>
		<i class="fa fa-plus"></i>
		{localize('brush_tuna.action.new_preset')}
	</button>
</div>

<style>
	.brush-tuna-preset-sidebar {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 176px;
		background: var(--color-back);
		overflow: hidden;
	}

	.brush-tuna-preset-list {
		flex: 1;
		margin: 0;
		overflow-y: auto;
	}

	.brush-tuna-preset-list li {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 5px 12px;
		border-left: 4px solid transparent;
		cursor: pointer;
	}

	.brush-tuna-preset-list li:hover {
		color: var(--color-light);
	}

	.brush-tuna-preset-list li.selected {
		background-color: var(--color-button);
		border-left-color: var(--color-accent);
	}

	.brush-tuna-preset-icon {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
	}

	.brush-tuna-preset-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.brush-tuna-add-preset {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 100%;
		min-width: 0;
		margin: 0;
		border-top: 1px solid var(--color-border);
		border-radius: 0;
		box-shadow: none;
	}
</style>
