// import { execSync } from 'child_process'

import fs from 'node:fs'


import { Project, __srcDir } from './kiln.ts'

import path from 'path'

import language from './lib/language.ts'

import CMake from './lib/cmake.ts'

import { fileURLToPath } from 'node:url'
import { dirname, basename } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 只获取当前目录的名称
const currentDirName = basename(__dirname)

const kiln_configs_value = `import { Project } from '${/node_modules/.test(__srcDir) ? '@fufu1437/kiln' : `${__srcDir}/kiln.ts`}'\n\nexport default (p: Project) => {
\tp.setProject({\n\t\tname: 'default',\n\t\tlang: 'c',\n\t\tcompiler: 'gcc',\n\t\tstandard: 'c11',\n\t\tversion: '0.0.0',
\t\tbuildTool: 'cmake',\n\t})\n}\n`

async function main(): Promise<number> {
	const localeLang = language()
	if (process.argv.length === 2) {
		console.log(localeLang?.no_argv)
		return 1
	}

	const argv = process.argv
	const kilnDSL = path.join(process.cwd(), 'kiln.config.ts')
	const outPath = path.join(process.cwd(), '.builds')
	const kilnTypeKilnPath = path.join(outPath, '.kiln')

	if (argv[2] === 'init') {
		if (!fs.existsSync(kilnDSL)) {
			fs.writeFileSync(kilnDSL, kiln_configs_value)
		}
		else {
			if (fs.statSync(kilnDSL).isDirectory()) {
				console.log(`${kilnDSL} 是一个目录`)
			}
		}

		return 0
	}

	else if (argv[2] === 'build') {
		const project = new Project()
		let kiln
		try {
			kiln = await import(kilnDSL)
		}
		catch (error: unknown) {
			if (error instanceof Object && 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND') {
				console.log(localeLang?.no_config)
				return 2
			}
		}

		kiln.default(project)

		const config = project.getConfig()
		const Target = project.getTarget()

		const cmake = new CMake()
		cmake.setVersion(config.buildToolVersion as string)
		// cmake.setCompiler(config.compiler)
		cmake.setProject(config.name, config.lang)

		if (config.standard != 'java') {
			cmake.setStandard(config.lang, config.standard)
		}
		for (const t of Target) {
			if (t === undefined) continue
			cmake.addTarget(t)
		}


		// console.log(cmake.out().join(''))
		fs.writeFileSync("CMakeLists.txt", cmake.join(''))
	}
	else if (argv[2] === 'cbuild') {


	}

	else {
		console.log(localeLang?.help)
		return 0
	}

	return 0
}

process.exit(await main())
