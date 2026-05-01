<script lang="ts" module>
	import { onMount } from 'svelte'
	import type { BrushPressureCurve } from '../../brushPresets'
	import { getCurveXY } from '../../util/curve'
	import { localize } from '../../util/lang'
	import { getPressureDataFromEvent } from '../../util/pen'
	import NumberSlider from '../numberSlider.svelte'
	import DialogItem from './dialogItem.svelte'

	let clipboardData: BrushPressureCurve | null = null
</script>

<script lang="ts">
	interface Props {
		id: string
		label: string

		startX: number
		startY: number

		pointAX: number
		pointAY: number

		pointBX: number
		pointBY: number

		endX: number
		endY: number

		disabled?: boolean
		children?: () => any
	}

	let {
		id,
		label,

		startX = $bindable(),
		startY = $bindable(),

		pointAX = $bindable(),
		pointAY = $bindable(),

		pointBX = $bindable(),
		pointBY = $bindable(),

		endX = $bindable(),
		endY = $bindable(),

		disabled = false,
		children,
	}: Props = $props()

	let canvas = $state<HTMLCanvasElement>()!
	let ctx: CanvasRenderingContext2D
	let startPoint = $state<HTMLDivElement>()!
	let endPoint = $state<HTMLDivElement>()!
	let pointA = $state<HTMLDivElement>()!
	let pointB = $state<HTMLDivElement>()!

	let pressure = $state(0)

	const readTestAreaPressure = (event: TouchEvent | PointerEvent) => {
		pressure = getPressureDataFromEvent(event).pressure ?? 0
	}

	function copyCurve() {
		clipboardData = [startX, startY, pointAX, pointAY, pointBX, pointBY, endX, endY]
		Blockbench.showQuickMessage(localize('brush_tuna.curve_edit.copied'))
	}

	function pasteCurve() {
		if (clipboardData) {
			;[startX, startY, pointAX, pointAY, pointBX, pointBY, endX, endY] = clipboardData
			Blockbench.showQuickMessage(localize('brush_tuna.curve_edit.pasted'))
		} else {
			Blockbench.showQuickMessage(localize('brush_tuna.curve_edit.clipboard_empty'))
		}
	}

	const updateCurve = () => {
		if (!ctx) return

		const xS = startX * canvas.width
		const yS = (1 - startY) * canvas.height
		const xE = endX * canvas.width
		const yE = (1 - endY) * canvas.height
		const x1 = pointAX * canvas.width
		const y1 = (1 - pointAY) * canvas.height
		const x2 = pointBX * canvas.width
		const y2 = (1 - pointBY) * canvas.height

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		ctx.lineWidth = 2

		// Draw lines from control points to start and end
		ctx.beginPath()
		ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-subtle_text')

		ctx.moveTo(xS, yS)
		ctx.lineTo(x1, y1)

		ctx.moveTo(xE, yE)
		ctx.lineTo(x2, y2)

		ctx.stroke()
		ctx.closePath()

		if (xE == xS) {
			// Draw line
			ctx.beginPath()
			ctx.moveTo(xS, yS)
			ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-accent')
			ctx.lineTo(xE, yE)
			ctx.stroke()
			ctx.closePath()
		} else {
			// Draw the bezier curve
			ctx.beginPath()
			ctx.moveTo(xS, yS)

			ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-accent')
			ctx.bezierCurveTo(x1, y1, x2, y2, xE, yE)
			ctx.stroke()
			ctx.closePath()
		}

		// Draw lines from the start point to the left edge of the canvas
		ctx.beginPath()
		ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-accent')
		ctx.moveTo(xS, yS)
		ctx.lineTo(0, yS)
		ctx.stroke()
		ctx.closePath()

		// Draw lines from the end point to the right edge of the canvas
		ctx.beginPath()
		ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-accent')
		ctx.moveTo(xE, yE)
		ctx.lineTo(canvas.width, yE)
		ctx.stroke()
		ctx.closePath()

		if (pressure > 0) {
			const { x, y } = getCurveXY(pressure, [
				startX,
				startY,
				pointAX,
				pointAY,
				pointBX,
				pointBY,
				endX,
				endY,
			])
			// Draw pressure point
			ctx.beginPath()
			ctx.strokeStyle = 'red'
			ctx.arc(x * canvas.width, (1 - y) * canvas.height, 5, 0, Math.PI * 2)
			ctx.stroke()
			ctx.closePath()
		}
	}

	$effect(() => {
		pressure = pressure

		// make sure start and end x never pass eachother - ignore pressure point
		if (startX > endX) {
			startX = Math.min(startX, endX)
			endX = Math.max(startX, endX)
		}

		if (startPoint) {
			startPoint.style.left = `${startX * canvas.width - 5}px`
			startPoint.style.bottom = `${startY * canvas.height - 5}px`
		}
		if (pointA) {
			pointA.style.left = `${pointAX * canvas.width - 5}px`
			pointA.style.bottom = `${pointAY * canvas.height - 5}px`
		}
		if (pointB) {
			pointB.style.left = `${pointBX * canvas.width - 5}px`
			pointB.style.bottom = `${pointBY * canvas.height - 5}px`
		}
		if (endPoint) {
			endPoint.style.left = `${endX * canvas.width - 5}px`
			endPoint.style.bottom = `${endY * canvas.height - 5}px`
		}

		updateCurve()
	})

	const onmousedown = (point: 'start' | 'A' | 'B' | 'end', event: MouseEvent | TouchEvent) => {
		event.preventDefault()
		convertTouchEvent(event)

		const move = (e2: Event) => {
			convertTouchEvent(e2 as TouchEvent)
			const event = e2 as MouseEvent

			const rect = canvas.getBoundingClientRect()
			const x = Math.roundTo(Math.clamp((event.clientX - rect.left) / canvas.width, 0, 1), 2)
			const y = Math.roundTo(
				Math.clamp(1 - (event.clientY - rect.top) / canvas.height, 0, 1),
				2
			)

			switch (point) {
				case 'start':
					startX = x
					startY = y
					if (x > endX) endX = x
					break

				case 'end':
					endX = x
					endY = y
					if (x < startX) startX = x
					break

				case 'A':
					pointAX = x
					pointAY = y
					break

				case 'B':
					pointBX = x
					pointBY = y
					break
			}
		}

		const stop = () => {
			removeEventListeners(document, 'mousemove touchmove', move)
			removeEventListeners(document, 'mouseup touchend', stop)
		}

		addEventListeners(document, 'mousemove touchmove', move)
		addEventListeners(document, 'mouseup touchend', stop)
	}

	onMount(() => {
		ctx = canvas!.getContext('2d')!
		updateCurve()

		// const interval = setInterval(() => {
		// 	pressure = (pressure + 0.01) % 1
		// }, 16)

		// return () => {
		// 	clearInterval(interval)
		// }
	})
