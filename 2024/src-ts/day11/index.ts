import { readLineOfNumbers, readLines } from "../utils/file";
import { sum } from "../utils/math";
import { sleep } from "../utils/sleep";

export const star1 = async () => {
	const line = (await readLineOfNumbers(`${__dirname}/input.txt`))?.[0];
	let keys: {
		[key: string]: number;
	} = {};
	for (const number of line) {
		keys[number] = 1;
	}
	for (let iteration = 0; iteration < 25; iteration++) {
		const newKeys: {
			[key: string]: number;
		} = {};
		for (const [number, count] of Object.entries(keys)) {
			if (number === "0") {
				newKeys["1"] = newKeys["1"] ?? 0;
				newKeys["1"] += count;
				continue;
			}
			const digits = number;
			if (digits.length % 2 === 0) {
				const first = BigInt(digits.substring(0, digits.length / 2)).toString();
				const second = BigInt(digits.substring(digits.length / 2)).toString();
				newKeys[first] = newKeys[first] ?? 0;
				newKeys[first] += count;
				newKeys[second] = newKeys[second] ?? 0;
				newKeys[second] += count;
			} else {
				const newKey = (BigInt(number) * BigInt(2024)).toString();
				newKeys[newKey] = newKeys[newKey] ?? 0;
				newKeys[newKey] += count;
			}
		}
		keys = newKeys;
	}
	return sum(Object.values(keys));
};

export const star2 = async () => {
	const line = (await readLineOfNumbers(`${__dirname}/input.txt`))?.[0];
	let keys: {
		[key: string]: number;
	} = {};
	for (const number of line) {
		keys[number] = 1;
	}
	for (let iteration = 0; iteration < 75; iteration++) {
		const newKeys: {
			[key: string]: number;
		} = {};
		for (const [number, count] of Object.entries(keys)) {
			if (number === "0") {
				newKeys["1"] = newKeys["1"] ?? 0;
				newKeys["1"] += count;
				continue;
			}
			const digits = number;
			if (digits.length % 2 === 0) {
				const first = BigInt(digits.substring(0, digits.length / 2)).toString();
				const second = BigInt(digits.substring(digits.length / 2)).toString();
				newKeys[first] = newKeys[first] ?? 0;
				newKeys[first] += count;
				newKeys[second] = newKeys[second] ?? 0;
				newKeys[second] += count;
			} else {
				const newKey = (BigInt(number) * BigInt(2024)).toString();
				newKeys[newKey] = newKeys[newKey] ?? 0;
				newKeys[newKey] += count;
			}
		}
		keys = newKeys;
	}
	return sum(Object.values(keys));
};
