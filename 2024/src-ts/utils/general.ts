import { newGrid } from "./grid";

export const zip = <T, U>(first: T[], second: U[]): [T, U][] => {
	if (first.length !== second.length) {
		throw new Error("Arrays must have the same length to be zipped");
	}
	return first.map((value, i) => {
		return [value, second[i]] as [T, U];
	});
};

export const adjacencies = <T>(array: T[]): [T, T][] => {
	return zip(array.slice(0, -1), array.slice(1));
};

export const pairs = <T>(array: T[]): (readonly [T, T])[] => {
	return array.flatMap((value, i) =>
		array.slice(i + 1).map((next) => [value, next] as const),
	);
};
