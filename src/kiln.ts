import url from 'url'
import path from 'path'

export const __filename = url.fileURLToPath(import.meta.url)
export const __srcDir = path.dirname(__filename)

export type language =
	| 'c'
	| 'cpp'
	| 'c/cpp'
	| 'java'

export type cStandard =
	| 'c89'
	| 'c99'
	| 'c11'
	| 'c17'
	| 'c23'

export type cppStandard =
	| 'cpp98'
	| 'cpp03'
	| 'cpp11'
	| 'cpp14'
	| 'cpp17'
	| 'cpp20'
	| 'cpp23'
	| 'cpp26'

type javaStandard =
	| 'java'

type packageManager =
	| 'ConanCenter'
	| 'vcpkg'
	| 'GitHub'

export type c_cpp_compiler =
	| 'gcc'
	| 'clang'
	| 'msvc'

export type java_compiler =
	| 'javac'

type c_cpp_buildools =
	| 'cmake'

interface project_config<langs extends language> {
	lang: langs,
	name: string,
	version: string,

	compiler?: langs extends 'c' | 'cpp' | 'c/cpp'
	? c_cpp_compiler
	: java_compiler,

	standard: langs extends 'c'
	? cStandard
	: (langs extends 'cpp' | 'c/cpp'
		? cppStandard
		: javaStandard
	),

	buildTool?: langs extends 'c' | 'cpp' | 'c/cpp'
	? c_cpp_buildools
	: '',
	buildToolVersion?: string
}

export interface target {
	name: string
	source: string[]
	type:
	| 'executable'
	| 'static_lib'
	| 'dynamic_lib'

	dep?: Array<target>
	include?: string[]
	flags?: string[]
}

export class Project {
	private config!: {}
	private target: target[]
	private lang!: language
	private outPath: string
	// private buildTool: c_cpp_buildools
	constructor() {
		this.target = new Array<target>()
		this.outPath = '.'
		// this.buildTool = 'cmake'
	}

	public setOutPath(path: string) { this.outPath = path }
	public setProject<langs extends language>(config: project_config<langs>) {
		if (config.buildToolVersion === undefined) {
			config.buildToolVersion = '4.3.4'
		}
		this.config = config
		this.lang = config.lang
	}

	// 添加构建目标
	public addTarget(target: target) {
		this.target.push(target)
	}

	// 添加子目录
	public addSubdirectory() {

	}
	public getConfig(): project_config<typeof this.lang> {
		return this.config as project_config<typeof this.lang>
	}
	public getTarget() { return this.target }
}

export function isTarget(value: unknown): value is target {
	if ((typeof value !== 'object') || (value === null)) {
		return false
	}

	if (!(
		((('name' in value)) && (typeof value.name === 'string')) ||
		((('type' in value)) && (typeof value.type === 'string')) ||
		((('source' in value)) && (typeof value.source === 'string'))
	)) {
		return false
	}

	if (('dep' in value)) {
		if (!Array.isArray(value.dep)) return false
		for (const dep of value.dep) {
			if (!isTarget(dep)) return false
		}
	}

	if (('include' in value)) {
		if ((value.include !== undefined) &&
			(!isArrayString(value.include))
		) {
			return false
		}
	}

	if (('flags' in value)) {
		if ((value.flags !== undefined) &&
			(!isArrayString(value.flags))
		) {
			return false
		}
	}

	return true
}

function isArrayString(value: unknown): value is string[] {
	if (!Array.isArray(value)) return false
	return value.every(item => typeof item === 'string')
}

// export class Target {
// 	private name: string
// 	private source: string[]
// 	private dep: Array<Dependency | Target> | undefined
// 	private include: string[] | undefined
// 	private type: targetype
// 	private args: string[] | undefined

// 	constructor(config: target_config) {
// 		this.dep = config.dep
// 		this.name = config.name
// 		this.type = config.type
// 		this.source = config.source
// 		this.args = config.args
// 		this.include = config.include
// 	}

// 	public getName(): string { return this.name }
// 	public getSource(): string[] { return this.source }
// 	public getType(): targetype { return this.type }
// 	public getDep(): Array<Dependency | Target> | undefined { return this.dep }
// 	public getInclude(): string[] | undefined { return this.include }
// 	public getArgs(): string[] | undefined { return this.args }
// }

// export class Subdirectory {
// 	constructor(config: {

// 	}) {

// 	}
// }

// // 占位符,尚未实际实现
// export class Dependency {
// 	private lang: language
// 	private packName: packageManager
// 	private url: string | undefined

// 	constructor(config: {
// 		// lang: language,
// 		packName: packageManager,
// 		url?: string
// 	}) {
// 		this.lang = 'c'
// 		this.packName = config.packName
// 		this.url = config.url
// 	}

// 	public setLang(lang: language) {
// 		this.lang = lang
// 	}

// 	public getPackName(): packageManager {
// 		return this.packName
// 	}

// 	public getUrl(): string | undefined {
// 		return this.url
// 	}
// }

// export class Project {
// 	private name: string
// 	private version: string
// 	private c_cppStandard: cOrCppStandard
// 	private cmake_version: string
// 	private target_l: Target[]

// 	constructor() {
// 		this.name = ''
// 		this.version = ''
// 		this.cmake_version = ''
// 		this.c_cppStandard = 'c17'
// 		this.target_l = new Array<Target>()
// 	}

// 	public setName(name: string) {
// 		this.name = name
// 	}

// 	public setVersion(version: string) {
// 		this.version = version
// 	}

// 	public setCMakeVersion(version: string) {
// 		this.cmake_version = version
// 	}

// 	public setC_CppStandard(standard: cOrCppStandard) {
// 		this.c_cppStandard = standard
// 	}

// 	public addTarget(t: Target) {
// 		this.target_l.push(t)
// 	}
// }

// export class Target {
// 	name: string | undefined
// 	source: string[] | undefined
// 	include: string[] | undefined
// 	dep: Target[] | undefined

// 	constructor(config: {
// 		name?: string,
// 		source?: string[],
// 		include?: string[],
// 		dep?: Target[]
// 	}) {
// 		this.name = config.name
// 		this.source = config.source
// 		this.include = config.include
// 		this.dep = config.dep
// 	}
// }

