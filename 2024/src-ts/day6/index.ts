import { readGrid } from "../utils/file";
import {
	type Cell,
	type DirectionChar,
	directionToChar,
	type Grid,
	rotateRight,
	Up,
} from "../utils/grid";

type Char = "." | "#" | "^";

export const parse = async () => {
	const grid = (await readGrid(`${__dirname}/input.txt`, "")).mapWithoutTags<
		Char,
		string
	>(({ value }) => (value === "^" ? "^" : value === "#" ? "#" : "."));
	return grid;
};

export const followPath = (
	grid: Grid<Char, DirectionChar | "visited">,
	start: Cell<Char, DirectionChar | "visited">,
) => {
	let location = start;
	let direction = Up;
	while (true) {
		if (grid.hasTag(location, directionToChar(direction))) {
			return false;
		}
		grid.tagCell(location, directionToChar(direction));
		grid.tagCell(location, "visited");
		const next = grid.getDirection(location, direction);
		if (next === undefined) {
			return true;
		}
		if (next.value === "#") {
			direction = rotateRight(direction);
		} else {
			location = next;
		}
	}
};

export const star1 = async () => {
	const grid = await parse();
	const start = grid.get("^");
	if (start === undefined) {
		throw new Error("No start found");
	}
	let location = start;
	let direction = Up;
	while (true) {
		grid.tagCell(location, "visited");
		const next = grid.getDirection(location, direction);
		if (next === undefined) {
			break;
		}
		if (next.value === "#") {
			direction = rotateRight(direction);
		} else {
			location = next;
		}
	}
	return grid.findAllTagged("visited").length;
};

// TODO: Make smarter. Mostly wrote this just to get the answer, and optimize from there.
export const star2 = async () => {
	const grid = (await parse()).mapWithoutTags<Char, DirectionChar | "visited">(
		({ value }) => value,
	);
	const start = grid.get("^");
	if (start === undefined) {
		throw new Error("No start found");
	}
	const completes = followPath(grid, start);
	if (!completes) {
		throw new Error("Path did not complete");
	}
	const onPath = grid.findAllTagged("visited");
	const cycles = onPath.filter((cell) => {
		grid.deleteTag("<");
		grid.deleteTag(">");
		grid.deleteTag("^");
		grid.deleteTag("v");
		grid.deleteTag("visited");
		grid.setValue(cell, "#");
		const result = followPath(grid, start);
		grid.setValue(cell, ".");
		grid.deleteTag("<");
		grid.deleteTag(">");
		grid.deleteTag("^");
		grid.deleteTag("v");
		grid.deleteTag("visited");
		return !result;
	});
	return cycles.length;
};
