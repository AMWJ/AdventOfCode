import { readLines, readLinesOfNumbers } from "../utils/file";
import { sum } from "../utils/math";

const parse = async () => {
	return (await readLinesOfNumbers(`${__dirname}/input.txt`, ""))[0] ?? [];
};
export const star1 = async () => {
	const line = await parse();
	let rollingSum = 0;
	let index = 0;
	let i = [0, 0] as [number, number];
	const last = line[line.length - 1];
	if (last === undefined) {
		throw new Error(`Invalid line: ${line}`);
	}
	let j = [line.length - 1, last - 1] as [number, number];
	if (j[0] % 2 === 1) {
		throw new Error(`Invalid j: ${j}`);
	}
	while (i[0] < j[0] || (i[0] === j[0] && i[1] <= j[1])) {
		const lineI = line[i[0]];
		const lineJ = line[j[0] - 2];
		if (lineI === undefined || lineJ === undefined) {
			throw new Error(`Invalid line: ${line}`);
		}
		if (lineI <= i[1]) {
			i = [i[0] + 1, i[1] - lineI] as [number, number];
		} else if (j[0] % 2 === 1) {
			throw new Error(`Invalid j: ${JSON.stringify({ i, j })}`);
		} else if (j[1] < 0) {
			j = [j[0] - 2, lineJ - 1];
		} else if (i[0] % 2 === 0) {
			const id = i[0] / 2;
			const length =
				j[0] > i[0] ? lineI - i[1] : Math.min(j[1] + 1, lineI - i[1]);
			rollingSum += id * length * (index + (length - 1) / 2);
			index += length;
			i = [i[0], i[1] + length];
		} else {
			const id = j[0] / 2;
			const length = Math.min(j[1] + 1, lineI - i[1]);
			rollingSum += id * length * (index + (length - 1) / 2);
			index += length;
			j = [j[0], j[1] - length];
			i = [i[0], i[1] + length];
		}
	}
	return rollingSum;
};

export const star2 = async () => {
	const line = await parse();
	const files: { index: number; size: number; id: number }[] = [];
	let index = 0;
	for (const [i, size] of line.entries()) {
		if (i % 2 === 0) {
			files.push({ id: i / 2, size, index });
		}
		index += size;
	}
	for (let i = files.length - 1; i >= 0; i--) {
		const file = files[i];
		if (file === undefined) {
			throw new Error(`Invalid files: ${files}`);
		}
		const insertionPoint = files.findIndex((first, j) => {
			const second = files[j + 1];
			return (
				j <= i && second && second.index >= first.index + first.size + file.size
			);
		});
		if (insertionPoint < i && files[insertionPoint] !== undefined) {
			const newIndex = files[insertionPoint].index + files[insertionPoint].size;
			const newFile = { ...file, index: newIndex };
			files.splice(i, 1);
			files.splice(insertionPoint + 1, 0, newFile);
			i++;
		}
	}
	return sum(
		files.map(
			(file) => file.id * file.size * (file.index + (file.size - 1) / 2),
		),
	);
};
