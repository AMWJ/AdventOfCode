export type Cell<T, TagT extends string = string> = {
	location: Location;
	x: number;
	y: number;
	tags: Set<TagT>;
	hasTag: (tag: TagT) => boolean;
	removeTag: (tag: TagT) => void;
	addTag: (tag: TagT) => void;
	getDirection: (
		direction: Distance,
		distance?: number,
	) => Cell<T, TagT> | undefined;
	grid: Grid<T, TagT>;
	value: T;
};

export const manhattanDistance = <T, TagT extends string = string>(
	a: Cell<T, TagT>,
	b: Cell<T, TagT>,
) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const distance = <T, TagT extends string = string>(
	a: Cell<T, TagT>,
	b: Cell<T, TagT>,
): Distance => [a.x - b.x, a.y - b.y] as const;

export type Grid<T, TagT extends string = string> = {
	width: number;
	height: number;
	getCell: (location: Location) => Cell<T, TagT> | undefined;
	neighbors: (cell: Cell<T, TagT>, directions?: Direction[]) => Cell<T, TagT>[];
	rows: () => Cell<T, TagT>[][];
	columns: () => Cell<T, TagT>[][];
	firstRow: () => Cell<T, TagT>[];
	lastRow: () => Cell<T, TagT>[];
	firstColumn: () => Cell<T, TagT>[];
	lastColumn: () => Cell<T, TagT>[];
	getDirection: (
		cell: Cell<T, TagT>,
		direction: Distance,
		distance?: number,
	) => Cell<T, TagT> | undefined;
	setValue: (cell: Cell<T, TagT> | undefined, value: T) => void;
	get: (filter: T) => Cell<T, TagT> | undefined;
	find: (filter: (T: T) => boolean) => Cell<T, TagT> | undefined;
	findLast: (filter: (T: T) => boolean) => Cell<T, TagT> | undefined;
	getAll: (filter: T) => Cell<T, TagT>[];
	findAll: (filter?: (T: T) => boolean) => Cell<T, TagT>[];

	findAllTagged: (tag: TagT, direction?: CardinalDirection) => Cell<T, TagT>[];
	deleteTag: (tag: TagT) => void;
	hasTag: (cell: Cell<T, TagT>, tag: TagT) => boolean;
	tagCell: (cell: Cell<T, TagT>, tag: TagT) => void;
	tags: Map<TagT, { [row: number]: Set<number> }>;

	print: (highlighting?: {
		tag?: TagT;
		highlight: string;
		path?: Cell<T, TagT>[];
	}) => void;
	map: <U, TagU extends string = never>(
		fn: (cell: Cell<T, TagT>) => U,
	) => Grid<U, TagT | TagU>;
	mapWithoutTags: <U, TagU extends string = never>(
		fn: (cell: Cell<T, TagT>) => U,
	) => Grid<U, TagU>;
	subGrid: (options: {
		x: number;
		y: number;
		width: number;
		height: number;
	}) => Grid<Cell<T, TagT>, TagT>;
	partition: <TagU extends string = string>(options: {
		length: number;
	}) => Grid<Grid<Cell<T, TagT>, TagT>, TagU>;
};

export const Up = [0, -1] as const;
export const Down = [0, 1] as const;
export const Left = [-1, 0] as const;
export const Right = [1, 0] as const;
export const UpRight = [1, -1] as const;
export const DownRight = [1, 1] as const;
export const DownLeft = [-1, 1] as const;
export const UpLeft = [-1, -1] as const;
export const Directions = {
	All: [Up, Down, Left, Right, UpRight, UpLeft, DownLeft, DownRight],
	Cardinal: [Up, Down, Left, Right],
	Diagonal: [UpRight, DownRight, DownLeft, UpLeft],
};
export type CardinalDirection = (typeof Directions.Cardinal)[number];
export type DiagonalDirection = (typeof Directions.Diagonal)[number];
export type Direction = (typeof Directions.All)[number];
export type Location = [number, number];
export type Distance = readonly [number, number];

export const directionChars = ["<", "^", ">", "v"] as const;
export type DirectionChar = (typeof directionChars)[number];

export const isDirectionChar = (char: string): char is DirectionChar =>
	directionChars.includes(char as DirectionChar);

export const directionOfDistance = (distance: Distance): Direction => {
	if (distance[0] === 0 && distance[1] === 0) {
		throw new Error("Distance must not be zero");
	}
	return [
		distance[0] === 0 ? 0 : ((distance[0] / Math.abs(distance[0])) as 1 | -1),
		distance[1] === 0 ? 0 : ((distance[1] / Math.abs(distance[1])) as 1 | -1),
	] as Direction;
};

export const isCardinalDirection = (
	direction: Direction,
): direction is CardinalDirection => direction[0] === 0 || direction[1] === 0;

