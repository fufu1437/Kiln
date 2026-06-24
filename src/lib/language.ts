import path from 'node:path'
import fs from 'node:fs'

import { __srcDir } from '../kiln.ts'

// import zh_cn from '../languages/zh_cn.json' with {type: 'json'}

export interface language {
	help: string,
	no_argv: string,
}

export default function getLang(): language | undefined {
	const languages = path.join(__srcDir, '..', 'languages')
	const lang = process.env['LANG']?.split('.')[0] as string
	let i18n!: language
	if (lang == 'zh_CN') {
		const langJson = fs.readFileSync(path.join(languages, (lang.toLowerCase() + '.json')), 'utf-8')
		i18n = JSON.parse(langJson)
	}

	else {
		return undefined
	}
	return i18n
}
