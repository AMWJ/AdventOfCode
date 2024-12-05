import { open } from "node:fs/promises";
import { readLineOfNumbers } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLineOfNumbers(`${__dirname}/input.txt`);
	const firsts = lines.map((line) => line[0]).sort((a, b) => a - b);
	const seconds = lines.map((line) => line[1]).sort((a, b) => a - b);
	const diffs = firsts.map((first, i) => Math.abs(seconds[i] - first));
	return sum(diffs);
};

export const star2 = async () => {
	const lines = await readLineOfNumbers(`${__dirname}/input.txt`);
	const firsts = lines.map((line) => line[0]);
	const seconds = lines.map((line) => line[1]);
	const occurances = seconds.reduce((acc, second) => {
		if (!acc[second]) {
			acc[second] = 0;
		}
		acc[second] += 1;
		return acc;
	}, {});
	return sum(firsts.map((first) => first * (occurances?.[first] ?? 0)));
};
