import { readLines } from "../utils/file";
import { newGrid } from "../utils/grid";
import { sum } from "../utils/math";

const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	return lines.map((line) => {
		const [totalStr, sequenceStr] = line.split(": ");
		if (totalStr === undefined || sequenceStr === undefined) {
			throw new Error("Invalid input");
		}
		const total = Number(totalStr);
		const sequence = sequenceStr.split(" ").map((number) => Number(number));
		return { total, sequence };
	});
};

export const star1 = async () => {
	const lines = await parse();
	return sum(
		lines.map(({ total, sequence: [first, ...restOfSequence] }) => {
			if (first === undefined) {
				throw new Error("Invalid input");
			}
			return restOfSequence
				.reduce(
					(acc, number) => {
						const newSet = new Set<number>();
						for (const sum of acc) {
							if (sum + number <= total) {
								newSet.add(sum + number);
							}
							if (sum * number <= total) {
								newSet.add(sum * number);
							}
						}
						return newSet;
					},
					new Set<number>([first]),
				)
				.has(total)
				? total
				: 0;
		}),
	);
};

export const star2 = async () => {
	const lines = await parse();
	return sum(
		lines.map(({ total, sequence: [first, ...restOfSequence] }) => {
			if (first === undefined) {
				throw new Error("Invalid input");
			}
			return restOfSequence
				.reverse()
				.reduce(
					(acc, number) => {
						const newAcc = new Set<number>();
						for (const [total, sequence] of acc.entries()) {
							if (total >= number) {
								newAcc.add(total - number);
							}
							const digits = Math.floor(Math.log10(number)) + 1;
							const powerOfTen = 10 ** digits;
							if ((total - number) % powerOfTen === 0 && total >= number) {
								newAcc.add((total - number) / powerOfTen);
							}
							if (total % number === 0) {
								newAcc.add(total / number);
							}
						}
						return newAcc;
					},
					new Set<number>([total]),
				)
				.has(first)
				? total
				: 0;
		}),
	);
};
