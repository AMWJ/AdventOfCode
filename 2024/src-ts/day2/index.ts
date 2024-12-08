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
		const diffs = line.slice(1).map((element, i) => element - line[i]);
		const firstThreeDiffs = diffs.slice(0, 3);
		const direction =
			firstThreeDiffs.filter((diff) => diff > 0).length > 1 ? 1 : -1;
		const problems = diffs
			.map((_, i) => i)
			.filter((i) => {
				return Math.abs(diffs[i] - 2 * direction) >= 2;
			});
		switch (problems.length) {
			case 0:
				return true;
			case 1: {
				return (
					problems[0] === 0 ||
					problems[0] === diffs.length - 1 ||
					Math.abs(
						diffs[problems[0]] + diffs[problems[0] + 1] - 2 * direction,
					) < 2 ||
					Math.abs(
						diffs[problems[0]] + diffs[problems[0] - 1] - 2 * direction,
					) < 2
				);
			}
			case 2: {
				return (
					problems[1] - problems[0] === 1 &&
					Math.abs(diffs[problems[0]] + diffs[problems[1]] - 2 * direction) < 2
				);
			}
			default:
				return false;
		}
	}).length;
};
