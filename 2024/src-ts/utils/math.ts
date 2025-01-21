import type { Grid, Location } from "./grid";

export const sum = (numbers: number[]): number =>
	numbers.reduce((acc, n) => acc + n, 0);

export const product = (numbers: number[]): number =>
	numbers.reduce((acc, n) => acc * n, 1);

export const determinant = (
	matrix: Grid<number>,
	alreadyPicked: Location[] = [],
): number => {
	const xsPicked = alreadyPicked.map(([x]) => x);
	const ysPicked = alreadyPicked.map(([, y]) => y);
	const j = matrix.rows().findIndex((_, j) => !ysPicked.includes(j));
	const first = matrix.rows()[j];
	if (!first || alreadyPicked.length === matrix.width) {
		return 1;
	}
	return sum(
		first
			.map(({ value }, i) => ({ value, i }))
			.filter((_, i) => !xsPicked.includes(i))
			.map(({ value, i }, index) => {
				const det = determinant(matrix, [...alreadyPicked, [i, j]]);
				const x = value * det * (index % 2 === 0 ? 1 : -1);
				return x;
			}),
	);
};
