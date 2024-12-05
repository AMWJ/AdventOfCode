import { readLines } from "../utils/file";

const directions = [
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
	[0, -1],
	[1, -1],
];

const diagonalDirections = [
	[1, 1],
	[-1, 1],
	[-1, -1],
	[1, -1],
];

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const xs = [];
	lines.map((line, j) => {
		let index = line.indexOf("X");
		while (index !== -1) {
			xs.push([index, j]);
			index = line.indexOf("X", index + 1);
		}
	});
	return xs.flatMap(([i, j]) => {
		const x = directions.filter(([di, dj]) => {
			const M = lines[j + dj]?.[i + di];
			const A = lines[j + 2 * dj]?.[i + 2 * di];
			const S = lines[j + 3 * dj]?.[i + 3 * di];
			return M === "M" && A === "A" && S === "S";
		});
		return x;
	}).length;
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const xs = [];
	lines.map((line, j) => {
		let index = line.indexOf("M");
		while (index !== -1) {
			xs.push([index, j]);
			index = line.indexOf("M", index + 1);
		}
	});
	return xs.flatMap(([i, j]) =>
		diagonalDirections.filter(([di, dj]) => {
			const A = lines[j + dj]?.[i + di];
			const S = lines[j + 2 * dj]?.[i + 2 * di];
			const firstCorner = lines[j + dj - di]?.[i + di + dj];
			const secondCorner = lines[j + dj + di]?.[i + di - dj];
			return (
				A === "A" && S === "S" && firstCorner === "M" && secondCorner === "S"
			);
		}),
	).length;
};
