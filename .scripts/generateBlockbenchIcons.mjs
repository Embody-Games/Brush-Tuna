// Regenerates src/data/blockbenchIcons.ts from a local Blockbench checkout.
//
// Usage:  BLOCKBENCH_PATH=/path/to/blockbench bun .scripts/generateBlockbenchIcons.mjs
//
// Requires python3 with `fonttools` and `brotli` installed (only to read the
// ligature names out of the Material Symbols woff2).

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BB = process.env.BLOCKBENCH_PATH || resolve('../../snavesutit/blockbench')
if (!existsSync(BB)) {
	console.error(`Blockbench checkout not found at "${BB}". Set BLOCKBENCH_PATH.`)
	process.exit(1)
}

const css = readFileSync(resolve(BB, 'css/fontawesome.css'), 'utf8')
const uniq = list => [...new Set(list)].sort()

// Solid/regular icons use ".fa-name::before"; brand icons use "  .fa-name:before".
const solid = uniq([...css.matchAll(/^\.fa-([a-z0-9-]+)::before/gm)].map(m => m[1]))
const solidSet = new Set(solid)
const brands = uniq(
	[...css.matchAll(/^\s+\.fa-([a-z0-9-]+):before/gm)].map(m => m[1]).filter(n => !solidSet.has(n))
)

const selection = JSON.parse(readFileSync(resolve(BB, 'icons/icomoon/selection.json'), 'utf8'))
const icomoon = uniq(selection.icons.map(i => i.properties.name))

const material = uniq(
	JSON.parse(
		execFileSync('python3', [
			'-c',
			`import re,json
from fontTools.ttLib import TTFont
f=TTFont(${JSON.stringify(resolve(BB, 'font/material-icons.woff2'))})
print(json.dumps([g for g in f.getGlyphOrder()
  if re.match(r'^[a-z][a-z0-9_]*$',g) and len(g)>1 and not g.startswith('digit_') and g!='underscore']))`,
		])
	)
)

const pack = (name, doc, list) =>
	`/** ${doc} */\nexport const ${name}: string[] = ${JSON.stringify(list.join(' '))}.split(' ')\n`

writeFileSync(
	resolve('src/data/blockbenchIcons.ts'),
	`// AUTO-GENERATED from the icon fonts and stylesheets bundled with Blockbench.
// Regenerate with \`bun .scripts/generateBlockbenchIcons.mjs\` when bumping the supported version.
// Do not edit by hand.

${pack('MATERIAL_ICONS', 'Material Symbols ligature names (use the name directly).', material)}
${pack('FA_SOLID_ICONS', 'Font Awesome solid/regular icon names (use as `fa-<name>`).', solid)}
${pack('FA_BRAND_ICONS', 'Font Awesome brand icon names (use as `fab.fa-<name>`).', brands)}
${pack('ICOMOON_ICONS', 'Blockbench custom Icomoon icon names (use as `icon-<name>`).', icomoon)}`
)

console.log(
	`material ${material.length}, solid ${solid.length}, brands ${brands.length}, icomoon ${icomoon.length}`
)
