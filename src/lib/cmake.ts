import { Target, Dependency } from '../kiln.ts'
import type {
	language__t,
	c_cpp_compiler__t,
	java_compiler__t,
	target_config__i,
	cppStandard__t,
	cStandard__t
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
	public setProject(n: string, l: language__t): void
	public setProject(n: string, l?: language__t): void {

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

	// public setCompiler(c: c_cpp_compiler__t | java_compiler__t) {
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

	public setStandard<langs extends language__t>(l: language__t, s: cStandard__t | cppStandard__t): void {
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

	private buildDep(d: Dependency | Target): string[] {
		const cmake_str = new Array<string>()
		if (d instanceof Dependency) {
		}
		else if (d instanceof Target) {
			const deps = d.getDep()
			if (deps != undefined) {
				for (const dep of deps) {
					cmake_str.push(...this.buildDep(dep))
				}
			}
			// d.getType() == 'static_lib' ? 'STATIC' : 'SHARED'
			if (d.getType() == 'static_lib') {
				cmake_str.push(`add_library(${d.getName()} STATIC ${d.getSource()?.join(' ')})\n`)
			}
			else {
				cmake_str.push(`add_library(${d.getName()} SHARED ${d.getSource()?.join(' ')})\n`)
			}
			if (d.getInclude() != undefined) {
				cmake_str.push(`target_include_directories(${d.getName()} PRIVATE ${d.getInclude()?.join(' ')})\n`)
			}
			// this.outValue.push(`target_include_directories(${d.getName()} STATIC PRIVATE ${d.getSource().join(' ')})\n`)
		}

		return cmake_str
	}

	public addTarget(t: Target) {
		const name = t.getName().trim()
		if (name === '') {
			return
		}

		const deps = t.getDep()
		const depPackNames = new Array<string>()
		if (deps != undefined) {
			for (const dep of deps) {
				if (dep instanceof Dependency) {
					this.buildDep(dep)
				}
				if (dep instanceof Target) {
					depPackNames.push(dep.getName())
					let asd = this.buildDep(dep)
					this.outValue.push(...asd)
				}
			}
		}

		this.outValue.push(`add_executable(${name})\n`)
		if (t.getInclude() != undefined) {
			this.outValue.push(`target_include_directories(${name} PRIVATE ${t.getInclude()?.join(' ')})\n`)
		}
		this.outValue.push(`target_sources(${name} PRIVATE ${t.getSource().join(' ')})\n`)
		if (depPackNames.length != 0) {
			this.outValue.push(`target_link_libraries(${name} PRIVATE ${depPackNames.join(' ')})\n`)
		}
	}

	// public addLib(d: Dependency) {
	// 	if (d.getType() == 'static_lib') {
	// 		this.outValue.push(`add_library(${name} PRIVATE ${d.getInclude()?.join(' ')})\n`)
	// 		if (d.getInclude() != undefined) {
	// 			this.outValue.push(`target_include_directories(${name} PRIVATE ${d.getInclude()?.join(' ')})\n`)
	// 		}
	// 		this.outValue.push
	// 	}

	// 	else if (d.getType() == 'dynamic_lib') {

	// 		if (d.getInclude() != undefined) {
	// 			this.outValue.push(`target_include_directories(${name} PRIVATE ${d.getInclude()?.join(' ')})\n`)
	// 		}

	// 	}
	// }

	public join(separator?: string) {
		if (separator == undefined) return this.outValue.join()
		else return this.outValue.join(separator)
	}
}