export const directionToChar = (
	direction: CardinalDirection,
): DirectionChar => {
	switch (direction[0]) {
		case 1:
			return ">";
		case -1:
			return "<";
		default:
			return direction[1] === 1 ? "v" : "^";
	}
};
export const charToDirection = (
	direction: DirectionChar,
): CardinalDirection => {
	switch (direction) {
		case ">":
			return [1, 0];
		case "<":
			return [-1, 0];
		case "v":
			return [0, 1];
		case "^":
			return [0, -1];
	}
};

export const rotateLeft = <D extends readonly [number, number]>([
	x,
	y,
]: D): D => {
	return [y, -x] as const as D;
};
export const rotateRight = <D extends readonly [number, number]>([
	x,
	y,
]: D): D => [-y, x] as const as D;
export const reverse = <D extends readonly [number, number]>([x, y]: D): D =>
	[-x, -y] as const as D;

export const newCell = <T, TagT extends string>({
	x,
	y,
	grid,
	value,
}: { x: number; y: number; grid: Grid<T, TagT>; value: T }): Cell<T, TagT> => {
	const tags = new Set<TagT>();
	const cell: Cell<T, TagT> = {
		x,
		y,
		grid,
		value,
		addTag: (tag: TagT) => tags.add(tag),
		removeTag: (tag: TagT) => tags.delete(tag),
		hasTag: (tag: TagT) => tags.has(tag),
		getDirection: (direction: Distance, distance = 1) =>
			grid.getDirection(cell, direction, distance),
		tags,
		location: [x, y] as [number, number],
	};
	return cell;
};

