import { readGridOfNumbers, readLines } from "../utils/file";
import { sum } from "../utils/math";

export const parse = async () => {
	return await readGridOfNumbers(`${__dirname}/input.txt`, "");
};

export const star1 = async () => {
	const grid = await parse();
	const spaces = grid.map(({ value }) => ({
		trails: new Set<number>(),
		value,
	}));
	for (const [index, cell] of spaces
		.findAll(({ value }) => value === 0)
		.entries()) {
		cell.value.trails.add(index);
	}
	const N = 9;
	for (let iteration = 0; iteration < N; iteration++) {
		for (const cell of spaces.findAll(({ value }) => value === iteration)) {
			for (const neighbor of spaces
				.neighbors(cell)
				.filter(({ value: { value } }) => value === iteration + 1)) {
				for (const index of cell.value.trails ?? []) {
					neighbor.value.trails.add(index);
				}
			}
		}
	}
	return sum(
		spaces
			.findAll(({ value }) => value === N)
			.map((cell) => cell.value.trails.size),
	);
};

export const star2 = async () => {
	const grid = await parse();
	const spaces = grid.map(({ value }) => ({
		trails: value === 0 ? 1 : 0,
		value,
	}));
	for (let iteration = 0; iteration < 9; iteration++) {
		for (const cell of spaces.findAll(({ value }) => value === iteration)) {
			for (const neighbor of spaces
				.neighbors(cell)
				.filter(({ value: { value } }) => value === iteration + 1)) {
				neighbor.value.trails += cell.value.trails;
			}
		}
	}
	return sum(
		spaces.findAll(({ value }) => value === 9).map((cell) => cell.value.trails),
	);
};
