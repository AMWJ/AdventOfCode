import { readLines } from "../utils/file";
import { sum } from "../utils/math";
import {
	newGrid,
	reverse,
	charToDirection,
	isDirectionChar,
} from "../utils/grid";

const ValidChar = [".", "#", "O", "@"] as const;
type Char = (typeof ValidChar)[number];

const validateChar = (c: string): c is Char => {
	return ValidChar.includes(c as Char);
};

const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const split = lines.findIndex((line) => line.trim() === "");
	const grid = newGrid({
		values: lines
			.slice(0, split)
			.map((line) => line.split("").filter(validateChar)),
	});
	const instructions = lines
		.slice(split + 1)
		.join("")
		.split("")
		.filter(isDirectionChar)
		.map(charToDirection);
	return { grid, instructions };
};

export const star1 = async () => {
	const { grid, instructions } = await parse();
	const start = grid.find((char) => char === "@");
	if (start === undefined) {
		throw new Error("No starting location found");
	}
	let location = start;
	for (const direction of instructions) {
		const nextLocation = location.getDirection(direction);
		if (nextLocation === undefined) {
			throw new Error("Ran off the grid");
		}
		let i = 0;
		let lookAhead = nextLocation;
		while (lookAhead.value === "O") {
			i++;
			const next = lookAhead.getDirection(direction);
			if (next === undefined) {
				throw new Error("Ran off the grid");
			}
			lookAhead = next;
		}
		if (lookAhead.value === ".") {
			lookAhead.value = nextLocation.value;
			nextLocation.value = "@";
			location.value = ".";
			location = nextLocation;
		}
	}
	return sum(grid.getAll("O").map(({ x, y }) => y * 100 + x));
};

const gridMarkers = {
	"#": ["#", "#"],
	"@": ["@", "."],
	".": [".", "."],
	O: ["[", "]"],
};

const ValidNewChar = [".", "#", "[", "]", "@"] as const;
type NewChar = (typeof ValidNewChar)[number];

const validateChar2 = (c: string): c is NewChar => {
	return ValidNewChar.includes(c as NewChar);
};

export const star2 = async () => {
	const { grid: originalGrid, instructions } = await parse();
	const grid = newGrid<NewChar, "visited">({
		values: originalGrid
			.rows()
			.map((row) =>
				row.flatMap((cell) => gridMarkers[cell.value]).filter(validateChar2),
			),
	});
	const start = grid.find((char) => char === "@");
	if (start === undefined) {
		throw new Error("No starting location found");
	}
	let location = start;
	for (const direction of instructions) {
		grid.deleteTag("visited");
		const nextLocation = location.getDirection(direction);
		if (nextLocation === undefined) {
			throw new Error("Ran off the grid");
		}
		const queue = [nextLocation];
		let wallBlocked = false;
		while (true) {
			const cell = queue.shift();
			if (cell === undefined) {
				break;
			}
			if (grid.hasTag(cell, "visited")) {
				continue;
			}
			if (cell.value === "#") {
				wallBlocked = true;
				break;
			}
			if (cell.value === ".") {
				continue;
			}
			grid.tagCell(cell, "visited");
			const forward = cell.getDirection(direction);
			if (forward !== undefined) {
				queue.push(forward);
			}
			if (cell.value === "]") {
				const left = cell.getDirection([-1, 0]);
				if (left === undefined) {
					throw new Error("Ran off the grid");
				}
				queue.push(left);
			}
			if (cell.value === "[") {
				const right = cell.getDirection([1, 0]);
				if (right === undefined) {
					throw new Error("Ran off the grid");
				}
				queue.push(right);
			}
		}
		if (!wallBlocked) {
			for (const cell of grid.findAllTagged("visited", reverse(direction))) {
				grid.setValue(cell.getDirection(direction), cell.value);
				cell.value = ".";
			}
			nextLocation.value = "@";
			location.value = ".";
			location = nextLocation;
		}
	}
	return sum(grid.getAll("[").map(({ x, y }) => y * 100 + x));
};
