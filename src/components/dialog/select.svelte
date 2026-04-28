<script lang="ts">
	import DialogItem from './dialogItem.svelte'

	interface Props {
		id: string
		label: string
		options: Record<string, string>
		value: string
	}

	let { id, label, options, value = $bindable() }: Props = $props()

	const defaultOption = $derived(Object.keys(options)[0])

	let selectElement: Interface.CustomElements.SelectInput<Record<string, string>> | undefined

	$effect.pre(() => {
		if (!(value || options[value])) value = defaultOption
	})

	$effect(() => {
		selectElement!.set(value)
	})

	const mountSelect = (node: HTMLDivElement) => {
		selectElement = new Interface.CustomElements.SelectInput('dialog-select', {
			options,
			value,
			onChange() {
				const v = selectElement?.node.getAttribute('value')
				if (v == undefined) {
					console.warn('Select value is undefined')
					return
				}
				value = v
			},
		})

		node.appendChild(selectElement.node)
	}
</script>

<DialogItem>
	<div class="dialog_bar form_bar" use:mountSelect>
		<label class="name_space_left" for={id}>{label}</label>
	</div>
</DialogItem>
