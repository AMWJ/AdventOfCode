import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const endOfRules = lines.findIndex((line) => line === "");
	const ruleLines = lines
		.slice(0, endOfRules)
		.map((line) => line.split("|").map(Number));
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
	return sum(
		lists
			.filter((list) => {
				for (let i = 0; i < list.length; i++) {
					const current = list[i];
					const currentRules = rules[current];
					for (let j = i + 1; j < list.length; j++) {
						const other = list[j];
						const relevantRule = currentRules[other];
						if (!relevantRule) {
							continue;
						}
						if (relevantRule === "before") {
							return false;
						}
					}
				}
				return true;
			})
			.map((list) => list[(list.length - 1) / 2]),
	);
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const endOfRules = lines.findIndex((line) => line === "");
	const ruleLines = lines
		.slice(0, endOfRules)
		.map((line) => line.split("|").map(Number));
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
	return sum(
		lists.map((list) => {
			let swapped = false;
			for (let i = 0; i < list.length; i++) {
				let currentRules = rules[list[i]];
				for (let j = i + 1; j < list.length; j++) {
					const relevantRule = currentRules[list[j]];
					if (!relevantRule) {
						continue;
					}
					if (relevantRule === "before") {
						swapped = true;
						const swapValue = list[i];
						list[i] = list[j];
						list[j] = swapValue;
						currentRules = rules[list[i]];
					}
				}
			}
			return swapped ? list[(list.length - 1) / 2] : 0;
		}),
	);
};
