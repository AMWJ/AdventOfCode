import { readLinesOfNumbers } from "../utils/file";
import { adjacencies } from "../utils/general";
import { sum } from "../utils/math";

const parse = async () => {
	return readLinesOfNumbers(`${__dirname}/input.txt`);
};

export const star1 = async () => {
	const lines = await parse();
	return lines.filter((line) => {
		const diffs = adjacencies(line).map(([first, second]) => second - first);
		if (diffs[0] === undefined) {
			return false;
		}
		const firstSign = diffs[0] / Math.abs(diffs[0]);

		return diffs.every((diff) => Math.abs(-diff * firstSign + 2) < 2);
	}).length;
};

export const star2 = async () => {
	const lines = await parse();
	return lines.filter((line) => {
		const lineAdjacencies = adjacencies(line);
		const diffs = lineAdjacencies.map(([first, second]) => second - first);
		const firstThreeDiffs = diffs.slice(0, 3);
		const direction =
			firstThreeDiffs.filter((diff) => diff > 0).length > 1 ? 1 : -1;
		const problems = diffs
			.map((diff, i) => ({
				diff,
				i,
			}))
			.filter(({ diff }) => {
				return Math.abs(diff - 2 * direction) >= 2;
			})
			.map(({ i }) => i);
		if (problems[0] === undefined) {
			return true;
		}
		const element = diffs[problems[0]];
		if (element === undefined) {
			throw new Error(`index ${problems[0]} is undefined in ${diffs}`);
		}
		const previous = diffs[problems[0] - 1];
		const next = diffs[problems[0] + 1];
		if (problems[1] === undefined) {
			return (
				previous === undefined ||
				next === undefined ||
				Math.abs(element + next - 2 * direction) < 2 ||
				Math.abs(element + previous - 2 * direction) < 2
			);
		}
		if (problems[2] !== undefined) {
			return false;
		}
		problems[1];
		return (
			problems[1] - problems[0] === 1 &&
			next &&
			Math.abs(element + next - 2 * direction) < 2
		);
	}).length;
};
