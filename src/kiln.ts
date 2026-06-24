import url from 'url'
import path from 'path'

export const __filename = url.fileURLToPath(import.meta.url)
export const __srcDir = path.dirname(__filename)

export type language__t =
	| 'c'
	| 'cpp'
	| 'c/cpp'
	| 'java'

export type cStandard__t =
	| 'c89'
	| 'c99'
	| 'c11'
	| 'c17'
	| 'c23'

export type cppStandard__t =
	| 'cpp98'
	| 'cpp03'
	| 'cpp11'
	| 'cpp14'
	| 'cpp17'
	| 'cpp20'
	| 'cpp23'
	| 'cpp26'

type javaStandard__t =
	| 'java'

type packageManager__t =
	| 'ConanCenter'
	| 'vcpkg'
	| 'GitHub'

export type c_cpp_compiler__t =
	| 'gcc'
	| 'clang'
	| 'msvc'

export type java_compiler__t =
	| 'javac'

type c_cpp_build_tools__t =
	| 'cmake'

interface project_config__i<langs extends language__t> {
	lang: langs,
	name: string,
	version: string,

	compiler?: langs extends 'c' | 'cpp' | 'c/cpp'
	? c_cpp_compiler__t
	: java_compiler__t,

	standard: langs extends 'c'
	? cStandard__t
	: (langs extends 'cpp' | 'c/cpp'
		? cppStandard__t
		: javaStandard__t
	),

	buildTool?: langs extends 'c' | 'cpp' | 'c/cpp'
	? c_cpp_build_tools__t
	: '',
	buildToolVersion?: string
}

export class Project {
	private config!: {}
	private target: Target[]
	private lang!: language__t
	private outPath: string
	// private buildTool: c_cpp_build_tools__t
	constructor() {
		this.target = new Array<Target>()
		this.outPath = '.'
		// this.buildTool = 'cmake'
	}

	public setOutPath(path: string) { this.outPath = path }
	public setProject<langs extends language__t>(config: project_config__i<langs>) {
		if (config.buildToolVersion === undefined) {
			config.buildToolVersion = '4.3.4'
		}
		this.config = config
		this.lang = config.lang
	}

	public addTarget(target: Target) {
		this.target.push(target)
	}

	public getConfig(): project_config__i<typeof this.lang> {
		return this.config as project_config__i<typeof this.lang>
	}
	public getTarget() { return this.target }
}

type target_type__t =
	| 'executable'
	| 'static_lib'
	| 'dynamic_lib'

export interface target_config__i {
	name: string,
	source: string[],
	dep?: Array<Dependency | Target>,
	include?: string[]
	type: target_type__t,
	args?: string[]
}

export class Target {
	private name: string
	private source: string[]
	private dep: Array<Dependency | Target> | undefined
	private include: string[] | undefined
	private type: target_type__t
	private args: string[] | undefined

	constructor(config: target_config__i) {
		this.dep = config.dep
		this.name = config.name
		this.type = config.type
		this.source = config.source
		this.args = config.args
		this.include = config.include
	}

	public getName(): string { return this.name }
	public getSource(): string[] { return this.source }
	public getType(): target_type__t { return this.type }
	public getDep(): Array<Dependency | Target> | undefined { return this.dep }
	public getInclude(): string[] | undefined { return this.include }
	public getArgs(): string[] | undefined { return this.args }
}

// 占位符,尚未实际实现
export class Dependency {
	private lang: language__t
	private packName: packageManager__t
	private url: string | undefined

	constructor(config: {
		// lang: language__t,
		packName: packageManager__t,
		url?: string
	}) {
		this.lang = 'c'
		this.packName = config.packName
		this.url = config.url
	}

	public setLang(lang: language__t) {
		this.lang = lang
	}

	public getPackName(): packageManager__t {
		return this.packName
	}

	public getUrl(): string | undefined {
		return this.url
	}
}

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

