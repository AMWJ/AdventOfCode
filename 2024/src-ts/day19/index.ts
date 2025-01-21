import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const parse = async () => {
	const [first, ...lines] = await readLines(`${__dirname}/input.txt`);
	if (first === undefined) {
		throw new Error("Invalid input");
	}
	return { towels: first.split(", "), patterns: lines.slice(1) };
};

export const star1 = async () => {
	const { towels, patterns } = await parse();
	return patterns.filter((p) => {
		const queue = [""];
		while (queue.length) {
			const current = queue.pop();
			for (const towel of towels) {
				const next = current + towel;
				if (next === p) {
					return true;
				}
				if (p.startsWith(next)) {
					queue.push(next);
				}
			}
		}
	}).length;
};

export const star2 = async () => {
	const { towels, patterns } = await parse();
	return sum(
		patterns.map((p) => {
			const ways = new Array(p.length + 1).fill(0);
			ways[0] = 1;
			for (let i = 0; i < p.length; i++) {
				const waysToHere = ways[i];
				for (const towel of towels) {
					const reaches = i + towel.length;
					if (reaches > p.length) {
						continue;
					}
					if (p.slice(i, reaches) !== towel) {
						continue;
					}
					ways[reaches] += waysToHere;
				}
			}
			return ways[p.length];
		}),
	);
};
