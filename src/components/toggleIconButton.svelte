<script lang="ts">
	interface Props {
		icon: string
		description?: string
		checked: boolean
		disabled?: boolean
	}
	let { icon, description, checked = $bindable(), disabled = false }: Props = $props()
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div
	class="tool toggle-icon-button {checked ? 'enabled' : ''} {disabled ? 'disabled' : ''}"
	title={description}
	onclick={() => {
		checked = disabled ? checked : !checked
	}}
>
	<i class="fa fa-{icon}"></i>
</div>

<style>
	.toggle-icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 4px;
	}
	.toggle-icon-button.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
</style>
