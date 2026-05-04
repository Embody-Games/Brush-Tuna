import * as PACKAGE from '../package.json'

BBPlugin.register(PACKAGE.name, {
	title: PACKAGE.title,
	author: PACKAGE.author.name,
	description: PACKAGE.description,
	icon: 'icon.png',
	variant: 'both',
	version: PACKAGE.version,
	min_version: PACKAGE.min_blockbench_version,
	tags: PACKAGE.tags as [string, string, string],
	bug_tracker: PACKAGE.repository.url + '/issues',
	has_changelog: true,
	onload() {},
	onunload() {},
	oninstall() {},
	onuninstall() {},
})
