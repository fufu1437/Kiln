// import { Project, Dependency, Target } from './.builds/.kiln/kiln'
import { Project, Dependency, Target } from './.dist/kiln.js'

export default (p: Project) => {
	p.setProject({
		name: 'test',
		lang: 'c',
		compiler: 'gcc',
		standard: 'c11',
		version: '',
		buildToolVersion: '4.3.1'
	})
	let a = new Target({
		name: 'main',
		type: 'executable',
		source: [
			'test/main.c',
			'test/math.c'
		],
		include: [
			'test/include'
		]
	})
	p.addTarget(a)

	// p.addTarget(new Target({
	// 	name: "math",
	// 	type: 'executable',
	// 	source: [
	// 		'test/math.c'
	// 	]
	// }))
}
