import { readLines } from "../utils/file";
import {
	Down,
	DownLeft,
	DownRight,
	Left,
	manhattanDistance,
	newGrid,
	Right,
} from "../utils/grid";

const ValidChar = [".", "#", "S", "E"] as const;
type Char = (typeof ValidChar)[number];

const validateChar = (c: string): c is Char => {
	return ValidChar.includes(c as Char);
};

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const grid = newGrid<Char, "path" | "cutThrough">({
		values: lines.map((line) => line.split("").filter(validateChar)),
	});
	return grid;
};

export const star1 = async () => {
	const grid = await parse();
	const pathGrid = grid.map<{ value: Char; pathIndex: number | undefined }>(
		({ value }) => ({
			value,
			pathIndex: undefined,
		}),
	);
	const S = pathGrid.find(({ value }) => value === "S");
	const cheatThreshold = 100;
	let current = S;
	let previous: typeof current | undefined = undefined;
	for (let i = 0; current !== undefined; i++) {
		const pathCell = pathGrid.getCell(current.location);
		if (pathCell === undefined) {
			throw new Error("Cannot find path cell.");
		}
		pathCell.value.pathIndex = i;
		pathGrid.tagCell(current, "path");
		const neighbors = pathGrid
			.neighbors(current)
			.filter((n) => n.value.value !== "#" && n !== previous);
		previous = current;
		current = neighbors[0];
	}
	if (previous?.value.value !== "E") {
		throw new Error("Path did not reach the end");
	}
	for (const pathCell of pathGrid.findAllTagged("path")) {
		const pathIndex = pathCell.value.pathIndex;
		if (pathIndex === undefined) {
			throw new Error("Path index is undefined");
		}
		for (const neighbor of pathGrid
			.neighbors(pathCell)
			.filter(({ value }) => value.value === "#")) {
			const cutThroughs = pathGrid
				.neighbors(neighbor)
				.filter(
					(cutThrough) =>
						cutThrough.value !== undefined &&
						(cutThrough.value.pathIndex ?? 0) - pathIndex >= cheatThreshold + 2,
				);
			if (cutThroughs.length > 0) {
				pathGrid.tagCell(neighbor, "cutThrough");
			}
		}
	}
	return pathGrid.findAllTagged("cutThrough").length;
};

export const star2 = async () => {
	const grid = await parse();
	const pathGrid = grid.map<{ char: Char; pathIndex: number | undefined }>(
		({ value }) => ({
			char: value,
			pathIndex: undefined,
		}),
	);
	const S = pathGrid.find(({ char: value }) => value === "S");
	const cheatThreshold = 100;
	const maxCheatLength = 20;
	let current = S;
	let previous: typeof current | undefined = undefined;
	for (let i = 0; current !== undefined; i++) {
		const pathCell = pathGrid.getCell(current.location);
		if (pathCell === undefined) {
			throw new Error("Cannot find path cell.");
		}
		pathCell.value.pathIndex = i;
		pathGrid.tagCell(current, "path");
		const neighbors = pathGrid
			.neighbors(current)
			.filter((n) => n.value.char !== "#" && n !== previous);
		previous = current;
		current = neighbors[0];
	}
	let answer = 0;
	const partitionGrid = pathGrid.partition({ length: maxCheatLength });
	for (const partitionCell of partitionGrid.findAll()) {
		const pathCellsAroundMe = [
			partitionCell,
			...partitionGrid.neighbors(partitionCell, [
				Right,
				Left,
				Down,
				DownLeft,
				DownRight,
			]),
		].flatMap((gridCell) =>
			gridCell.value.findAllTagged("path").map(({ value }) => value),
		);

		const innerGrid = partitionCell.value;
		for (const pathCell1 of innerGrid
			.findAllTagged("path")
			.map((pathCell) => pathCell.value)) {
			for (const pathCell2 of pathCellsAroundMe) {
				if (pathCell1 === pathCell2) {
					continue;
				}
				const pathIndex1 = pathCell1.value.pathIndex;
				const pathIndex2 = pathCell2.value.pathIndex;
				if (pathIndex1 === undefined || pathIndex2 === undefined) {
					throw new Error("Path index is undefined");
				}
				if (
					pathCell1.location[1] > pathCell2.location[1] ||
					(pathCell1.location[1] === pathCell2.location[1] &&
						pathCell1.location[0] >= pathCell2.location[0])
				) {
					continue;
				}
				if (
					manhattanDistance(pathCell1, pathCell2) <= maxCheatLength &&
					Math.abs(pathIndex1 - pathIndex2) -
						manhattanDistance(pathCell1, pathCell2) >=
						cheatThreshold
				) {
					answer++;
				}
			}
		}
	}
	return answer;
};
