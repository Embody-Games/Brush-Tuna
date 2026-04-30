<script lang="ts">
	import DialogItem from './dialogItem.svelte'

	interface Props {
		icon: string
		label: string
		onclick: () => void
	}

	let { icon, label, onclick }: Props = $props()
</script>

<DialogItem>
	<button {onclick}>
		<i class={'fa fa-' + icon}></i>
		{label}
	</button>
</DialogItem>

<style>
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: -webkit-fill-available;
		gap: 4px;
	}
</style>
