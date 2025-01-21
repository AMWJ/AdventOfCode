import { readLinesOfNumbers } from "../utils/file";
import { sum } from "../utils/math";

export const parse = async () => {
	return (await readLinesOfNumbers(`${__dirname}/input.txt`))
		.map((line) => line[0])
		.filter((line) => line !== undefined);
};

const shiftUp = (secret: number, times: number, mod: number) =>
	(secret % (mod / 2 ** times)) << times;

const MOD = 16777216;
export const star1 = async () => {
	const lines = await parse();
	return sum(
		lines.map((line) => {
			let secret = line;
			for (let i = 0; i < 2000; i++) {
				secret = (shiftUp(secret, 6, MOD) ^ secret) % MOD;
				secret = ((secret >> 5) ^ secret) % MOD;
				secret = (shiftUp(secret, 11, MOD) ^ secret) % MOD;
			}
			return secret;
		}),
	);
};

export const star2 = async () => {
	const lines = await parse();
	const diffs: [number, number, number, number] = [0, 0, 0, 0];
	const founds: {
		[key: string]: {
			[key: string]: { [key: string]: { [key: string]: number } };
		};
	} = {};
	for (const line of lines) {
		const found: typeof founds = {};
		let secret = line;
		let oldSecret = secret % 10;
		for (let i = 1; i < 2000; i++) {
			secret = (shiftUp(secret, 6, MOD) ^ secret) % MOD;
			secret = ((secret >> 5) ^ secret) % MOD;
			secret = (shiftUp(secret, 11, MOD) ^ secret) % MOD;
			const lastDigit = secret % 10;
			const diff = lastDigit - oldSecret;
			//diffs = [diffs[2], diffs[1], diffs[0], diff];
			diffs.push(diff);
			diffs.splice(0, diffs.length - 4);
			if (i >= 3) {
				const value =
					found[diffs[0]]?.[diffs[1]]?.[diffs[2]]?.[diffs[3]] ?? lastDigit;
				const wrapped = found[diffs[0]]?.[diffs[1]]?.[diffs[2]] ?? {};
				wrapped[diffs[3]] = value;
				const wrapped2 = found[diffs[0]]?.[diffs[1]] ?? {};
				wrapped2[diffs[2]] = wrapped;
				const wrapped3 = found[diffs[0]] || {};
				wrapped3[diffs[1]] = wrapped2;
				found[diffs[0]] = wrapped3;
			}
			oldSecret = lastDigit;
		}
		for (const key in found) {
			founds[key] = founds[key] || {};
			for (const key2 in found[key]) {
				founds[key][key2] = founds[key][key2] || {};
				for (const key3 in found[key][key2]) {
					founds[key][key2][key3] = founds[key][key2][key3] || {};
					for (const key4 in found[key][key2][key3]) {
						founds[key][key2][key3][key4] = founds[key][key2][key3][key4] || 0;
						founds[key][key2][key3][key4] +=
							found?.[key]?.[key2]?.[key3]?.[key4] ?? 0;
					}
				}
			}
		}
	}
	const sequences = Object.entries(founds).flatMap(([key, value]) =>
		Object.entries(value).flatMap(([key2, value2]) =>
			Object.entries(value2).flatMap(([key3, value3]) =>
				Object.entries(value3).map(([key4, value4]) => ({
					pattern: [key, key2, key3, key4],
					value: value4,
				})),
			),
		),
	);
	sequences.sort((a, b) => b.value - a.value);
	if (sequences[0] === undefined) {
		throw new Error("No sequence found");
	}
	return sequences[0].value;
};
