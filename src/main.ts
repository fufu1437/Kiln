// import NodeVM from 'node:NodeVM'

import { execSync } from 'child_process'

import fs_promises from 'node:fs/promises'
import fs from 'node:fs'

import { parseArgs } from 'node:util'

import { Project, Target, Dependency, __dirname } from './kiln.ts'

import path from 'path'

import language from './lib/language.ts'

import CMake from './lib/cmake.ts'

const kiln_config_ts_value = `import { Project } from './.builds/.kiln/kiln.js'\n\nexport default (p: Project) => {
\tp.setProject({\n\t\tname: 'default',\n\t\tlang: 'c',\n\t\tcompiler: 'gcc',\n\t\tstandard: 'c11',\n\t\tversion: '0.0.0',
\t\tbuildTool: 'cmake',\n\t})\n}\n`

const pack = '.builds'

const kiln_config_ts = 'kiln.config.ts'

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
	const kilnTypeDefFile = path.join(kilnTypeKilnPath, 'kiln.d.ts')
	const kilnTypeKilnJsFile = path.join(kilnTypeKilnPath, 'kiln.js')

	if (argv[2] === 'init') {
		if (!fs.existsSync(kilnDSL)) {
			fs.writeFileSync(kilnDSL, kiln_config_ts_value)
		}
		else {
			if (fs.statSync(kilnDSL).isDirectory()) {
				console.log(`${kilnDSL} 是一个目录`)
			}
		}
		const kilnTypeDef = fs.readFileSync(path.join(__dirname, '..', '.dist', 'kiln.d.ts'))
		if (!fs.existsSync(outPath)) {
			fs.mkdirSync(outPath)
			fs.mkdirSync(kilnTypeKilnPath)
			fs.writeFileSync(kilnTypeDefFile, kilnTypeDef)
		}
		else {
			if (fs.statSync(outPath).isFile()) {
				console.log(`${outPath} 是一个文件`)
			}
		}

		if (!fs.existsSync(kilnTypeKilnPath)) {
			fs.mkdirSync(kilnTypeKilnPath)
			fs.writeFileSync(kilnTypeDefFile, kilnTypeDef)
		}
		else {
			if (fs.statSync(kilnTypeKilnPath).isFile()) {
				console.log(`${kilnTypeKilnPath} 是一个文件`)
			}
		}

		if (!fs.existsSync(kilnTypeDefFile)) {
			fs.writeFileSync(kilnTypeDefFile, kilnTypeDef)
		}
		else {
			if (fs.statSync(kilnTypeDefFile).isDirectory()) {
				console.log(`${kilnTypeDefFile} 是一个目录`)
			}
		}

		if (!fs.existsSync(kilnTypeKilnJsFile)) {
			const kilnTypeJsDef = fs.readFileSync(path.join(__dirname, '..', '.dist', 'kiln.js'))
			fs.writeFileSync(kilnTypeKilnJsFile, kilnTypeJsDef)
		}
		else {
			if (fs.statSync(kilnTypeKilnJsFile).isDirectory()) {
				console.log(`${kilnTypeKilnJsFile} 是一个目录`)
			}
		}
		return 0
	}

	else if (argv[2] === 'build') {
		const kilnDSLJs = path.join()
		const project = new Project()
		const kiln = await import(kilnDSL)
		kiln.default(project)
		// console.log(project.getConfig())
		// console.log(project.getTarget())

		const config = project.getConfig()
		const target = project.getTarget()

		const cmake = new CMake()

		cmake.setVersion(config.buildToolVersion as string)
		// cmake.setCompiler(config.compiler)
		cmake.setProject(config.name, config.lang)


		for (const t of target) {
			if (t === undefined) continue
			cmake.addTarget(t)
		}


		console.log(cmake.out().join(''))
	}
	else if (argv[2] === 'cbuild') {
		try {
			// 同步执行命令，编码设为 utf-8 直接返回字符串
			execSync('which gcc', {
				encoding: 'utf-8',
				stdio: 'inherit'
			})

		} catch (error) {
			// @ts-ignore
			return error.code
		}
	}

	else {
		console.log(localeLang?.help)
		return 0
	}

	return 0
}

process.exit(await main())
