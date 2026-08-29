<script lang="ts">
	import { onDestroy } from 'svelte'
	import {
		DEFAULT_PRESSURE_CURVE,
		getBrushTunaSettings,
		saveBrushTunaSettings,
	} from '../../../brushTunaSettings'
	import Button from '../../../components/dialog/button.svelte'
	import CurveEdit from '../../../components/dialog/curveEdit.svelte'
	import { localize } from '../../../util/lang'

	const settings = getBrushTunaSettings()
	const curve = settings.default_pressure_curve

	let startX = $state(curve[0])
	let startY = $state(curve[1])
	let pointAX = $state(curve[2])
	let pointAY = $state(curve[3])
	let pointBX = $state(curve[4])
	let pointBY = $state(curve[5])
	let endX = $state(curve[6])
	let endY = $state(curve[7])

	$effect(() => {
		// Apply live while the dialog is open; persisted on close.
		settings.default_pressure_curve = [
			startX,
			startY,
			pointAX,
			pointAY,
			pointBX,
			pointBY,
			endX,
			endY,
		]
	})

	function resetToDefault() {
		;[startX, startY, pointAX, pointAY, pointBX, pointBY, endX, endY] = DEFAULT_PRESSURE_CURVE
	}

	onDestroy(() => {
		saveBrushTunaSettings()
	})
</script>

<h3>{localize('brush_tuna.dialog.brush_settings.default_brush_curve.title')}</h3>

<p class="description">
	{localize('brush_tuna.dialog.brush_settings.default_brush_curve.description')}
</p>

<CurveEdit
	id="default-pressure-curve"
	label={localize('brush_tuna.action.default_pressure_curve')}
	bind:startX
	bind:startY
	bind:pointAX
	bind:pointAY
	bind:pointBX
	bind:pointBY
	bind:endX
	bind:endY
/>

<Button
	icon="undo"
	label={localize('brush_tuna.action.reset_to_default')}
	onclick={resetToDefault}
/>

<style>
	.description {
		margin-bottom: 12px;
		color: var(--color-subtle_text);
	}
</style>