</script>

<DialogItem>
	<div class="dialog_bar form_bar">
		<!-- <label class="name_space_left {disabled ? 'disabled' : ''}" for={id}>{label}</label> -->
		<div class="group" style={disabled ? 'display: none;' : ''}>
			<div class="canvas-container">
				<canvas bind:this={canvas} {id} width="128" height="128"></canvas>
				{#if canvas}
					<div
						bind:this={pointA}
						class="control-point start"
						style="left: {startX * 128 - 5}px; bottom: {startY * 128 - 5}px;"
						onmousedown={e => !disabled && onmousedown('start', e)}
						ontouchstart={e => !disabled && onmousedown('start', e)}
					></div>
					<div
						bind:this={endPoint}
						class="control-point end"
						onmousedown={e => !disabled && onmousedown('end', e)}
						ontouchstart={e => !disabled && onmousedown('end', e)}
					></div>
					<div
						bind:this={pointA}
						class="control-point a"
						onmousedown={e => !disabled && onmousedown('A', e)}
						ontouchstart={e => !disabled && onmousedown('A', e)}
					></div>
					<div
						bind:this={pointB}
						class="control-point b"
						onmousedown={e => !disabled && onmousedown('B', e)}
						ontouchstart={e => !disabled && onmousedown('B', e)}
					></div>
				{/if}
			</div>
		</div>
		<div class="sliders">
			<label
				class={disabled ? 'disabled' : ''}
				for="start"
				style="color: var(--color-axis-x);">{localize('brush_tuna.curve_edit.start')}</label
			>
			<NumberSlider id="start-x" min={0} max={1} step={0.01} {disabled} bind:value={startX!}
			></NumberSlider>
			<NumberSlider id="start-y" min={0} max={1} step={0.01} {disabled} bind:value={startY!}
			></NumberSlider>

			<label class={disabled ? 'disabled' : ''} for="end" style="color: var(--color-axis-w);"
				>{localize('brush_tuna.curve_edit.end')}</label
			>
			<NumberSlider id="end-x" min={0} max={1} step={0.01} {disabled} bind:value={endX!}
			></NumberSlider>
			<NumberSlider id="end-y" min={0} max={1} step={0.01} {disabled} bind:value={endY!}
			></NumberSlider>

			<label
				class={disabled ? 'disabled' : ''}
				for="point-a"
				style="color: var(--color-axis-y);"
				>{localize('brush_tuna.curve_edit.ctrl_a')}</label
			>
			<NumberSlider id="point-ax" min={0} max={1} step={0.01} {disabled} bind:value={pointAX!}
			></NumberSlider>
			<NumberSlider id="point-ay" min={0} max={1} step={0.01} {disabled} bind:value={pointAY!}
			></NumberSlider>

			<label
				class={disabled ? 'disabled' : ''}
				for="point-b"
				style="color: var(--color-axis-z);"
				>{localize('brush_tuna.curve_edit.ctrl_b')}</label
			>
			<NumberSlider id="point-bx" min={0} max={1} step={0.01} {disabled} bind:value={pointBX!}
			></NumberSlider>
			<NumberSlider id="point-by" min={0} max={1} step={0.01} {disabled} bind:value={pointBY!}
			></NumberSlider>
		</div>
		{#if children}
			<div class="spacer"></div>
			{@render children?.()}
		{/if}
	</div>
	<div class="button-bar">
		<div
			class="test-area"
			onpointerdown={readTestAreaPressure}
			onpointermove={readTestAreaPressure}
			onpointerup={readTestAreaPressure}
			ontouchstart={readTestAreaPressure}
			ontouchmove={readTestAreaPressure}
			ontouchend={readTestAreaPressure}
		>
			{localize('brush_tuna.curve_edit.test_area')}
		</div>
		<div>
			<button onclick={copyCurve}>{localize('brush_tuna.curve_edit.copy')}</button>
			<button onclick={pasteCurve}>{localize('brush_tuna.curve_edit.paste')}</button>
		</div>
	</div>
</DialogItem>

<style>
	.sliders {
		display: grid;
		grid-template-columns: 0.4fr 1fr 1fr;
		margin-left: 24px;
		row-gap: 6px;
		column-gap: 8px;
	}

	.sliders label {
		display: flex;
		align-items: center;
	}

	.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.group {
		border: 2px solid var(--color-border);
		padding: 10px;
		border-radius: 8px;
	}

	.canvas-container {
		position: relative;
		width: 128px;
		height: 128px;
		box-shadow: 0px 0px 0px 10px var(--color-back);
		border-radius: 2px;
	}
	.control-point {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.start {
		background-color: var(--color-axis-x);
	}

	.a {
		background-color: var(--color-axis-y);
	}

	.b {
		background-color: var(--color-axis-z);
	}

	.end {
		background-color: var(--color-axis-w);
	}

	.spacer {
		flex-grow: 1;
		border-bottom: 2px dashed var(--color-button);
		height: 0px;
		margin: 8px;
	}

	.test-area {
		font-size: small;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 32px;
		margin-bottom: 16px;
		border-radius: 6px;
		width: 152px;

		border: none;
		background: var(--color-button);
		text-align: center;
		vertical-align: middle;
		outline: none;
		height: 32px;
		min-width: 100px;
		color: var(--color-text);
		font-weight: normal;
		cursor: pointer;
		border-radius: 5px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
	}

	.button-bar {
		display: flex;
		flex-direction: row;
		gap: 8px;
		justify-content: space-between;
	}
</style>
