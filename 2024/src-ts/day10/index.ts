import { readLines } from "../utils/file";
import { sum } from "../utils/math";
import { sleep } from "../utils/sleep";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const numbers = lines.map((line) =>
		line.split("").map((i) => Number.parseInt(i)),
	);
	let spaces = numbers.map((line) => line.map((n) => new Set<number>()));
	const zeroes = numbers.flatMap((line, j) =>
		line
			.map((_, i) => [i, j] as [number, number])
			.filter(([i, j]) => numbers[j][i] === 0),
	);
	for (const [index, [i, j]] of zeroes.entries()) {
		spaces[j][i].add(index);
	}
	for (let iteration = 0; iteration < 9; iteration++) {
		const newSpaces = numbers.map((line) => line.map((n) => new Set<number>()));
		for (let j = 0; j < numbers.length; j++) {
			for (let i = 0; i < numbers[j].length; i++) {
				if (numbers[j][i] !== iteration) {
					continue;
				}
				const neighbors = [
					[i - 1, j],
					[i + 1, j],
					[i, j - 1],
					[i, j + 1],
				];
				for (const [x, y] of neighbors) {
					if (x < 0 || x >= numbers[j].length || y < 0 || y >= numbers.length) {
						continue;
					}
					if (numbers[y][x] === iteration + 1) {
						for (const index of spaces[j][i]) {
							newSpaces[y][x].add(index);
						}
					}
				}
			}
		}
		spaces = newSpaces;
	}
	return sum(spaces.flatMap((line) => line.map((s) => s.size)));
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const numbers = lines.map((line) =>
		line.split("").map((i) => Number.parseInt(i)),
	);
	let spaces = numbers.map((line) => line.map((n) => 0));
	const zeroes = numbers.flatMap((line, j) =>
		line
			.map((_, i) => [i, j] as [number, number])
			.filter(([i, j]) => numbers[j][i] === 0),
	);
	for (const [index, [i, j]] of zeroes.entries()) {
		spaces[j][i] = 1;
	}
	for (let iteration = 0; iteration < 9; iteration++) {
		const newSpaces = numbers.map((line) => line.map((n) => 0));
		for (let j = 0; j < numbers.length; j++) {
			for (let i = 0; i < numbers[j].length; i++) {
				if (numbers[j][i] !== iteration) {
					continue;
				}
				const neighbors = [
					[i - 1, j],
					[i + 1, j],
					[i, j - 1],
					[i, j + 1],
				];
				for (const [x, y] of neighbors) {
					if (x < 0 || x >= numbers[j].length || y < 0 || y >= numbers.length) {
						continue;
					}
					if (numbers[y][x] === iteration + 1) {
						newSpaces[y][x] += spaces[j][i];
					}
				}
			}
		}
		spaces = newSpaces;
	}
	return sum(spaces.flatMap((line) => line.map((s) => s)));
};
