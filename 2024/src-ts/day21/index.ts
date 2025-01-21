import { readLines } from "../utils/file";
import {
	charToDirection,
	type DirectionChar,
	directionChars,
	type Grid,
	manhattanDistance,
	newGrid,
} from "../utils/grid";
import { sum } from "../utils/math";

export const parse = async () => {
	return await readLines(`${__dirname}/input.txt`);
};

const keyPad = newGrid<string | undefined>({
	values: [
		["7", "8", "9"],
		["4", "5", "6"],
		["1", "2", "3"],
		[undefined, "0", "A"],
	],
});
const arrowPad = newGrid<DirectionChar | "A" | undefined>({
	values: [
		[undefined, "^", "A"],
		["<", "v", ">"],
	],
});

const inputs = <T>(output: string, grid: Grid<T | "A">) => {
	let input = "";
	const A = grid.get("A");
	if (A === undefined) {
		throw new Error("A not found");
	}
	let coordinates = A;
	for (const char of output) {
		const destination = grid.get(char as T);
		if (!destination) {
			grid.print();
			throw new Error(`Destination not found, ${char}`);
		}
		const arrowA = arrowPad.get("A");
		if (arrowA === undefined) {
			throw new Error("Arrow A not found");
		}

		const needed = directionChars
			.map((direction) => {
				const directionButton = arrowPad.get(direction);
				if (directionButton === undefined) {
					grid.print();
					throw new Error(`Direction button ${direction} not found`);
				}
				const manhattan = manhattanDistance(arrowA, directionButton);

				return {
					direction,
					need:
						charToDirection(direction)[0] === 0
							? charToDirection(direction)[1] *
									(destination.y - coordinates.y) >
								0
								? Math.abs(destination.y - coordinates.y)
								: 0
							: charToDirection(direction)[0] *
										(destination.x - coordinates.x) >
									0
								? Math.abs(destination.x - coordinates.x)
								: 0,
					manhattan,
				};
			})
			.filter(({ need }) => need !== 0);
		const reachable = Object.fromEntries(
			needed.map(({ direction, need }) => [
				direction,
				grid.getDirection(coordinates, charToDirection(direction), need)
					?.value !== undefined,
			]),
		);
		needed.sort((a, b) => {
			if (!reachable[a.direction] && reachable[b.direction]) {
				return 1;
			}
			if (reachable[a.direction] && !reachable[b.direction]) {
				return -1;
			}
			return b.manhattan - a.manhattan;
		});
		for (const { direction, need } of needed) {
			input += direction.repeat(need);
		}
		input += "A";
		coordinates = destination;
	}
	return input;
};

export const star1 = async () => {
	const lines = await parse();
	return sum(
		lines.map((line) => {
			let input = inputs(line, keyPad);
			for (let i = 0; i < 2; i++) {
				input = inputs(input, arrowPad);
			}
			return input.length * Number.parseInt(line.slice(0, -1));
		}),
	);
};

const isDirectionChar = (char: string): char is DirectionChar => {
	return directionChars.includes(char as DirectionChar);
};

const countInputs = <T>(
	output: { [key: string]: number },
	grid: Grid<T | "A">,
) => {
	const A = grid.get("A");
	if (A === undefined) {
		throw new Error("coordinate is undefined");
	}
	const newInputs: { [key: string]: number } = {};
	for (const [outputInstance, count] of Object.entries(output)) {
		const inputsInstance = inputs(outputInstance, grid);
		let coordinate = A;
		let lastSplit = 0;
		for (const [i, char] of [...inputsInstance].entries()) {
			if (!isDirectionChar(char)) {
				continue;
			}
			if (coordinate.value === "A" && lastSplit !== i) {
				const index = inputsInstance.slice(lastSplit, i);
				newInputs[index] = newInputs[index] || 0;
				newInputs[index] += count;
				lastSplit = i;
			}
			const nextCoordinate = coordinate.getDirection(charToDirection(char));
			if (nextCoordinate === undefined) {
				throw new Error("Unexpected out of bounds");
			}
			coordinate = nextCoordinate;
		}
		if (lastSplit < inputsInstance.length) {
			const index = inputsInstance.slice(lastSplit);
			newInputs[index] = newInputs[index] || 0;
			newInputs[index] += count;
		}
	}
	return newInputs;
};

export const star2 = async () => {
	const lines = await parse();
	return sum(
		lines.map((line) => {
			const input = inputs(line, keyPad);
			let inputCount = { [input]: 1 };
			for (let i = 0; i < 25; i++) {
				inputCount = countInputs(inputCount, arrowPad);
			}
			return (
				sum(Object.entries(inputCount).map(([k, v]) => k.length * v)) *
				Number.parseInt(line.slice(0, -1))
			);
		}),
	);
};
