import { readLineOfNumbers } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLineOfNumbers(`${__dirname}/input.txt`);
	return lines.filter((line) => {
		const firstSign = (line[1] - line[0]) / Math.abs(line[1] - line[0]);
		return line.every(
			(element, i) =>
				i === 0 || Math.abs(-(element - line[i - 1]) * firstSign + 2) < 2,
		);
	}).length;
};

export const star2 = async () => {
	const lines = await readLineOfNumbers(`${__dirname}/input.txt`);
	return lines.filter((line) => {
		const diffs = line.map((element, i) =>
			i === 0 ? 0 : element - line[i - 1],
		);
		diffs.shift();
		const firstThreeDiffs = diffs.slice(0, 3);
		const direction =
			firstThreeDiffs.filter((diff) => diff > 0).length > 1 ? 1 : -1;

		let removed = false;
		let leftover = 0;
		for (const [i, diff] of diffs.entries()) {
			const realDiff = diff + (leftover || 0);
			leftover = 0;
			if (
				realDiff / Math.abs(realDiff) !== direction ||
				Math.abs(realDiff) < 1 ||
				Math.abs(realDiff) > 3
			) {
				if (removed) {
					return false;
				}
				removed = true;
				if (i > 0) {
					leftover = realDiff;
				}
			}
		}
		return true;
	}).length;
};
