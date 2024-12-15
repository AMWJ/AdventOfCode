import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const getCoordinate = ([x, y]: [number, number]) => lines?.[y]?.[x];
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
		if (getCoordinate(next) === undefined) {
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
	const lines = await readLines(`${__dirname}/input.txt`);
	const getCoordinate = ([x, y]: [number, number]) => lines?.[y]?.[x];
	const coordinateToIndex = ([x, y]: [number, number]) => x === 0 ? y > 0 ? 2 : 0 : x > 0 ? 1 : 3;
	type Covered = ({ priors: { location: [number, number], direction: [number, number] }[], leads?: { [j: number]: { [i: number]: Set<number> } } })
	const emptyCovered = { priors: [] };
	const covered: [Covered, Covered, Covered, Covered][][] = lines.map(() => lines[0].split("").map(() => [emptyCovered, emptyCovered, emptyCovered, emptyCovered]));
	//console.log(JSON.stringify(covered));
	let first = lines
		.entries()
		.filter(([i, line]) => line.includes("^"))
		.map<[number, number]>(([j, line]) => [line.indexOf("^"), j])
		.toArray()[0];
	const queue: { location: [number, number], direction: [number, number], posterior?: { location: [number, number], direction: [number, number] } }[] = [
		...lines.flatMap<{ location: [number, number], direction: [number, number], posterior?: { location: [number, number], direction: [number, number] } }>((line, j) => [
			{ location: [0, j], direction: [-1, 0] },
			{ location: [line.length - 1, j], direction: [1, 0] }
		]),
		...lines[0].split("").flatMap<{ location: [number, number], direction: [number, number], posterior?: { location: [number, number], direction: [number, number] } }>((_, i) => [
			{ location: [i, 0], direction: [0, -1] },
			{ location: [i, lines.length - 1], direction: [0, 1] }
		])];
	while (queue.length > 0) {
		const { location, direction, posterior } = queue.shift();
		const posteriorLocation = posterior?.location;
		const posteriorDirection = posterior?.direction;
		if (!getCoordinate(location) || getCoordinate(location) === "#") {
			continue;
		}
		if (covered[location[1]][location[0]][coordinateToIndex(direction)].leads !== undefined) {
			continue;
		}

		let leads: { [j: number]: { [i: number]: Set<number> } };
		if (posteriorLocation) {
			const posteriorLeads = covered[posteriorLocation[1]][posteriorLocation[0]][coordinateToIndex(posteriorDirection)].leads;
			leads = {
				...posteriorLeads,
				[posteriorLocation[1]]: {
					...posteriorLeads[posteriorLocation[1]],
					[posteriorLocation[0]]: new Set<number>([...(posteriorLeads[posteriorLocation[1]]?.[posteriorLocation[0]] ?? []), coordinateToIndex(posteriorDirection)]),
				},
			}
			// console.log({ leads, posteriorLocation, posteriorDirection });
			covered[posteriorLocation[1]][posteriorLocation[0]][coordinateToIndex(posteriorDirection)] = { ...covered[posteriorLocation[1]][posteriorLocation[0]][coordinateToIndex(posteriorDirection)], priors: [{ location, direction }, ...covered[posteriorLocation[1]][posteriorLocation[0]][coordinateToIndex(posteriorDirection)].priors] };
		} else {
			leads = {}
		}
		// console.log({ location, direction, leads });
		covered[location[1]][location[0]][coordinateToIndex(direction)] = { ...covered[location[1]][location[0]][coordinateToIndex(direction)], leads };

		const backwardsLocation: [number, number] = [location[0] - direction[0], location[1] - direction[1]];
		queue.push({ location: backwardsLocation, direction, posterior: { location, direction } });
		// console.log("Just pushed", queue[queue.length - 1]);
		const leftDirection: [number, number] = [direction[1], -direction[0]];
		if (getCoordinate([location[0] + leftDirection[0], location[1] + leftDirection[1]]) === "#") {
			queue.push({ location, direction: leftDirection, posterior: { location, direction } });
			// console.log("Just pushed", queue[queue.length - 1]);
		}
	}
	let currentLocation = first;
	let currentDirection: [number, number] = [0, -1];
	const barrelLocations = {};
	let loops = 0;
	while (true) {
		// console.log("Current location", currentLocation);
		if (!getCoordinate(currentLocation)) {
			break;
		}

		// Can we put a barrel here?
		const turnRight: [number, number] = [-currentDirection[1], currentDirection[0]];
		if (getCoordinate([currentLocation[0] + currentDirection[0], currentLocation[1] + currentDirection[1]]) && covered[currentLocation[1]][currentLocation[0]][coordinateToIndex(turnRight)].leads?.[currentLocation[1]]?.[currentLocation[0]]?.has(coordinateToIndex(currentDirection))) {
			// Found a loop!
			loops++;
			// console.log("Found a loop at", [currentLocation[0] + currentDirection[0], currentLocation[1] + currentDirection[1]]);
		}

		// Continue on
		const next: [number, number] = [
			currentLocation[0] + currentDirection[0],
			currentLocation[1] + currentDirection[1],
		];

		const nextLocation = getCoordinate(next);
		if (nextLocation === "#") {
			currentDirection = turnRight;
			continue;
		} else {
			currentLocation = next;
		}
	}
	return loops;
};
