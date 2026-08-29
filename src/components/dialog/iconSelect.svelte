<script lang="ts">
	import { getAllIconOptions } from '../../util/brushIcons'
	import DialogItem from './dialogItem.svelte'

	interface Props {
		id: string
		label: string
		defaultLabel: string
		value: string
	}

	let { id, label, defaultLabel, value = $bindable() }: Props = $props()

	let selectElement: { node: HTMLElement; set: (value: string) => void } | undefined

	$effect(() => {
		selectElement?.set(value)
	})

	const mountSelect = (node: HTMLDivElement) => {
		// SelectInput turns into a searchable dropdown once there are >16 options.
		const options: Record<string, { name: string; icon: string }> = {
			'': { name: defaultLabel, icon: '' },
		}
		for (const option of getAllIconOptions()) {
			options[option.value] = { name: option.label, icon: option.value }
		}

		selectElement = new Interface.CustomElements.SelectInput(id, {
			options,
			value,
			display_icon: true,
			onChange(next: string) {
				value = next
			},
		} as never) as typeof selectElement
		node.appendChild(selectElement!.node)
	}
</script>

<DialogItem>
	<div class="dialog_bar form_bar" use:mountSelect>
		<label class="name_space_left" for={id}>{label}</label>
	</div>
</DialogItem>
