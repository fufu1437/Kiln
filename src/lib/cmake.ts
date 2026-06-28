import {
	isTarget
} from '../kiln.ts'
import type {
	language,
	c_cpp_compiler,
	java_compiler,
	cppStandard,
	cStandard,
	Target
} from '../kiln.ts'
import { exec } from 'child_process'

export default class CMake {
	private outValue: string[]

	public constructor() {
		this.outValue = new Array<string>()
	}

	public setVersion(v: string) {
		this.outValue.push(`cmake_minimum_required(VERSION ${v})\n`)
	}

	public setProject(n: string): void
	public setProject(n: string, l: language): void
	public setProject(n: string, l?: language): void {

		if (l == 'c') {
			this.outValue.push(`project(${n} LANGUAGES C)\n`)
		}
		else if (l == 'c/cpp') {
			this.outValue.push(`project(${n} LANGUAGES C CXX)\n`)
		}
		else if (l == 'cpp') {
			this.outValue.push(`project(${n} LANGUAGES CXX)\n`)
		}
		else {
			this.outValue.push(`project(${n})\n`)
		}
	}

	// public setCompiler(c: c_cpp_compiler_ | java_compiler_) {
	// // set(CMAKE_C_COMPILER "/usr/bin/gcc")
	// // set(CMAKE_CXX_COMPILER "/usr/bin/g++")
	// if (c == 'gcc') {
	// this.outValue.push(`set(CMAKE_C_COMPILER "${exec('which gcc')}")\n`)
	// this.outValue.push(`set(CMAKE_C_COMPILER "${exec('which g++')}")\n`)
	// }
	// }

	private setCStandard(s: string) {
		return [
			`set(CMAKE_C_STANDARD ${s})\n`,
			`set(CMAKE_C_STANDARD_REQUIRED ON)\n`,
			`set(CMAKE_C_EXTENSIONS OFF)\n`
		]
	}

	private setCppStandard(s: string) {
		return [
			`set(CMAKE_CXX_STANDARD ${s})\n`,
			`set(CMAKE_CXX_STANDARD_REQUIRED ON)\n`,
			`set(CMAKE_CXX_EXTENSIONS OFF)\n`
		]
	}

	public setStandard<langs extends language>(l: language, s: cStandard | cppStandard): void {
		if (l == 'c') {
			this.outValue.push(...this.setCStandard(s.replace(/^c+/, '')))
		}
		else if (l == 'cpp') {
			this.outValue.push(...this.setCppStandard(s.replace(/^cpp+/, '')))
		}
		else {
			this.outValue.push(...this.setCStandard(s.replace(/^c+/, '')))
			this.outValue.push(...this.setCppStandard(s.replace(/^cpp+/, '')))
		}
	}

	private buildDep(d: Target): string[] {
		const cmake_str = new Array<string>()

		if (isTarget(d)) {
			const deps = d.dep
			if (deps != undefined) {
				for (const dep of deps) {
					cmake_str.push(...this.buildDep(dep))
				}
			}
			// d.getType() == 'static_lib' ? 'STATIC' : 'SHARED'
			if (d.type == 'static_lib') {
				cmake_str.push(`add_library(${d.name} STATIC ${d.source?.join(' ')})\n`)
			}
			else {
				cmake_str.push(`add_library(${d.name} SHARED ${d.source?.join(' ')})\n`)
			}
			if (d.include != undefined) {
				cmake_str.push(`target_include_directories(${d.name} PRIVATE ${d.include?.join(' ')})\n`)
			}

		}

		return cmake_str
	}

	public addTarget(t: Target) {
		const name = t.name.trim()
		if (name === '') {
			return
		}

		const deps = t.dep
		const depPackNames = new Array<string>()
		if (deps != undefined) {
			for (const dep of deps) {
				// if (dep instanceof Dependency) {
				// 	this.buildDep(dep)
				// }
				depPackNames.push(dep.name)
				let asd = this.buildDep(dep)
				this.outValue.push(...asd)

			}
		}

		this.outValue.push(`add_executable(${name})\n`)
		if (t.include != undefined) {
			this.outValue.push(`target_include_directories(${name} PRIVATE ${t.include?.join(' ')})\n`)
		}
		this.outValue.push(`target_sources(${name} PRIVATE ${t.source.join(' ')})\n`)
		if (depPackNames.length != 0) {
			this.outValue.push(`target_link_libraries(${name} PRIVATE ${depPackNames.join(' ')})\n`)
		}
		const flags = t.flags
		if (flags !== undefined && flags?.length != 0) {
			this.outValue.push(`target_compile_options(${name} PRIVATE ${flags.join(' ')})\n`)
		}
	}

	public addSubdirectory(path: string) {
		this.outValue.push(path)
	}



	// public addLib(d: Dependency) {
	// 	if (d.getType() == 'static_lib') {
	// 		this.outValue.push(`add_library(${ name } PRIVATE ${ d.include?.join(' ') }) \n`)
	// 		if (d.include != undefined) {
	// 			this.outValue.push(`Targetnclude_directories(${ name } PRIVATE ${ d.include?.join(' ') }) \n`)
	// 		}
	// 		this.outValue.push
	// 	}

	// 	else if (d.getType() == 'dynamic_lib') {

	// 		if (d.include != undefined) {
	// 			this.outValue.push(`Targetnclude_directories(${ name } PRIVATE ${ d.include?.join(' ') }) \n`)
	// 		}

	// 	}
	// }

	public join(separator?: string) {
		if (separator == undefined) return this.outValue.join()
		else return this.outValue.join(separator)
	}

	public clean() {
		this.outValue.length = 0
	}
}
