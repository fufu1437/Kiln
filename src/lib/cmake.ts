import { Target } from '../kiln.ts'
import type { language__t, c_cpp_compiler__t, java_compiler__t } from '../kiln.ts'
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

	public addTarget(t: Target) {
		const name = t.getName().trim()
		if (name === '') {
			return
		}
		if (t.getType() == 'executable') {
			this.outValue.push(`add_executable(${name})\n`)
			if (t.getInclude() != undefined) {
				this.outValue.push(`target_include_directories(${name} PRIVATE ${t.getInclude()?.join(' ')})\n`)
			}

			this.outValue.push(`target_sources(${name} PRIVATE ${t.getSource().join(' ')})\n`)
		}

		else if (t.getType() == 'static_lib') {
			this.outValue.push
			if (t.getInclude() != undefined) {
				this.outValue.push(`target_include_directories(${name} PRIVATE ${t.getInclude()?.join(' ')})\n`)
			}
			this.outValue.push
		}

		else if (t.getType() == 'dynamic_lib') {

			if (t.getInclude() != undefined) {
				this.outValue.push(`target_include_directories(${name} PRIVATE ${t.getInclude()?.join(' ')})\n`)
			}

		}
	}

	public out() {
		return this.outValue
	}
}
