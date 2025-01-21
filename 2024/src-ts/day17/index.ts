import { readLines } from "../utils/file";
import { zip } from "../utils/general";

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const registerArray = lines
		.slice(
			0,
			lines.findIndex((line) => line.trim() === ""),
		)
		.map((line) => line.split(":")[1]?.trim())
		.filter((v) => v !== undefined)
		.map(Number);
	const registers: [number, number, number] = [
		registerArray[0] ?? 0,
		registerArray[1] ?? 0,
		registerArray[2] ?? 0,
	];
	const program = lines[lines.length - 1]
		?.split(":")[1]
		?.trim()
		.split(",")
		.map(Number);
	if (program === undefined) {
		throw new Error("No program found");
	}
	return { registers, program };
};

export const evaluateComboOperand = <T = number>(
	registers: [T, T, T],
	operand: number,
) => {
	if (operand <= 3) {
		return operand;
	}
	if (operand > 6) {
		throw new Error("Invalid operand");
	}
	const response = registers[operand - 4];
	if (response === undefined) {
		throw new Error("Invalid operand");
	}
	return response;
};

export const star1 = async () => {
	const { registers, program } = await parse();
	const output: number[] = [];
	let i = 0;
	while (i < program.length) {
		const opcode = program[i];
		const operand = program[i + 1];
		if (operand === undefined || opcode === undefined) {
			throw new Error("Invalid program");
		}
		(
			[
				() => {
					for (let j = 0; j < evaluateComboOperand(registers, operand); j++) {
						registers[0] = Math.floor(registers[0] / 2);
					}
				},
				() => {
					registers[1] = registers[1] ^ operand;
				},
				() => {
					registers[1] = evaluateComboOperand(registers, operand) % 8;
				},
				() => {
					if (registers[0] !== 0) {
						i = operand - 2;
					}
				},
				() => {
					registers[1] = registers[1] ^ registers[2];
				},
				() => {
					output.push(evaluateComboOperand(registers, operand) % 8);
				},
				() => {
					throw new Error(`Invalid opcode ${opcode}`);
				},
				() => {
					registers[2] = registers[0];
					for (let j = 0; j < evaluateComboOperand(registers, operand); j++) {
						registers[2] = Math.floor(registers[2] / 2);
					}
				},
			][opcode] ?? (() => undefined)
		)();
		i += 2;
	}
	return output.join(",");
};

export const star2 = async () => {
	const { program } = await parse();
	const queue = [BigInt(0)];
	let highest: bigint | undefined = undefined;
	while (true) {
		const previous = queue.shift();
		if (previous === undefined) {
			break;
		}
		for (
			let x = previous * BigInt(8);
			x < previous * BigInt(8) + BigInt(8);
			x++
		) {
			let i = 0;
			const output: bigint[] = [];
			const registers: [bigint, bigint, bigint] = [x, BigInt(0), BigInt(0)];
			while (i < program.length) {
				const opcode = program[i];
				const operand = program[i + 1];
				if (operand === undefined || opcode === undefined) {
					throw new Error("Invalid program");
				}
				const out: bigint | undefined = (
					[
						() => {
							for (
								let j = 0;
								j < evaluateComboOperand(registers, operand);
								j++
							) {
								registers[0] = registers[0] / BigInt(2);
							}
							return undefined;
						},
						() => {
							registers[1] = registers[1] ^ BigInt(operand);
							return undefined;
						},
						() => {
							registers[1] =
								BigInt(evaluateComboOperand(registers, operand)) % BigInt(8);
							return undefined;
						},
						() => {
							if (registers[0] !== BigInt(0)) {
								i = operand - 2;
							}
							return undefined;
						},
						() => {
							registers[1] = registers[1] ^ registers[2];
							return undefined;
						},
						() => BigInt(evaluateComboOperand(registers, operand)) % BigInt(8),
						() => {
							throw new Error(`Invalid opcode ${opcode}`);
						},
						() => {
							registers[2] = registers[0];
							for (
								let j = 0;
								j < evaluateComboOperand(registers, operand);
								j++
							) {
								registers[2] = registers[2] / BigInt(2);
							}
							return undefined;
						},
					][opcode] ?? (() => undefined)
				)();
				if (out !== undefined) {
					output.push(out);
				}
				i += 2;
			}
			if (
				zip(output, program.slice(-output.length)).every(
					([x, y]) => x === BigInt(y),
				)
			) {
				if (output.length === program.length) {
					if (!highest || x < highest) {
						highest = x;
					}
				} else {
					queue.push(x);
				}
			}
		}
	}
	return Number(highest);
};
