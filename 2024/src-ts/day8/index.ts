import { readGrid, readLines } from "../utils/file";
import { pairs } from "../utils/general";
import { distance, type Cell } from "../utils/grid";
import { sum } from "../utils/math";

const parse = async () => {
	return await readGrid(`${__dirname}/input.txt`, "");
};

export const star1 = async () => {
	const grid = await parse();
	for (const cell of grid.findAll((value) => value !== ".")) {
		grid.tagCell(cell, cell.value);
	}
	for (const tag of Array.from(grid.tags.keys())) {
		for (const [first, second] of pairs(grid.findAllTagged(tag))) {
			const difference = distance(first, second);
			const antinode1 = grid.getDirection(first, difference);
			const antinode2 = grid.getDirection(second, difference, -1);
			if (antinode1 !== undefined) {
				grid.tagCell(antinode1, "antinode");
			}
			if (antinode2 !== undefined) {
				grid.tagCell(antinode2, "antinode");
			}
		}
	}
	return grid.findAllTagged("antinode").length;
};

export const star2 = async () => {
	const grid = await parse();
	for (const cell of grid.findAll((value) => value !== ".")) {
		grid.tagCell(cell, cell.value);
	}
	for (const tag of Array.from(grid.tags.keys())) {
		for (const [first, second] of pairs(grid.findAllTagged(tag))) {
			const difference = distance(first, second);
			let antinode1: Cell<string> | undefined = first;
			let antinode2: Cell<string> | undefined = second;

			while (antinode1 !== undefined) {
				grid.tagCell(antinode1, "antinode");
				antinode1 = grid.getDirection(antinode1, difference);
			}
			while (antinode2 !== undefined) {
				grid.tagCell(antinode2, "antinode");
				antinode2 = grid.getDirection(antinode2, difference, -1);
			}
		}
	}
	return grid.findAllTagged("antinode").length;
};
