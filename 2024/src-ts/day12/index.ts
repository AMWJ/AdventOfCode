import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const gardens: { [key: number]: { [key: number]: Set<number> } } = {};
	const plots = lines.map((line) => line.split("").map(() => undefined));
	const perimeters = {};
	const areas = {};
	let gardenNumberCounter = 0;
	for (const [j, line] of lines.entries()) {
		for (let i = 0; i < line.length; i++) {
			const letter = line[i];
			const leftLetter = line?.[i - 1];
			const upLetter = lines[j - 1]?.[i];
			if (letter === upLetter && letter === leftLetter) {
				if (plots[j - 1][i] !== plots[j][i - 1]) {
					// Merge gardens
					const otherGardenId = plots[j][i - 1];
					for (const [gardenJ, row] of Object.entries(gardens[otherGardenId])) {
						for (const gardenI of row) {
							gardens[plots[j - 1][i]][gardenJ] =
								gardens[plots[j - 1][i]][gardenJ] ?? new Set();
							gardens[plots[j - 1][i]][gardenJ].add(gardenI);
							plots[gardenJ][gardenI] = plots[j - 1][i];
						}
					}
					perimeters[plots[j - 1][i]] += perimeters[otherGardenId];
					areas[plots[j - 1][i]] += areas[otherGardenId];
					delete gardens[otherGardenId];
					delete perimeters[otherGardenId];
					delete areas[otherGardenId];
				}
				plots[j][i] = plots[j - 1][i];
				gardens[plots[j - 1][i]][j].add(i);
				areas[plots[j - 1][i]] += 1;
			} else if (letter === upLetter) {
				const otherGardenId = plots[j - 1][i];
				plots[j][i] = otherGardenId;
				gardens[otherGardenId][j] = gardens[otherGardenId][j] ?? new Set();
				gardens[otherGardenId][j].add(i);
				perimeters[otherGardenId] += 2;
				areas[otherGardenId] += 1;
			} else if (letter === leftLetter) {
				const otherGardenId = plots[j][i - 1];
				plots[j][i] = otherGardenId;
				gardens[otherGardenId][j] = gardens[otherGardenId][j] ?? new Set();
				gardens[otherGardenId][j].add(i);
				perimeters[otherGardenId] += 2;
				areas[otherGardenId] += 1;
			} else {
				// Create a new garden
				gardens[gardenNumberCounter] = {};
				gardens[gardenNumberCounter][j] = new Set([i]);
				plots[j][i] = gardenNumberCounter;
				perimeters[gardenNumberCounter] = 4;
				areas[gardenNumberCounter] = 1;
				gardenNumberCounter++;
			}
		}
	}
	return sum(Object.keys(areas).map((key) => areas[key] * perimeters[key]));
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const gardens: { [key: number]: { [key: number]: Set<number> } } = {};
	const plots = lines.map((line) => line.split("").map(() => undefined));
	const sides = {};
	const areas = {};
	let gardenNumberCounter = 0;
	for (const [j, line] of lines.entries()) {
		for (let i = 0; i < line.length; i++) {
			const letter = line[i];
			const leftLetter = line?.[i - 1];
			const upLetter = lines[j - 1]?.[i];
			if (letter === upLetter && letter === leftLetter) {
				if (plots[j - 1][i] !== plots[j][i - 1]) {
					// Merge gardens
					const otherGardenId = plots[j][i - 1];
					for (const [gardenJ, row] of Object.entries(gardens[otherGardenId])) {
						for (const gardenI of row) {
							gardens[plots[j - 1][i]][gardenJ] =
								gardens[plots[j - 1][i]][gardenJ] ?? new Set();
							gardens[plots[j - 1][i]][gardenJ].add(gardenI);
							plots[gardenJ][gardenI] = plots[j - 1][i];
						}
					}
					sides[plots[j - 1][i]] += sides[otherGardenId];
					areas[plots[j - 1][i]] += areas[otherGardenId];
					delete gardens[otherGardenId];
					delete sides[otherGardenId];
					delete areas[otherGardenId];
				}
				plots[j][i] = plots[j - 1][i];
				gardens[plots[j - 1][i]][j].add(i);
				areas[plots[j - 1][i]] += 1;
			} else if (letter === upLetter) {
				const otherGardenId = plots[j - 1][i];
				plots[j][i] = otherGardenId;
				gardens[otherGardenId][j] = gardens[otherGardenId][j] ?? new Set();
				gardens[otherGardenId][j].add(i);
				areas[otherGardenId] += 1;
			} else if (letter === leftLetter) {
				const otherGardenId = plots[j][i - 1];
				plots[j][i] = otherGardenId;
				gardens[otherGardenId][j] = gardens[otherGardenId][j] ?? new Set();
				gardens[otherGardenId][j].add(i);
				areas[otherGardenId] += 1;
			} else {
				// Create a new garden
				gardens[gardenNumberCounter] = {};
				gardens[gardenNumberCounter][j] = new Set([i]);
				plots[j][i] = gardenNumberCounter;
				areas[gardenNumberCounter] = 1;
				gardenNumberCounter++;
			}
			sides[plots[j][i]] = sides[plots[j][i]] ?? 0;
			if (
				line[i] !== line[i + 1] &&
				(j <= 0 ||
					line[i] !== lines[j - 1][i] ||
					line[i] === lines[j - 1][i + 1])
			) {
				sides[plots[j][i]]++;
			}
			if (
				line[i] !== line[i - 1] &&
				(j <= 0 ||
					line[i] !== lines[j - 1][i] ||
					line[i] === lines[j - 1][i - 1])
			) {
				sides[plots[j][i]]++;
			}
			if (
				line[i] !== lines[j + 1]?.[i] &&
				(i <= 0 || line[i] !== line[i - 1] || line[i] === lines[j + 1]?.[i - 1])
			) {
				sides[plots[j][i]]++;
			}
			if (
				line[i] !== lines[j - 1]?.[i] &&
				(i <= 0 || line[i] !== line[i - 1] || line[i] === lines[j - 1]?.[i - 1])
			) {
				sides[plots[j][i]]++;
			}
		}
	}
	return sum(Object.keys(areas).map((key) => areas[key] * sides[key]));
};
