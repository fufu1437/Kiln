interface kilnCmd {
	init: boolean
	build: boolean
	buildc: boolean
	'--help': boolean
	'-h': boolean
	output: string
}

export function cmdParsing(argv: string[]): kilnCmd | undefined {
	if (argv.length == 0) return undefined

	const cmd: kilnCmd = {
		init: false,
		build: false,
		buildc: false,
		'--help': false,
		'-h': false,
		output: '.'
	} as kilnCmd

	// console.log()
	// const cmdKey = Object.keys(cmd)
	for (const arg of argv) {
		const ars = arg.split('=')
		const value = ars.splice(1)
		const a = ars[0] as string
		if (a in cmd) {
			console.log(ars)
			// if (ars.length >= 2) {
			// 我不知道该怎么解决这里的类型报错, 所以出此下策
			// @ts-ignore
			cmd[a as keyof kilnCmd] = value.join('')
			console.log(cmd)
			// }

		}
	}

	return cmd
}

console.log(cmdParsing(process.argv.slice(2)))
