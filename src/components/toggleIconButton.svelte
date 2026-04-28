<script lang="ts">
	interface Props {
		icon: string
		checked: boolean
	}
	let { icon, checked = $bindable() }: Props = $props()
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div
	class="tool toggle-icon-button {checked ? 'enabled' : ''}"
	class:checked
	onclick={() => (checked = !checked)}
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
</style>
