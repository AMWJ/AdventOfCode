import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const getCoordinate = ([x, y]: [number, number]) => lines[y][x];
	let location = lines
		.entries()
		.filter(([i, line]) => line.includes("^"))
		.map<[number, number]>(([j, line]) => [line.indexOf("^"), j])
		.toArray()[0];
	let direction = [0, -1];
	const locations: { [key: number]: Set<number> } = {};
	while (true) {
		locations[location[0]] = locations[location[0]] || new Set<number>();
		locations[location[0]].add(location[1]);
		const next: [number, number] = [
			location[0] + direction[0],
			location[1] + direction[1],
		];
		if (
			next[0] < 0 ||
			next[1] < 0 ||
			next[0] >= lines[0].length ||
			next[1] >= lines.length
		) {
			break;
		}
		const nextLocation = getCoordinate(next);
		if (nextLocation === "#") {
			direction = [-direction[1], direction[0]];
		} else {
			location = next;
		}
	}
	return sum(Object.entries(locations).map(([_, set]) => set.size));
};

export const star2 = async () => {
	return 0;
};
