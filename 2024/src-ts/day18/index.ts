import { readLines } from "../utils/file";
import { Down, newGrid, Right } from "../utils/grid";
import { pathFind } from "../utils/pathFinding";

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	return lines
		.map((line) => line.split(","))
		.map(([a, b]) => [Number(a), Number(b)] as [number, number]);
};

export const star1 = async () => {
	const coordinates = await parse();
	const maxX = Math.max(...coordinates.map(([x]) => x));
	const maxY = Math.max(...coordinates.map(([_, y]) => y));
	const grid = newGrid<"." | "#">({
		width: maxX + 1,
		height: maxY + 1,
		defaultValue: () => ".",
	});
	const BYTES = 1024;
	for (const cell of coordinates
		.slice(0, BYTES)
		.map(([x, y]) => grid.getCell([x, y]))
		.filter((cell) => cell !== undefined)) {
		grid.setValue(cell, "#");
	}
	const start = grid.getCell([0, 0]);
	if (start === undefined) {
		throw new Error("Invalid grid");
	}
	const { path } = pathFind(
		grid,
		start,
		(cell) =>
			cell.getDirection(Right) === undefined &&
			cell.getDirection(Down) === undefined,
		(path) =>
			path[path.length - 1] !== undefined &&
			path[path.length - 1]?.value !== "#",
	);
	if (path === undefined) {
		throw new Error("No path found");
	}
	return path.length - 1;
};

export const star2 = async () => {
	const coordinates = await parse();
	let max = coordinates.length;
	let min = 0;
	let path = undefined;
	while (min + 1 < max) {
		const middle = Math.floor((max + min) / 2);
		const maxX = Math.max(...coordinates.map(([x]) => x));
		const maxY = Math.max(...coordinates.map(([_, y]) => y));
		const grid = newGrid<"." | "#">({
			width: maxX + 1,
			height: maxY + 1,
			defaultValue: () => ".",
		});
		const start = grid.getCell([0, 0]);
		if (start === undefined) {
			throw new Error("Invalid grid");
		}

		for (const cell of coordinates
			.slice(0, middle)
			.map(([x, y]) => grid.getCell([x, y]))
			.filter((cell) => cell !== undefined)) {
			grid.setValue(cell, "#");
		}
		const { path: newPath } = pathFind(
			grid,
			start,
			(cell) =>
				cell.getDirection(Right) === undefined &&
				cell.getDirection(Down) === undefined,
			(path) =>
				path[path.length - 1] !== undefined &&
				path[path.length - 1]?.value !== "#",
		);
		if (newPath) {
			min = middle;
			path = newPath;
		} else {
			max = middle;
		}
	}
	return coordinates[min]?.join(",");
};
