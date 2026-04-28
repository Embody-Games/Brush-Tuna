<script lang="ts">
	import DialogItem from './dialogItem.svelte'

	interface Props {
		id: string
		label: string
		checked: boolean
	}

	let { id, label, checked = $bindable() }: Props = $props()
</script>

<DialogItem>
	<div class="dialog_bar form_bar checkbox_bar">
		<label class="name_space_left" for={id}>{label}</label>
		<div class="checkbox-line">
			<div class="spacer"></div>
			<input type="checkbox" class="focusable_input" {id} bind:checked />
		</div>
	</div>
</DialogItem>

<style>
	.checkbox_bar {
		flex-direction: row;
	}
	.checkbox-line {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: min-content;
		flex-grow: 1;
	}
	.spacer {
		flex-grow: 1;
		border-bottom: 2px dashed var(--color-button);
		height: 0px;
		margin: 8px;
		margin-left: 0px;
	}
</style>
