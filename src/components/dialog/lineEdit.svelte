<script lang="ts">
	import DialogItem from './dialogItem.svelte'

	interface Props {
		id: string
		label: string
		value: string
		disabled?: boolean
	}

	let { id, label, value = $bindable(), disabled = false }: Props = $props()
</script>

<DialogItem>
	<div class="dialog_bar form_bar">
		<label class="name_space_left" for={id}>{label}</label>
		<input
			type="text"
			class="dark_bordered half focusable_input"
			{id}
			bind:value
			{disabled}
			style={disabled ? 'color: var(--color-subtle_text);' : ''}
		/>
	</div>
</DialogItem>
