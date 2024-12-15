export const sum = (numbers: number[]): number =>
	numbers.reduce((acc, n) => acc + n, 0);

export const product = (numbers: number[]): number =>
	numbers.reduce((acc, n) => acc * n, 1);
