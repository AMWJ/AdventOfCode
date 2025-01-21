import { readLines } from "../utils/file";

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
};

export const star1 = async () => {
	await parse();
};

export const star2 = async () => {
	await parse();
};
