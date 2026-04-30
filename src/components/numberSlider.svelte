<script lang="ts">
	interface Props {
		id: string
		step?: number

		value: number
		min?: number
		max?: number

		disabled?: boolean
	}

	let {
		id,
		step,

		value = $bindable(),
		min = $bindable(),
		max = $bindable(),

		disabled,
	}: Props = $props()

	let input = $state<HTMLInputElement>()

	function setValue(newValue: number) {
		const divisor = 1 / (step ?? 1)
		return (
			Math.round(
				Math.clamp(
					Animator.MolangParser.parse(newValue),
					min ?? -Infinity,
					max ?? Infinity
				) * divisor
			) / divisor
		)
	}

	function onMousedown(input: HTMLInputElement, event: any) {
		event.preventDefault()
		convertTouchEvent(event)

		let lastDifference = 0
		function move(e2: any) {
			convertTouchEvent(e2)
			let difference = Math.trunc((e2.clientX - event.clientX) / 10) * (step ?? 1)
			if (difference != lastDifference) {
				value = setValue(parseFloat(input.value) + (difference - lastDifference))
				input.value = value.toString()
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
		value = setValue(parseFloat(input.value))
		input.value = value.toString()
	}
</script>

<div class="numeric_input {disabled ? 'disabled' : ''}">
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

<style>
	input {
		padding: 0 6px !important;
	}
	.slider-fix {
		right: 8px !important;
	}
	.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
</style>
