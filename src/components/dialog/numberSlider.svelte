<script lang="ts" module>
	import DialogItem from './dialogItem.svelte'
</script>

<script lang="ts">
	interface Props {
		id: string
		label: string
		description?: string
		step?: number

		value: number
		min?: number
		max?: number

		disabled?: boolean

		children?: () => any
	}

	let {
		id,
		label,
		description,
		step,

		value = $bindable(),
		min = $bindable(),
		max = $bindable(),

		disabled,

		children,
	}: Props = $props()

	let input = $state<HTMLInputElement>()

	function onMousedown(input: HTMLInputElement, event: any) {
		event.preventDefault()
		convertTouchEvent(event)

		let lastDifference = 0
		function move(e2: any) {
			convertTouchEvent(e2)
			let difference = Math.trunc((e2.clientX - event.clientX) / 10) * (step ?? 1)
			if (difference != lastDifference) {
				input.value = Math.clamp(
					parseFloat(input.value) + (difference - lastDifference),
					min ?? -Infinity,
					max ?? Infinity
				).toString()
				lastDifference = difference
			}
		}
		function stop() {
			removeEventListeners(document, 'mousemove touchmove', move)
			removeEventListeners(document, 'mouseup touchend', stop)
		}
		addEventListeners(document, 'mousemove touchmove', move)
		addEventListeners(document, 'mouseup touchend', stop)
	}

	function onFocusOut(input: HTMLInputElement, min?: number, max?: number) {
		input.value = Math.clamp(
			Animator.MolangParser.parse(input.value),
			min ?? -Infinity,
			max ?? Infinity
		).toString()
	}
</script>

<DialogItem>
	<div class="dialog_bar form_bar">
		<label class="name_space_left" for={id}>{label}</label>
		<div class="numeric_input">
			<input
				inputmode="decimal"
				bind:this={input}
				class="dark_bordered focusable_input"
				bind:value
				{disabled}
				onfocusout={() => onFocusOut(input!, min, max)}
			/>
			<div
				class="tool numaric_input_slider slider-fix"
				onmousedown={e => onMousedown(input!, e)}
				ontouchstart={e => onMousedown(input!, e)}
			>
				<i class="material-icons icon">code</i>
			</div>
		</div>
		{@render children?.()}
	</div>
</DialogItem>

<style>
	input {
		padding: 0 6px !important;
	}
	.slider-fix {
		right: 8px !important;
	}
</style>
