<script lang="ts">
	import type { BrushPreset } from '../../../brushPresets'
	import Button from '../../../components/dialog/button.svelte'
	import Checkbox from '../../../components/dialog/checkbox.svelte'
	import ColorPicker from '../../../components/dialog/colorPicker.svelte'
	import CurveEdit from '../../../components/dialog/curveEdit.svelte'
	import LineEdit from '../../../components/dialog/lineEdit.svelte'
	import NumberSlider from '../../../components/dialog/numberSlider.svelte'
	import Select from '../../../components/dialog/select.svelte'
	import ToggleIconButton from '../../../components/toggleIconButton.svelte'
	import { localize } from '../../../util/lang'
	import BrushPresetList from './brushPresetList.svelte'

	// @ts-expect-error
	const presets = StateMemory.brush_presets as BrushPreset[]

	let selectedIndex = $state(0)
	let name = $derived(presets[selectedIndex].name)
	let shape = $derived(presets[selectedIndex].shape)
	let blendMode = $derived(presets[selectedIndex].blend_mode)
	let size = $derived(presets[selectedIndex].size)
	let sizeEnabled = $derived(presets[selectedIndex].size != null)
	let usePenPressureForSize = $derived(presets[selectedIndex].size_pressure_curve != null)
	let sizeCurveStartPointX = $derived(presets[selectedIndex].size_pressure_curve?.[0] ?? 0)
	let sizeCurveStartPointY = $derived(presets[selectedIndex].size_pressure_curve?.[1] ?? 0)
	let sizeCurvePointAX = $derived(presets[selectedIndex].size_pressure_curve?.[2] ?? 0.25)
	let sizeCurvePointAY = $derived(presets[selectedIndex].size_pressure_curve?.[3] ?? 0.25)
	let sizeCurvePointBX = $derived(presets[selectedIndex].size_pressure_curve?.[4] ?? 0.75)
	let sizeCurvePointBY = $derived(presets[selectedIndex].size_pressure_curve?.[5] ?? 0.75)
	let sizeCurveEndPointX = $derived(presets[selectedIndex].size_pressure_curve?.[6] ?? 1)
	let sizeCurveEndPointY = $derived(presets[selectedIndex].size_pressure_curve?.[7] ?? 1)

	let softness = $derived(presets[selectedIndex].softness)
	let softnessEnabled = $derived(presets[selectedIndex].softness != null)
	let usePenPressureForSoftness = $derived(presets[selectedIndex].softness_pressure_curve != null)
	let softnessCurveStartPointX = $derived(
		presets[selectedIndex].softness_pressure_curve?.[0] ?? 0
	)
	let softnessCurveStartPointY = $derived(
		presets[selectedIndex].softness_pressure_curve?.[1] ?? 0
	)
	let softnessCurvePointAX = $derived(presets[selectedIndex].softness_pressure_curve?.[2] ?? 0.25)
	let softnessCurvePointAY = $derived(presets[selectedIndex].softness_pressure_curve?.[3] ?? 0.25)
	let softnessCurvePointBX = $derived(presets[selectedIndex].softness_pressure_curve?.[4] ?? 0.75)
	let softnessCurvePointBY = $derived(presets[selectedIndex].softness_pressure_curve?.[5] ?? 0.75)
	let softnessCurveEndPointX = $derived(presets[selectedIndex].softness_pressure_curve?.[6] ?? 1)
	let softnessCurveEndPointY = $derived(presets[selectedIndex].softness_pressure_curve?.[7] ?? 1)

	let opacity = $derived(presets[selectedIndex].opacity)
	let opacityEnabled = $derived(presets[selectedIndex].opacity != null)
	let usePenPressureForOpacity = $derived(presets[selectedIndex].opacity_pressure_curve != null)
	let opacityCurveStartPointX = $derived(presets[selectedIndex].opacity_pressure_curve?.[0] ?? 0)
	let opacityCurveStartPointY = $derived(presets[selectedIndex].opacity_pressure_curve?.[1] ?? 0)
	let opacityCurvePointAX = $derived(presets[selectedIndex].opacity_pressure_curve?.[2] ?? 0.25)
	let opacityCurvePointAY = $derived(presets[selectedIndex].opacity_pressure_curve?.[3] ?? 0.25)
	let opacityCurvePointBX = $derived(presets[selectedIndex].opacity_pressure_curve?.[4] ?? 0.75)
	let opacityCurvePointBY = $derived(presets[selectedIndex].opacity_pressure_curve?.[5] ?? 0.75)
	let opacityCurveEndPointX = $derived(presets[selectedIndex].opacity_pressure_curve?.[6] ?? 1)
	let opacityCurveEndPointY = $derived(presets[selectedIndex].opacity_pressure_curve?.[7] ?? 1)

	let pixelPerfect = $derived(presets[selectedIndex].pixel_perfect ?? false)
	let color = $derived(presets[selectedIndex].color)
	let colorEnabled = $derived(presets[selectedIndex].color != null)

	$effect.pre(() => {
		const selected = presets[selectedIndex]
		selected.name = name
		selected.shape = shape
		selected.blend_mode = blendMode

		selected.size = sizeEnabled ? size : null
		selected.size_pressure_curve = usePenPressureForSize
			? [
					sizeCurveStartPointY,
					sizeCurveStartPointY,
					sizeCurvePointAX,
					sizeCurvePointAY,
					sizeCurvePointBX,
					sizeCurvePointBY,
					sizeCurveEndPointX,
					sizeCurveEndPointY,
				]
			: null

		selected.softness = softnessEnabled ? softness : null
		selected.softness_pressure_curve = usePenPressureForSoftness
			? [
					softnessCurveStartPointY,
					softnessCurveStartPointY,
					softnessCurvePointAX,
					softnessCurvePointAY,
					softnessCurvePointBX,
					softnessCurvePointBY,
					softnessCurveEndPointX,
					softnessCurveEndPointY,
				]
			: null

		selected.opacity = opacityEnabled ? opacity : null
		selected.opacity_pressure_curve = usePenPressureForOpacity
			? [
					opacityCurveStartPointY,
					opacityCurveStartPointY,
					opacityCurvePointAX,
					opacityCurvePointAY,
					opacityCurvePointBX,
					opacityCurvePointBY,
					opacityCurveEndPointX,
					opacityCurveEndPointY,
				]
			: null

		selected.pixel_perfect = pixelPerfect

		selected.color = colorEnabled ? color : null
	})

	function deletePreset() {
		if (presets.length === 0) return

		presets.splice(selectedIndex, 1)
		selectedIndex++
		selectedIndex--
		if (selectedIndex >= presets.length) {
			selectedIndex = presets.length - 1
		}
	}
