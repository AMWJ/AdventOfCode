import { readLines } from "../utils/file";
import {
	type CardinalDirection,
	type Cell,
	type DirectionChar,
	directionChars,
	directionToChar,
	type Grid,
	newGrid,
	Right,
	charToDirection,
	reverse,
} from "../utils/grid";
import { pathFind } from "../utils/pathFinding";

const ValidChar = [".", "#", "S", "E"] as const;
type Char = (typeof ValidChar)[number];

const validateChar = (c: string): c is Char => {
	return ValidChar.includes(c as Char);
};

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const grid = newGrid<Char>({
		values: lines.map((line) => line.split("").filter(validateChar)),
	});
	return grid;
};

const trajectory = <T, TagT extends string = string>(
	from: Cell<T, TagT>,
	to: Cell<T, TagT>,
) => {
	const direction = [to.x - from.x, to.y - from.y] as CardinalDirection;
	if (Math.abs(direction[0]) > 1 || Math.abs(direction[1]) > 1) {
		throw new Error("Invalid trajectory");
	}
	return directionToChar(direction);
};

export const star1 = async () => {
	const grid: Grid<Char> = await parse();
	const S = grid.get("S");
	if (S === undefined) {
		throw new Error("No start point");
	}
	const { path, cost } = await pathFind(
		grid,
		S,
		(cell) => cell.value === "E",
		(path) =>
			path?.[path.length - 1] !== undefined &&
			path[path.length - 1]?.value !== "#",
		{
			cost: ({ path, previousCost }) => {
				const last = path[path.length - 1];
				const previous = path[path.length - 2];
				const previousPrevious = path[path.length - 3];
				if (last === undefined) {
					throw new Error("Path empty");
				}
				if (previous === undefined) {
					return previousCost + 1;
				}
				return (
					previousCost +
					1 +
					(trajectory(previous, last) !==
					(previousPrevious !== undefined
						? trajectory(previousPrevious, previous)
						: Right)
						? 1000
						: 0)
				);
			},
		},
	);
	return cost;
};

type Node = { location: Cell<Char>; direction: CardinalDirection };

export const star2 = async () => {
	const grid: Grid<Char> = await parse();
	const S = grid.get("S");
	const E = grid.get("E");
	if (S === undefined) {
		throw new Error("No start point");
	}
	if (E === undefined) {
		throw new Error("No end point");
	}
	const { memos } = await pathFind<
		Char,
		Record<DirectionChar, { paths: Cell<Char>[][]; cost: number } | undefined>
	>(
		grid,
		S,
		(cell) => cell.value === "E",
		(path) => path?.[path.length - 1]?.value !== "#",
		{
			cost: ({ path, previousCost }) => {
				const last = path[path.length - 1];
				const previous = path[path.length - 2];
				const previousPrevious = path[path.length - 3];
				if (last === undefined) {
					throw new Error("Path empty");
				}
				if (previous === undefined) {
					return previousCost + 1;
				}
				return (
					previousCost +
					1 +
					(trajectory(previous, last) !==
					(previousPrevious !== undefined
						? trajectory(previousPrevious, previous)
						: Right)
						? 1000
						: 0)
				);
			},
			initializeMemos: (cell) => ({
				"<": undefined,
				">": undefined,
				v: undefined,
				"^": undefined,
			}),
			checkVisited: (cell, { path, cost, memo, setMemo, minCostFound }) => {
				if (minCostFound !== undefined && cost > minCostFound) {
					return true;
				}
				const previousCell = path[path.length - 2];
				if (previousCell === undefined) {
					return false;
				}
				const direction = trajectory(previousCell, cell);
				const pathCell = memo;
				memo ??= {
					"<": undefined,
					">": undefined,
					v: undefined,
					"^": undefined,
				};
				memo[direction] = memo[direction] ?? { paths: [], cost: 0 };
				const { cost: priorCost, paths: priorPaths } = memo[direction];
				if (priorPaths.length === 0 || cost < priorCost) {
					memo[direction] = { paths: [path], cost };
					setMemo(memo);
					return false;
				}
				if (cost === priorCost) {
					memo[direction] = {
						paths: [...priorPaths, path],
						cost,
					};
					setMemo(memo);
					return true;
				}
				return true;
			},
		},
	);
	const seen = grid.mapWithoutTags<Set<DirectionChar>, "critical">(
		({ value }) =>
			value === "S"
				? new Set<DirectionChar>(directionChars)
				: new Set<DirectionChar>(),
	);
	const seenStart = seen.getCell(S.location);
	const memosEnd = memos.getCell(E.location);
	if (seenStart === undefined) {
		throw new Error("No start point");
	}
	if (memosEnd === undefined) {
		throw new Error("No end point");
	}
	seen.tagCell(seenStart, "critical");
	// Walk the critical path backwards
	const queue: { cell: typeof memosEnd; direction?: DirectionChar }[] = [
		{
			cell: memosEnd,
			direction: undefined,
		},
	];
	while (true) {
		const step = queue.pop();
		if (step === undefined) {
			break;
		}
		const { cell, direction } = step;
		if (cell.value === undefined) {
			continue;
		}
		const seenCell = seen.getCell(cell.location);
		if (seenCell === undefined) {
			throw new Error("Unable to get seen cell");
		}
		if (direction && seenCell.value.has(direction)) {
			continue;
		}
		if (direction) {
			seenCell.value.add(direction);
		} else {
			directionChars.map((direction) => {
				seenCell.value.add(direction);
			});
		}
		seen.tagCell(seenCell, "critical");
		const costs = Object.entries(cell.value)
			.filter(
				([, directions]) =>
					directions !== undefined && directions.paths.length > 0,
			)
			.map<[DirectionChar, number]>(([incomingDirection, directions]) => [
				incomingDirection as DirectionChar,
				(directions?.cost ?? 0) +
					(direction === undefined || incomingDirection === direction
						? 0
						: 1000),
			]);
		const minCost = Math.min(...costs.map(([, cost]) => cost));
		for (const incomingDirection of costs
			.filter(([, cost]) => cost === minCost)
			.map(([direction]) => direction)) {
			const backtrack = cell.getDirection(
				reverse(charToDirection(incomingDirection)),
			);
			if (backtrack === undefined) {
				throw new Error("No backtrack");
			}
			queue.push({
				cell: backtrack,
				direction: incomingDirection,
			});
		}
	}
	return seen.findAllTagged("critical").map((cell) => cell.location).length;
};
