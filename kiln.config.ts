import { Project } from '/home/fufu/project/TypeScript/Kiln/src/kiln.ts'
import type { Target } from '/home/fufu/project/TypeScript/Kiln/src/kiln.ts'

export default (p: Project) => {
	p.setProject({
		name: 'test',
		lang: 'c',
		compiler: 'gcc',
		standard: 'c17',
		version: '0.0.0',
		buildToolVersion: '4.3.1'
	})

	let d: Target = {
		name: 'hello',
		type: 'static_lib',
		source: [
			'test/lib/hello.c'
		],
		include: ['test/include']
	}

	let a: Target = {
		name: 'main',
		type: 'executable',
		source: [
			'test/main.c',
			'test/maths.c',
		],
		include: ['test/include'],
		dep: [d],
		flags: [
			''
		]
	}
	p.addTarget(a)


}
