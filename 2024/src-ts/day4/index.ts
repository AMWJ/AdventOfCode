import { readLines } from "../utils/file";
import { Directions, newGrid, rotateLeft, rotateRight } from "../utils/grid";

const ValidChar = ["M", "A", "S", "X"] as const;
type Char = (typeof ValidChar)[number];

const validateChar = (c: string): c is Char => {
	return ValidChar.includes(c as Char);
};

const parse = async () => {
	return newGrid<Char>({
		values: (await readLines(`${__dirname}/input.txt`)).map((line) =>
			line.split("").filter(validateChar),
		),
	});
};

export const star1 = async () => {
	const grid = await parse();
	return grid.getAll("X").flatMap((xCell) => {
		const x = Directions.All.filter((direction) => {
			const M = xCell.getDirection(direction);
			const A = M?.getDirection(direction);
			const S = A?.getDirection(direction);
			return M?.value === "M" && A?.value === "A" && S?.value === "S";
		});
		return x;
	}).length;
};

export const star2 = async () => {
	const grid = await parse();
	return grid.getAll("M").flatMap((mCell) =>
		Directions.Diagonal.filter((direction) => {
			const mutableDirection = [direction[0], direction[1]];
			const A = mCell.getDirection(direction);
			const S = A?.getDirection(direction);
			const firstCorner = A?.getDirection(rotateLeft(direction));
			const secondCorner = A?.getDirection(rotateRight(direction));
			return (
				A?.value === "A" &&
				S?.value === "S" &&
				firstCorner?.value === "M" &&
				secondCorner?.value === "S"
			);
		}),
	).length;
};
