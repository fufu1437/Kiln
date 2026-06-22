
// export function parsing() {
// 	const command_t = new Map<string, string>()
// 	const argv = Bun.argv.slice(2)
// 	if (argv.length === 0) {
// 		return undefined
// 	}
// 	for (let i = 0; i < argv.length; i++) {

// 	}

// 	return command_t
// }

// parsing()

// type cmd_type =
// 	| "string"
// 	| "number"
// 	| 'array'
// 	| "bool"
// 	| "null"

// interface command_t {
// 	short?: string
// 	long?: string
// 	// son_cmd?: string
// 	type: cmd_type
// 	description: string
// 	is_must: boolean
// }

// type parsingResult_t = Map<string, string>

// class parsing {
// 	private cmd: Map<string, command_t>
// 	private cmd_list: string[]
// 	private index: number
// 	constructor() {
// 		this.cmd = new Map<string, command_t>()
// 		this.cmd_list = new Array<string>()
// 		this.index = 0
// 		process.argv
// 	}

// 	public add(config: command_t) {
// 		if (config.short === undefined && config.long === undefined) {
// 			throw Error(`At least one of 'short' or 'long' option must be provided. In the ${this.index}st`)
// 		}
// 		if (config.long !== undefined) {
// 			this.cmd.set("--" + config.long, config)
// 		}
// 		if (config.short !== undefined) {
// 			this.cmd.set("-" + config.short, config)
// 		}
// 		this.index++
// 		return this
// 	}

// 	public parse(): Record<string, string | number | boolean | undefined> | undefined {
// 		let argv = process.argv.slice(2)
// 		if (argv.length === 0) {
// 			return undefined
// 		}

// 		let result: Record<string, string | number | boolean | undefined> = {}

// 		for (let i = 0; i < argv.length; i++) {
// 			const v = argv[i]

// 			if (v === undefined) break
// 			if (!this.cmd.has(v)) continue

// 			if (this.cmd.get(v)?.type === "string") {
// 				result[v.replace(/^-+/, "")] = argv[i + 1]
// 				i++
// 				continue
// 			}
// 		}


// 		return result
// 	}
// }

// let argv = new parsing()

// argv
// 	.add({
// 		short: "h",
// 		long: "help",
// 		type: "string",
// 		description: "",
// 		is_must: false
// 	})
// 	.add({
// 		short: "a",
// 		type: "bool",
// 		description: "asd",
// 		is_must: false
// 	})


// console.log(argv.parse())
export function cmdParsing(): number {
	const argv = process.argv.slice(2)
	if (argv.length === 0) return 1



	return 0
}
