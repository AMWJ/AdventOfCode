import { readGridOfNumbers } from "../utils/file";
import { sum } from "../utils/math";
import { zip } from "../utils/general";

export const parse = async () => {
	const grid = await readGridOfNumbers(`${__dirname}/input.txt`);
	return [grid.columns()[0] ?? [], grid.columns()[1] ?? []] as const;
};

export const star1 = async () => {
	const [firsts, seconds] = await parse();
	const sortedFirsts = firsts.sort((a, b) => a.value - b.value);
	const sortedSeconds = seconds.sort((a, b) => a.value - b.value);
	return sum(
		zip(sortedFirsts, sortedSeconds).map(([first, second]) =>
			Math.abs(second.value - first.value),
		),
	);
};

export const star2 = async () => {
	const [firsts, seconds] = await parse();
	const occurrences = seconds.reduce(
		(acc, second) => {
			acc[second.value] = (acc[second.value] ?? 0) + 1;
			return acc;
		},
		{} as Record<number, number>,
	);
	return sum(
		firsts.map((first) => first.value * (occurrences?.[first.value] ?? 0)),
	);
};