export const newGrid = <T, TagT extends string = string>(
	options:
		| {
				values: T[][];
		  }
		| {
				width: number;
				height: number;
				defaultValue: (i: number, j: number) => T;
		  },
): Grid<T, TagT> => {
	const cells: Cell<T, TagT>[][] = [];
	const tags: Map<TagT, { [row: number]: Set<number> }> = new Map();
	// const valueCache: Map<T, { [row: number]: Set<number> }> = new Map();

	const height: number =
		"values" in options ? options.values.length : options.height;
	const width: number =
		"values" in options ? (options.values[0]?.length ?? 0) : options.width;

	const grid = {
		width,
		height,
		getCell: (location: Location) =>
			cells[location[1]]?.[location[0]] ?? undefined,
		getDirection: (cell: Cell<T, TagT>, direction: Distance, distance = 1) => {
			return (
				cells[cell.y + direction[1] * distance]?.[
					cell.x + direction[0] * distance
				] ?? undefined
			);
		},
		neighbors: (cell: Cell<T, TagT>, directions?: Direction[]) =>
			(directions ?? Directions.Cardinal)
				.map((direction) => grid.getDirection(cell, direction))
				.filter((cell) => cell !== undefined),
		rows: () => cells.map((row) => [...row]),
		columns: () =>
			cells[0]?.map((_, i) =>
				cells.map((row, j) => {
					if (row[i] === undefined) {
						throw new Error(`Cell at ${[i, j]} is undefined`);
					}
					return row[i];
				}),
			) ?? [],
		firstRow: () => cells[0] ?? [],
		lastRow: () => cells[cells.length - 1] ?? [],
		firstColumn: () =>
			cells.map((row) => row[0]).filter((cell) => cell !== undefined),
		lastColumn: () =>
			cells
				.map((row) => row[row.length - 1])
				.filter((cell) => cell !== undefined),
		hasTag: (cell: Cell<T, TagT>, tag: TagT) => cell.hasTag(tag),
		tagCell: (cell: Cell<T, TagT>, tag: TagT) => {
			cell.addTag(tag);
			const thisTag = tags.get(tag) || {};
			tags.set(tag, thisTag);
			const tagRow = thisTag[cell.y] || new Set<number>();
			thisTag[cell.y] = tagRow;
			tagRow.add(cell.x);
		},
		setValue: (cell: Cell<T, TagT> | undefined, value: T) => {
			if (cell === undefined) {
				return;
			}
			cell.value = value;
		},
		get: (filter: T) => {
			return grid.find((T) => T === filter);
		},
		find: (filter: (T: T) => boolean) => {
			for (const row of cells) {
				for (const cell of row) {
					if (filter(cell.value)) {
						return cell;
					}
				}
			}
		},
		findLast: (filter: (T: T) => boolean) => {
			for (const row of cells.reverse()) {
				for (const cell of row.reverse()) {
					if (filter(cell.value)) {
						return cell;
					}
				}
			}
		},
		getAll: (filter: T) => {
			return grid.findAll((T) => T === filter);
		},
		findAll: (filter?: (T: T) => boolean) =>
			cells.flatMap((row, j) =>
				row.filter(({ value, location }, i) => !filter || filter(value)),
			),

		findAllTagged: (
			tag: TagT,
			direction: CardinalDirection = [0, 1],
		): Cell<T, TagT>[] => {
			const js = Object.keys(tags.get(tag) ?? {});
			const jNumbers = js
				.map(Number)
				.sort((a, b) => (a - b) * (direction[1] > 0 ? 1 : -1));
			return jNumbers
				.flatMap((j) =>
					[...(tags.get(tag)?.[j] ?? new Set<number>())]
						.sort(
							(a, b) => (Number(a) - Number(b)) * (direction[0] > 0 ? 1 : -1),
						)
						.map((i) => cells[j]?.[i]),
				)
				.filter((cell) => cell !== undefined);
		},
		deleteTag: (tag: TagT) => {
			for (const cell of grid.findAllTagged(tag)) {
				cell.removeTag(tag);
			}
			tags.delete(tag);
		},
		tags,

		map: <U, TagU extends string = never>(fn: (cell: Cell<T, TagT>) => U) => {
			const mappedGrid = grid.mapWithoutTags<U, TagT | TagU>(fn);
			for (const tag of Object.keys(grid.tags)) {
				for (const cell of grid.findAllTagged(tag as TagT)) {
					const mappedCell = mappedGrid.getCell([cell.x, cell.y]);
					if (!mappedCell) {
						throw new Error("Cell not found in mapped grid");
					}
					mappedGrid.tagCell(mappedCell, tag as TagT);
				}
			}
			return mappedGrid;
		},
		mapWithoutTags: <U, TagU extends string = never>(
			fn: (cell: Cell<T, TagT>) => U,
		) => {
			return newGrid<U, TagU>({
				values: grid.rows().map((row) => row.map((cell) => fn(cell))),
			});
		},
		subGrid: ({
			x,
			y,
			width,
			height,
		}: { x: number; y: number; width: number; height: number }): Grid<
			Cell<T, TagT>,
			TagT
		> => {
			const newCells = cells
				.slice(y, y + height)
				.map((row) => row.slice(x, x + width));
			const grid = newGrid<Cell<T, TagT>, TagT>({
				values: newCells,
			});
			for (const row of newCells) {
				for (const cell of row) {
					for (const tag of cell.tags) {
						const partitionCell = grid.getCell([cell.x - x, cell.y - y]);
						if (!partitionCell) {
							throw new Error("Cell not found in partitioned grid");
						}
						grid.tagCell(partitionCell, tag);
					}
				}
			}
			return grid;
		},
		partition: <TagU extends string = string>({
			length,
		}: { length: number }): Grid<Grid<Cell<T, TagT>, TagT>, TagU> => {
			if (width <= 0) {
				throw new Error("width must be greater than 0");
			}
			const newValues: Grid<Cell<T, TagT>, TagT>[][] = [];
			for (let j = 0; j < width; j += length) {
				const row: Grid<Cell<T, TagT>, TagT>[] = [];
				for (let i = 0; i < height; i += length) {
					row.push(grid.subGrid({ x: i, y: j, width: length, height: length }));
				}
				newValues.push(row);
			}
			return newGrid<Grid<Cell<T, TagT>, TagT>, TagU>({
				values: newValues,
			});
		},
		print: (highlighting?: {
			tag?: TagT;
			highlight: string;
			path?: Cell<T, TagT>[];
		}) => {
			const { tag, highlight } = highlighting || { tag: null, highlight: null };
			const pathGridCells = new Set<Cell<T, TagT>>(highlighting?.path);
			const pathGrid = grid.map<boolean>((cell) => pathGridCells.has(cell));
			const maxLength = Math.max(
				...cells.flatMap((row) =>
					row.map(({ value }) => value?.toString()?.length ?? 0),
				),
			);
			const lines = cells
				.map((row) =>
					row
						.map((cell) =>
							((tag && cell.hasTag(tag)) ||
							pathGrid.getCell(cell.location)?.value
								? (highlight ?? "".padStart(maxLength, "#"))
								: (cell?.value?.toString() ?? "")
							).padStart(maxLength),
						)
						.join(""),
				)
				.join("\n");
			console.log(lines);
		},
	};

	// Create the grid
	if ("values" in options) {
		for (const [y, valueRow] of options.values.entries()) {
			if (valueRow.length !== width) {
				throw new Error("Width of grid does not match values");
			}
			const row: Cell<T, TagT>[] = [];
			for (const [x, value] of valueRow.entries()) {
				row.push(newCell({ x, y, grid, value }));
			}
			cells.push(row);
		}
	} else {
		for (let j = 0; j < height || 0; j++) {
			const row: Cell<T, TagT>[] = [];
			for (let i = 0; i < width || 0; i++) {
				const cell: Cell<T, TagT> = newCell({
					x: i,
					y: j,
					grid,
					value: options.defaultValue(i, j),
				});
				row.push(cell);
			}
			cells.push(row);
		}
	}

	return grid;
};