</script>

<div class="brush-options-dialog">
	{#key name + shape}
		<BrushPresetList bind:selectedPresetIndex={selectedIndex} {presets} />
	{/key}

	<LineEdit id="brush-name" label={tl('generic.name')} bind:value={name} />

	<Select
		id="brush-shape"
		label={tl('action.brush_shape')}
		options={{
			circle: tl('action.brush_shape.circle'),
			square: tl('action.brush_shape.square'),
		}}
		bind:value={shape}
	/>

	<Select
		id="brush-blend-mode"
		label={tl('action.blend_mode')}
		options={{
			unset: tl('generic.unset'),
			default: tl('action.blend_mode.default'),
			set_opacity: tl('action.blend_mode.set_opacity'),
			color: tl('action.blend_mode.color'),
			behind: tl('action.blend_mode.behind'),
			multiply: tl('action.blend_mode.multiply'),
			// divide: tl('action.blend_mode.divide'),
			add: tl('action.blend_mode.add'),
			// subtract: tl('action.blend_mode.subtract'),
			lighten: tl('action.blend_mode.lighten'),
			darken: tl('action.blend_mode.darken'),
			screen: tl('action.blend_mode.screen'),
			overlay: tl('action.blend_mode.overlay'),
			difference: tl('action.blend_mode.difference'),
		}}
		bind:value={blendMode}
	/>

	<NumberSlider
		id="size"
		label={tl('action.slider_brush_size')}
		min={1}
		disabled={!sizeEnabled}
		bind:value={size!}
	>
		<ToggleIconButton
			icon="weight-hanging"
			disabled={!sizeEnabled}
			bind:checked={usePenPressureForSize}
		/>
		<input type="checkbox" bind:checked={sizeEnabled} />
	</NumberSlider>

	{#if usePenPressureForSize && sizeEnabled}
		<CurveEdit
			id="pressure-curve"
			label={tl('action.slider_brush_size') +
				' ' +
				localize('brush_tuna.action.pressure_curve')}
			bind:startX={sizeCurveStartPointX}
			bind:startY={sizeCurveStartPointY}
			bind:endX={sizeCurveEndPointX}
			bind:endY={sizeCurveEndPointY}
			bind:pointAX={sizeCurvePointAX}
			bind:pointAY={sizeCurvePointAY}
			bind:pointBX={sizeCurvePointBX}
			bind:pointBY={sizeCurvePointBY}
		></CurveEdit>
	{/if}

	<NumberSlider
		id="opacity"
		label={tl('action.slider_brush_opacity')}
		min={0}
		max={255}
		disabled={!opacityEnabled}
		bind:value={opacity!}
	>
		<ToggleIconButton
			icon="weight-hanging"
			disabled={!opacityEnabled}
			bind:checked={usePenPressureForOpacity}
		/>
		<input type="checkbox" bind:checked={opacityEnabled} />
	</NumberSlider>

	{#if usePenPressureForOpacity && opacityEnabled}
		<CurveEdit
			id="pressure-curve"
			label={tl('action.slider_brush_opacity') +
				' ' +
				localize('brush_tuna.action.pressure_curve')}
			bind:startX={opacityCurveStartPointX}
			bind:startY={opacityCurveStartPointY}
			bind:endX={opacityCurveEndPointX}
			bind:endY={opacityCurveEndPointY}
			bind:pointAX={opacityCurvePointAX}
			bind:pointAY={opacityCurvePointAY}
			bind:pointBX={opacityCurvePointBX}
			bind:pointBY={opacityCurvePointBY}
		></CurveEdit>
	{/if}

	<NumberSlider
		id="softness"
		label={tl('action.slider_brush_softness')}
		min={0}
		max={100}
		disabled={!softnessEnabled}
		bind:value={softness!}
	>
		<ToggleIconButton
			icon="weight-hanging"
			disabled={!softnessEnabled}
			bind:checked={usePenPressureForSoftness}
		/>
		<input type="checkbox" bind:checked={softnessEnabled} />
	</NumberSlider>

	{#if usePenPressureForSoftness && softnessEnabled}
		<CurveEdit
			id="pressure-curve"
			label={tl('action.slider_brush_softness') +
				' ' +
				localize('brush_tuna.action.pressure_curve')}
			bind:startX={softnessCurveStartPointX}
			bind:startY={softnessCurveStartPointY}
			bind:endX={softnessCurveEndPointX}
			bind:endY={softnessCurveEndPointY}
			bind:pointAX={softnessCurvePointAX}
			bind:pointAY={softnessCurvePointAY}
			bind:pointBX={softnessCurvePointBX}
			bind:pointBY={softnessCurvePointBY}
		></CurveEdit>
	{/if}

	<Checkbox
		id="pixel-perfect"
		label={tl('action.pixel_perfect_drawing')}
		bind:checked={pixelPerfect}
	></Checkbox>

	<ColorPicker id="color" label={tl('data.color')} disabled={!colorEnabled} bind:value={color!}>
		<input type="checkbox" bind:checked={colorEnabled} />
	</ColorPicker>

	<div class="spacer"></div>

	<Button icon="trash" label={tl('generic.delete')} onclick={deletePreset}></Button>
</div>

<style>
	.brush-options-dialog {
		max-height: 75vh;
		overflow-y: auto;
	}
	.spacer {
		height: 16px;
	}
</style>
