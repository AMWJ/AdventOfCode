import { readFile } from "node:fs/promises";
import { type Grid, newGrid } from "./grid";

export const readLinesOfNumbers = async (
	path: string,
	separator: RegExp | string = /\s+/,
): Promise<number[][]> => {
	const lines = await readLines(path);
	return lines.map((line) =>
		line
			.split(separator)
			.filter((v) => v.length > 0)
			.map(Number),
	);
};

export const readGridOfNumbers = async (
	path: string,
	separator: RegExp | string = /\s+/,
): Promise<Grid<number>> =>
	(await readGrid(path, separator)).map(({ value }) => {
		return Number(value);
	});

export const readGrid = async (
	path: string,
	separator: RegExp | string = /\s+/,
): Promise<Grid<string>> =>
	newGrid<string>({
		values: (await readLines(path)).map((line) =>
			line.split(separator).filter((v: string) => v.length > 0),
		),
	});

export const readLines = async (
	path: string,
	separator: RegExp | string = /\r?\n/,
): Promise<string[]> => {
	const file = await readFile(path, "utf-8");
	return file.split(separator);
};
