import { readLines } from "../utils/file";
import { toBits } from "../utils/bytes";
import { pairs } from "../utils/general";

type OperationType = "AND" | "OR" | "XOR";

type Operation = {
	args: [string, string];
	operation: OperationType;
	result: string;
};

const ops: Record<OperationType, (a: boolean, b: boolean) => boolean> = {
	AND: (a, b) => a && b,
	OR: (a, b) => a || b,
	XOR: (a, b) => a !== b,
};

const execute = (operations: Operation[], a: number, b: number) => {
	const aBits = toBits(a);
	const bBits = toBits(b);
	const values: { [key: string]: boolean } = {};
	const xs = new Array(
		...new Set<string>(
			operations.flatMap((op) => op.args.filter((arg) => arg.startsWith("x"))),
		),
	).toSorted();
	for (const [i, x] of xs.entries()) {
		values[x] = bBits[bBits.length - 1 - i] === 1;
	}
	const ys = new Array(
		...new Set<string>(
			operations.flatMap((op) => op.args.filter((arg) => arg.startsWith("y"))),
		),
	).toSorted();
	for (const [i, y] of ys.entries()) {
		values[y] = aBits[aBits.length - 1 - i] === 1;
	}
	const operationsCopy = [...operations];
	let spliced = true;
	while (operationsCopy.length > 0) {
		if (!spliced) {
			return undefined;
		}
		spliced = false;
		for (const op of operationsCopy) {
			const arg1 = values[op.args[0]];
			const arg2 = values[op.args[1]];
			if (arg1 === undefined || arg2 === undefined) {
				continue;
			}
			if (values[op.result] !== undefined) {
				throw new Error(`Already set ${op}`);
			}
			values[op.result] = ops[op.operation](arg1, arg2);
			operationsCopy.splice(operationsCopy.indexOf(op), 1);
			spliced = true;
			break;
		}
	}

	const digits: (0 | 1)[] = [];
	for (
		let i = 0;
		values[`z${i.toString().padStart(2, "0")}`] !== undefined;
		i++
	) {
		const digit = values[`z${i.toString().padStart(2, "0")}`];
		digits.unshift(digit ? 1 : 0);
	}
	const expected = toBits(a + b);
	const extendedExpected =
		expected.length < digits.length
			? [...new Array(digits.length - expected.length).fill(0), ...expected]
			: expected;
	return !digits.some((digit, i) => digit !== extendedExpected[i]);
};

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const initialValues = Object.fromEntries(
		lines
			.slice(0, lines.indexOf(""))
			.map((line) => line.split(": "))
			.map(([k, v]) => [k, v === "1"]),
	);
	const operations = lines
		.slice(lines.indexOf("") + 1)
		.map((line) => line.split(" "))
		.map(([arg1, operation, arg2, _, result]) => {
			return { args: [arg1, arg2], operation, result } as Operation;
		});
	return { initialValues, operations };
};

export const star1 = async () => {
	const { initialValues, operations } = await parse();
	const values = { ...initialValues };
	const operationsCopy = [...operations];
	while (operationsCopy.length > 0) {
		for (const op of operationsCopy) {
			if (
				values[op.args[0]] === undefined ||
				values[op.args[1]] === undefined
			) {
				continue;
			}
			if (values[op.result] !== undefined) {
				throw new Error(`Already set ${op}`);
			}
			values[op.result] = ops[op.operation](
				values[op.args[0]],
				values[op.args[1]],
			);
			operationsCopy.splice(operationsCopy.indexOf(op), 1);
		}
	}
	let result = 0;
	for (
		let i = 0;
		values[`z${i.toString().padStart(2, "0")}`] !== undefined;
		i++
	) {
		const digit = values[`z${i.toString().padStart(2, "0")}`];
		result += digit ? 2 ** i : 0;
	}
	return result;
};

export const star2 = async () => {
	const { initialValues, operations } = await parse();
	const xs = Object.keys(initialValues)
		.filter((initialValue) => initialValue.startsWith("x"))
		.sort();
	const digitsAndTries = Array(xs.length)
		.fill(0)
		.map((_, digit) => ({
			digit,
			tries: [
				[2 ** digit, 0],
				[0, 2 ** digit],
				[2 ** digit, 2 ** digit],
				...(digit > 0
					? [
							[3 * 2 ** (digit - 1), 2 ** (digit - 1)],
							[2 ** (digit - 1), 3 * 2 ** (digit - 1)],
							[3 * 2 ** (digit - 1), 3 * 2 ** (digit - 1)],
						]
					: []),
			] as [number, number][],
		}))
		.filter(({ tries }) => {
			return !tries.every(([a, b]) => execute(operations, a, b));
		});
	const perfectSwaps = digitsAndTries.map(({ digit, tries }) => ({
		digit,
		swaps: [] as [string, string][],
		tries,
	}));
	// Try swapping every pair of nodes to see if it fixes the issue
	for (const [op1, op2] of pairs(operations)) {
		const operationsCopy = operations;
		[op1.result, op2.result] = [op2.result, op1.result];

		for (const { tries, swaps } of perfectSwaps) {
			if (
				tries.every(([a, b]) => {
					const verified = execute(operationsCopy, a, b);
					return verified && !Number.isNaN(verified);
				})
			) {
				swaps.push([op1.result, op2.result]);
			}
		}
		// Swap back
		[op1.result, op2.result] = [op2.result, op1.result];
	}
	for (const { digit } of perfectSwaps.filter(
		({ swaps }) => swaps.length === 0,
	)) {
		throw new Error(`No perfect swaps found for digit ${digit}`);
	}

	const queue: { swaps: [string, string][]; upTo: number }[] = [
		{ swaps: [], upTo: 0 },
	];
	while (true) {
		const entry = queue.pop();
		if (entry === undefined) {
			break;
		}
		const { swaps, upTo } = entry;
		if (swaps.length > 4) {
			continue;
		}
		if (upTo >= perfectSwaps.length) {
			return swaps.flat().sort().join(",");
		}
		if (perfectSwaps[upTo]?.swaps.length === 0) {
			queue.push({ swaps, upTo: upTo + 1 });
			continue;
		}
		for (const swap of perfectSwaps[upTo]?.swaps ?? []) {
			queue.push({
				swaps: swaps.some((s) => s[0] === swap[0] && s[1] === swap[1])
					? swaps
					: [...swaps, swap],
				upTo: upTo + 1,
			});
		}
	}
	throw new Error("No solution found");
};
