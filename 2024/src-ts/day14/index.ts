import { readLines } from "../utils/file";
import {
	type Distance,
	type Grid,
	type Location,
	newGrid,
} from "../utils/grid";
import { product } from "../utils/math";

const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	return lines
		.map(
			(line) =>
				line.split(" ").map(
					(word) =>
						word
							.split("=")[1]
							?.split(",")
							.map((n) => Number.parseInt(n)) ?? [0, 0],
				) as [Location, Distance],
		)
		.map(([position, velocity]) => ({
			position,
			velocity,
		}));
};

export const star1 = async () => {
	const robots = await parse();
	const N = 100;
	const maxX = 101;
	const maxY = 103;
	const newPositions = robots.map(
		({ position: [px, py], velocity: [vx, vy] }) => {
			const change = [(px + N * vx) % maxX, (py + N * vy) % maxY] as Location;
			return [
				change[0] + (change[0] < 0 ? maxX : 0),
				change[1] + (change[1] < 0 ? maxY : 0),
			] as [number, number];
		},
	);

	const quadrants = [0, 0, 0, 0] as [number, number, number, number];
	for (const position of newPositions) {
		if (position[0] === (maxX - 1) / 2 || position[1] === (maxY - 1) / 2) {
			continue;
		}
		const quadrant =
			(position[1] > maxY / 2 ? 0 : 2) + (position[0] > maxX / 2 ? 0 : 1);
		if (quadrants[quadrant] !== undefined) {
			quadrants[quadrant]++;
		}
	}
	return product(quadrants);
};

export const star2 = async () => {
	let robots = await parse();
	const maxX = 101;
	const maxY = 103;
	let iteration = 0;
	const picture: Grid<"*" | " ", "visited"> = newGrid<"*" | " ", "visited">({
		width: maxX,
		height: maxY,
		defaultValue: () => " ",
	});
	while (true) {
		iteration++;
		picture.deleteTag("visited");
		robots = robots.map(({ position: [px, py], velocity: [vx, vy] }) => {
			const change = [(px + vx) % maxX, (py + vy) % maxY] as Location;
			return {
				position: [
					change[0] + (change[0] < 0 ? maxX : 0),
					change[1] + (change[1] < 0 ? maxY : 0),
				] as [number, number],
				velocity: [vx, vy] as [number, number],
			};
		});

		for (const { position } of robots) {
			const cell = picture.getCell(position);
			if (cell === undefined) {
				continue;
			}
			if (picture.hasTag(cell, "visited")) {
				break;
			}
			picture.tagCell(cell, "visited");
			cell.value = "*";
		}
		if (picture.findAllTagged("visited").length === robots.length) {
			return iteration;
		}
	}
};
