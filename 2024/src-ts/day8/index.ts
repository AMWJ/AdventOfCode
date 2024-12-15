import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const allAntennas: { [key: string]: { i: number, j: number }[] } = {};
	for (let j = 0; j < lines.length; j++) {
		const line = lines[j];
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === '.') {
				continue;
			}
			allAntennas[char] = allAntennas[char] || [];
			allAntennas[char].push({ i, j });
		}
	}
	const antinodes = {};
	for (const [key, antennas] of Object.entries(allAntennas)) {
		for (let i = 0; i < antennas.length; i++) {
			const antenna = antennas[i];
			for (let j = i + 1; j < antennas.length; j++) {
				const antenna2 = antennas[j];
				const iDistance = antenna.i - antenna2.i;
				const jDistance = antenna.j - antenna2.j;
				const antinode1 = { i: antenna.i + iDistance, j: antenna.j + jDistance };
				const antinode2 = { i: antenna2.i - iDistance, j: antenna2.j - jDistance };
				if (antinode1.i >= 0 && antinode1.j >= 0 && antinode1.i < lines[0].length && antinode1.j < lines.length) {
					antinodes[antinode1.j] = antinodes[antinode1.j] || {};
					antinodes[antinode1.j][antinode1.i] = key;
				}
				if (antinode2.i >= 0 && antinode2.j >= 0 && antinode2.i < lines[0].length && antinode2.j < lines.length) {
					antinodes[antinode2.j] = antinodes[antinode2.j] || {};
					antinodes[antinode2.j][antinode2.i] = key;
				}
			}
		}
	}
	return sum(Object.values(antinodes).map((line) => Object.values(line).length));
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const allAntennas: { [key: string]: { i: number, j: number }[] } = {};
	for (let j = 0; j < lines.length; j++) {
		const line = lines[j];
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === '.') {
				continue;
			}
			allAntennas[char] = allAntennas[char] || [];
			allAntennas[char].push({ i, j });
		}
	}
	const antinodes = {};
	for (const [key, antennas] of Object.entries(allAntennas)) {
		for (let i = 0; i < antennas.length; i++) {
			const antenna = antennas[i];
			for (let j = i + 1; j < antennas.length; j++) {
				const antenna2 = antennas[j];
				const distance = {
					i: antenna.i - antenna2.i,
					j: antenna.j - antenna2.j
				};
				let antinode1 = antenna;
				let antinode2 = antenna2;
				while (antinode1.i >= 0 && antinode1.j >= 0 && antinode1.i < lines[0].length && antinode1.j < lines.length) {
					antinodes[antinode1.j] = antinodes[antinode1.j] || {};
					antinodes[antinode1.j][antinode1.i] = key;
					antinode1 = { i: antinode1.i + distance.i, j: antinode1.j + distance.j };
				}
				while (antinode2.i >= 0 && antinode2.j >= 0 && antinode2.i < lines[0].length && antinode2.j < lines.length) {
					antinodes[antinode2.j] = antinodes[antinode2.j] || {};
					antinodes[antinode2.j][antinode2.i] = key;
					antinode2 = { i: antinode2.i - distance.i, j: antinode2.j - distance.j };
				}
			}
		}
	}
	return sum(Object.values(antinodes).map((line) => Object.values(line).length));
};
