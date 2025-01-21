import { readLines } from "../utils/file";
import { adjacencies, zip } from "../utils/general";
import { sum } from "../utils/math";

const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const endOfRules = lines.findIndex((line) => line === "");
	const ruleLines = lines
		.slice(0, endOfRules)
		.map((line) => line.split("|", 2).map(Number) as [number, number]);
	const rules: { [key: number]: { [key: number]: "before" | "after" } } = {};
	for (const [before, after] of ruleLines) {
		rules[before] = rules[before] || {};
		rules[after] = rules[after] || {};
		rules[before][after] = "after";
		rules[after][before] = "before";
	}
	const lists = lines
		.slice(endOfRules + 1)
		.map((line) => line.split(",").map(Number));
	return { rules, lists };
};

export const star1 = async () => {
	const { rules, lists } = await parse();
	return sum(
		lists
			.filter((list) => {
				return adjacencies(list).every(([first, second]) => {
					const currentRules = rules[first];
					return (
						!currentRules ||
						!currentRules[second] ||
						currentRules[second] === "after"
					);
				});
			})
			.map((list) => list[(list.length - 1) / 2] ?? 0),
	);
};

export const star2 = async () => {
	const { rules, lists } = await parse();

	return sum(
		lists.map((list) => {
			const sortedList = list.toSorted((a, b) =>
				rules?.[a]?.[b] === "before" ? 1 : -1,
			);
			return zip(list, sortedList).every(([a, b]) => a === b)
				? 0
				: (sortedList[(sortedList.length - 1) / 2] ?? 0);
		}),
	);
};
