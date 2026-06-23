import { Project, Dependency, Target } from '/home/fufu/project/TypeScript/Kiln/src/kiln.ts'

export default (p: Project) => {
	p.setProject({
		name: 'test',
		lang: 'c',
		compiler: 'gcc',
		standard: 'c11',
		version: '',
		buildToolVersion: '4.3.1'
	})

	let d = new Target({
		name: 'hello',
		type: 'static_lib',
		source: [
			'test/lib/hello.c'
		],
		include: ['test/include']
	})

	let a = new Target({
		name: 'main',
		type: 'executable',
		source: [
			'test/main.c',
			'test/maths.c',
		],
		include: ['test/include'],
		dep: [d]
	})
	p.addTarget(a)


}
