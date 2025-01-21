import { readGrid, readLines } from "../utils/file";
import {
	Down,
	DownLeft,
	Left,
	Right,
	Up,
	UpLeft,
	UpRight,
} from "../utils/grid";
import { sum } from "../utils/math";
import { partitionFind } from "../utils/pathFinding";

const parse = async () => {
	return await readGrid(`${__dirname}/input.txt`, "");
};

export const star1 = async () => {
	const plots = await parse();
	const partition = partitionFind(plots);
	const gardens = partition.tags
		.keys()
		.toArray()
		.map((tag) => {
			return [
				partition.findAllTagged(tag).length,
				sum(
					partition
						.findAllTagged(tag)
						.map(
							(cell) =>
								(partition.getDirection(cell, Down)?.hasTag(tag) ? 0 : 2) +
								(partition.getDirection(cell, Right)?.hasTag(tag) ? 0 : 2),
						),
				),
			] as const;
		});

	return sum(gardens.map(([area, perimeter]) => area * perimeter));
};

export const star2 = async () => {
	const plots = await parse();
	const partition = partitionFind(plots);
	const gardens = partition.tags
		.keys()
		.toArray()
		.map((tag) => {
			return [
				partition.findAllTagged(tag).length,
				sum(
					partition
						.findAllTagged(tag)
						.map(
							(cell) =>
								[
									!partition.getDirection(cell, Down)?.hasTag(tag) &&
										(!partition.getDirection(cell, Left)?.hasTag(tag) ||
											partition.getDirection(cell, DownLeft)?.hasTag(tag)),
									!partition.getDirection(cell, Up)?.hasTag(tag) &&
										(!partition.getDirection(cell, Left)?.hasTag(tag) ||
											partition.getDirection(cell, UpLeft)?.hasTag(tag)),
									!partition.getDirection(cell, Left)?.hasTag(tag) &&
										(!partition.getDirection(cell, Up)?.hasTag(tag) ||
											partition.getDirection(cell, UpLeft)?.hasTag(tag)),
									!partition.getDirection(cell, Right)?.hasTag(tag) &&
										(!partition.getDirection(cell, Up)?.hasTag(tag) ||
											partition.getDirection(cell, UpRight)?.hasTag(tag)),
								].filter((x) => x).length,
						),
				),
			] as const;
		});

	return sum(gardens.map(([perimeter, sides]) => sides * perimeter));
};
