import { readFile } from "node:fs/promises";

export const readLineOfNumbers = async (path: string): Promise<number[][]> => {
	const file = await readFile(path, "utf-8");
	const lines = file.split("\n");
	return lines.map((line) =>
		line
			.split(/\s+/)
			.filter((v) => v.length > 0)
			.map(Number),
	);
};

export const readLines = async (path: string): Promise<string[]> => {
	const file = await readFile(path, "utf-8");
	return file.split(/\r?\n/);
};
