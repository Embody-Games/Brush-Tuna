<script lang="ts">
	import { onDestroy } from 'svelte'
	import DialogItem from './dialogItem.svelte'

	interface Props {
		id: string
		label: string
		value: string
		disabled?: boolean
		children?: () => any
	}

	let { id, label, value = $bindable(), disabled = false, children }: Props = $props()

	let colorPicker: ColorPicker

	$effect.pre(() => {
		colorPicker = new ColorPicker(`color-picker-${guid()}`, {
			onChange() {
				const color = colorPicker.get() as tinycolor.Instance
				value = color.toHexString()
			},
		})
	})

	$effect(() => {
		colorPicker.set(value)
	})

	function mountColorPicker(el: HTMLDivElement) {
		colorPicker.toElement(el)
		colorPicker.set(value)
	}

	onDestroy(() => {
		colorPicker.delete()
	})
</script>

<DialogItem>
	<div class="dialog_bar form_bar">
		<label class="name_space_left" for={id}>{label}</label>
		<div use:mountColorPicker></div>
		{#if children}
			<div class="spacer"></div>
			{@render children()}
		{/if}
	</div>
</DialogItem>

<style>
	.spacer {
		flex-grow: 1;
		border-bottom: 2px dashed var(--color-button);
		height: 0px;
		margin: 8px;
		margin-left: 0px;
	}
</style>
