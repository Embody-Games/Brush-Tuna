<script lang="ts">
	import type { BrushPreset } from '../../brushPresets'
	import Checkbox from '../../components/dialog/checkbox.svelte'
	import ColorPicker from '../../components/dialog/colorPicker.svelte'
	import LineEdit from '../../components/dialog/lineEdit.svelte'
	import NumberSlider from '../../components/dialog/numberSlider.svelte'
	import Select from '../../components/dialog/select.svelte'
	import ToggleIconButton from '../../components/toggleIconButton.svelte'
	import BrushPresetList from './brushPresetList.svelte'

	// @ts-expect-error
	const presets = StateMemory.brush_presets as BrushPreset[]

	let selectedPresetIndex = $state(0)
	let name = $derived(presets[selectedPresetIndex].name)
	let shape = $derived(presets[selectedPresetIndex].shape)
	let blendMode = $derived(presets[selectedPresetIndex].blend_mode)
	let size = $derived(presets[selectedPresetIndex].size)
	let sizeEnabled = $derived(size != null)
	let usePenPressureForSize = $derived(presets[selectedPresetIndex].use_pen_pressure_for_size)
	let softness = $derived(presets[selectedPresetIndex].softness)
	let softnessEnabled = $derived(softness != null)
	let usePenPressureForSoftness = $derived(
		presets[selectedPresetIndex].use_pen_pressure_for_softness
	)
	let opacity = $derived(presets[selectedPresetIndex].opacity)
	let opacityEnabled = $derived(opacity != null)
	let usePenPressureForOpacity = $derived(
		presets[selectedPresetIndex].use_pen_pressure_for_opacity
	)
	let pixelPerfect = $derived(presets[selectedPresetIndex].pixel_perfect ?? false)
	let color = $derived(presets[selectedPresetIndex].color)
	let colorEnabled = $derived(color != null)

	$effect.pre(() => {
		const selected = presets[selectedPresetIndex]
		selected.name = name
		selected.shape = shape
		selected.blend_mode = blendMode

		selected.size = sizeEnabled ? size : null
		selected.use_pen_pressure_for_size = usePenPressureForSize

		selected.softness = softnessEnabled ? softness : null
		selected.use_pen_pressure_for_softness = usePenPressureForSoftness

		selected.opacity = opacityEnabled ? opacity : null
		selected.use_pen_pressure_for_opacity = usePenPressureForOpacity

		selected.pixel_perfect = pixelPerfect

		selected.color = colorEnabled ? color : null
	})
</script>

{#key name + shape}
	<BrushPresetList bind:selectedPresetIndex {presets} />
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
	<ToggleIconButton icon="weight-hanging" checked={usePenPressureForSize} />
	<input type="checkbox" bind:checked={sizeEnabled} />
</NumberSlider>

<NumberSlider
	id="opacity"
	label={tl('action.slider_brush_opacity')}
	min={0}
	max={255}
	disabled={!opacityEnabled}
	bind:value={opacity!}
>
	<ToggleIconButton icon="weight-hanging" checked={usePenPressureForOpacity} />
	<input type="checkbox" bind:checked={opacityEnabled} />
</NumberSlider>

<NumberSlider
	id="softness"
	label={tl('action.slider_brush_softness')}
	min={0}
	max={100}
	disabled={!softnessEnabled}
	bind:value={softness!}
>
	<ToggleIconButton icon="weight-hanging" checked={usePenPressureForSoftness} />
	<input type="checkbox" bind:checked={softnessEnabled} />
</NumberSlider>

<Checkbox id="pixel-perfect" label={tl('action.pixel_perfect_drawing')} bind:checked={pixelPerfect}
></Checkbox>

<ColorPicker id="color" label={tl('data.color')} disabled={!colorEnabled} bind:value={color!}>
	<input type="checkbox" bind:checked={colorEnabled} />
</ColorPicker>
