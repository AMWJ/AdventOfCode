import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	return sum(
		lines.map((line) => {
			const [totalStr, sequenceStr] = line.split(": ");
			const total = Number.parseInt(totalStr);
			const sequence = sequenceStr
				.split(" ")
				.map((number) => Number.parseInt(number));
			return sequence
				.slice(1)
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
					new Set<number>([sequence[0]]),
				)
				.has(total)
				? total
				: 0;
		}),
	);
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	return sum(
		lines.map((line) => {
			const [totalStr, sequenceStr] = line.split(": ");
			const total = Number.parseInt(totalStr);
			const sequence = sequenceStr
				.split(" ")
				.map((number) => Number.parseInt(number));
			return sequence
				.slice(1)
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
				.has(sequence[0])
				? total
				: 0;
		}),
	);
};
