import { readLines } from "../utils/file";
import { product } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const robots = lines
		.map((line) =>
			line.split(" ").map((word) =>
				word
					.split("=")[1]
					.split(",")
					.map((n) => Number.parseInt(n)),
			),
		)
		.map(([[x, y], [vx, vy]]) => ({ position: [x, y], velocity: [vx, vy] }));
	const N = 100;
	const maxX = 101;
	const maxY = 103;
	const newPositions = robots.map(
		({ position: [px, py], velocity: [vx, vy] }) => {
			const change = [(px + N * vx) % maxX, (py + N * vy) % maxY];
			return [
				change[0] + (change[0] < 0 ? maxX : 0),
				change[1] + (change[1] < 0 ? maxY : 0),
			] as [number, number];
		},
	);

	const quadrants = [0, 0, 0, 0];
	for (const position of newPositions) {
		if (position[0] === (maxX - 1) / 2 || position[1] === (maxY - 1) / 2) {
			continue;
		}
		quadrants[
			(position[1] > maxY / 2 ? 0 : 2) + (position[0] > maxX / 2 ? 0 : 1)
		]++;
	}
	return product(quadrants);
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	let robots = lines
		.map((line) =>
			line.split(" ").map((word) =>
				word
					.split("=")[1]
					.split(",")
					.map((n) => Number.parseInt(n)),
			),
		)
		.map(([[x, y], [vx, vy]]) => ({ position: [x, y], velocity: [vx, vy] }));
	const maxX = 101;
	const maxY = 103;
	let iteration = 0;
	while (true) {
		iteration++;
		robots = robots.map(({ position: [px, py], velocity: [vx, vy] }) => {
			const change = [(px + vx) % maxX, (py + vy) % maxY];
			return {
				position: [
					change[0] + (change[0] < 0 ? maxX : 0),
					change[1] + (change[1] < 0 ? maxY : 0),
				] as [number, number],
				velocity: [vx, vy] as [number, number],
			};
		});

		const string = new Array(maxX).fill(0);
		const picture: number[][] = new Array(maxY).fill(0).map(() => [...string]);
		for (const { position } of robots) {
			const currentValue = picture[position[1]][position[0]];
			picture[position[1]][position[0]] = currentValue + 1;
		}
		if (picture.every((p) => p.every((i) => i <= 1))) {
			return iteration;
		}
	}
};
