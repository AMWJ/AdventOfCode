import { BTree } from "./dataStructures/bTree";
import type { Heap } from "./dataStructures/heap";
import type { Cell, Grid } from "./grid";

export const pathFind = <T, Memo = undefined>(
	grid: Grid<T>,
	start: Cell<T>,
	isDone: (cell: Cell<T>, path: Cell<T>[], memo: Memo | undefined) => boolean,
	validation?: (path: Cell<T>[]) => boolean,
	augmentations?: {
		cost?: (values: {
			path: Cell<T>[];
			previousCost: number;
		}) => number;
		initializeMemos?: (cell: Cell<T>) => Memo;
		checkVisited?: (
			cell: Cell<T>,
			values: {
				path: Cell<T>[];
				memo: Memo | undefined;
				setMemo: (memo: Memo) => void;
				cost: number;
				minCostFound: number | undefined;
			},
		) => boolean | undefined;
	},
) => {
	let minPathFound: Cell<T>[] | undefined = undefined;
	let minCostFound = Number.POSITIVE_INFINITY;
	const memos = grid.map((cell) => augmentations?.initializeMemos?.(cell));
	const heap: Heap<{ path: Cell<T>[]; cost: number }> = BTree(
		[{ path: [start], cost: 0 }],
		({ cost: costA }, { cost: costB }) => costA > costB,
	);
	while (true) {
		const min = heap.popMin();
		if (min === undefined) {
			break;
		}
		const { path, cost } = min;
		const cell = path[path.length - 1];
		if (!cell) {
			throw new Error("Path is empty");
		}
		const visitedCell = memos.getCell(cell.location);
		if (visitedCell === undefined) {
			throw new Error("Unable to get visited cell");
		}
		if (
			augmentations?.checkVisited?.(cell, {
				path,
				memo: visitedCell.value,
				setMemo: (memo) => memos.setValue(memos.getCell(cell.location), memo),
				cost,
				minCostFound,
			}) ??
			(memos.hasTag(visitedCell, "visited") ||
				(minCostFound && cost > minCostFound))
		) {
			continue;
		}

		memos.tagCell(visitedCell, "visited");
		if (isDone(cell, path, visitedCell.value)) {
			if (minPathFound === undefined || minCostFound > cost) {
				minPathFound = path;
				minCostFound = cost;
			}
			continue;
		}
		for (const neighbor of grid.neighbors(cell)) {
			if (!neighbor) {
				throw new Error("Neighbor is undefined");
			}
			const newPath = [...path, neighbor];
			if (validation && !validation(newPath)) {
				continue;
			}
			const newCost = augmentations?.cost
				? augmentations.cost({ path: newPath, previousCost: cost })
				: cost + 1;
			heap.insert({ path: newPath, cost: newCost });
		}
	}
	return { path: minPathFound, cost: minCostFound, memos };
};

export const partitionFind = <T, U extends string>(
	grid: Grid<T, U>,
	augmentations?: {
		checkTag: (cell: Cell<T, U>) => string;
	},
): Grid<Cell<T, U>> => {
	const counters: { [key: string]: number } = {};
	const checkTag =
		augmentations?.checkTag !== undefined
			? (a: Cell<T, U>, b: Cell<T, U>) =>
					augmentations.checkTag(a) === augmentations.checkTag(b)
			: (a: Cell<T, U>, b: Cell<T, U>) => a.value === b.value;
	const tag =
		augmentations?.checkTag !== undefined
			? augmentations.checkTag
			: (cell: Cell<T, U>) => JSON.stringify(cell.value);
	const visitedGrid = grid.mapWithoutTags<Cell<T, U>, string>((cell) => cell);
	const origin = visitedGrid.getCell([0, 0]);
	if (!origin) {
		return visitedGrid;
	}
	const outerQueue = [origin];
	while (true) {
		const start = outerQueue.shift();
		if (start === undefined) {
			break;
		}
		if (start.tags.size > 0) {
			continue;
		}
		const innerQueue = [start];
		const partitionTag = tag(start.value);
		const key = `${partitionTag}${counters[partitionTag] ?? ""}`;
		counters[partitionTag] =
			partitionTag in counters ? (counters[partitionTag] ?? 0) + 1 : 0;

		while (true) {
			const cell = innerQueue.shift();
			if (cell === undefined) {
				break;
			}
			if (cell.tags.size > 0) {
				continue;
			}
			visitedGrid.tagCell(cell, key);

			const neighbors = visitedGrid.neighbors(cell);
			for (const neighbor of neighbors) {
				if (neighbor.tags.size > 0) {
					continue;
				}
				if (checkTag(cell.value, neighbor.value)) {
					innerQueue.push(neighbor);
				} else {
					outerQueue.push(neighbor);
				}
			}
		}
	}
	return visitedGrid;
};
