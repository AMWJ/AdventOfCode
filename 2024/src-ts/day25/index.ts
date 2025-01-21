import { readLines } from "../utils/file";
import { zip } from "../utils/general";
import { type Grid, newGrid } from "../utils/grid";

type Char = "#" | ".";
export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const grids: Grid<Char>[] = [];

	for (let i = 0; lines[i * 8] !== undefined; i++) {
		grids.push(
			newGrid<Char>({
				values: lines.slice(i * 8, i * 8 + 7).map((l) => l.split("") as Char[]),
			}),
		);
	}
	return grids.map((grid) => {
		const firstRow = grid.rows()[0];
		if (firstRow === undefined) {
			throw new Error("Empty key/lock");
		}
		return {
			type: firstRow.every(({ value }) => value === "#") ? "key" : "lock",
			order: grid
				.columns()
				.map(
					(column) => column.filter(({ value }) => value === "#").length - 1,
				),
		};
	});
};

export const star1 = async () => {
	const collection = await parse();
	const keys = collection
		.filter(({ type }) => type === "key")
		.map(({ order }) => order);
	const locks = collection
		.filter(({ type }) => type === "lock")
		.map(({ order }) => order);
	let count = 0;
	for (const lock of locks) {
		for (const key of keys) {
			if (zip(key, lock).every(([keyPin, lockPin]) => keyPin + lockPin <= 5)) {
				count++;
			}
		}
	}
	return count;
};

export const star2 = async () => {
	await parse();
	return undefined;
};
