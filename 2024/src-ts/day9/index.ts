import { readLines } from "../utils/file";
import { sum } from "../utils/math";
import { sleep } from "../utils/sleep";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const line = lines[0].split("").map((x) => Number.parseInt(x));
	const fileCount = (line.length + 1) / 2;
	let rollingSum = 0;
	let index = 0;
	let i = [0, 0];
	let j = [line.length - 1, line[line.length - 1] - 1];
	if (j[0] % 2 === 1) {
		throw new Error(`Invalid j: ${j}`);
	}
	while (i[0] < j[0] || (i[0] === j[0] && i[1] <= j[1])) {
		if (line[i[0]] <= i[1]) {
			i = [i[0] + 1, i[1] - line[i[0]]];
		} else if (j[0] % 2 === 1) {
			throw new Error(`Invalid j: ${JSON.stringify({ i, j })}`);
		} else if (j[1] < 0) {
			j = [j[0] - 2, line[j[0] - 2] - 1];
		} else if (i[0] % 2 === 0) {
			const id = i[0] / 2;
			const length =
				j[0] > i[0] ? line[i[0]] - i[1] : Math.min(j[1] + 1, line[i[0]] - i[1]);
			rollingSum += id * length * (index + (length - 1) / 2);
			index += length;
			i = [i[0], i[1] + length];
		} else {
			const id = j[0] / 2;
			const length = Math.min(j[1] + 1, line[i[0]] - i[1]);
			rollingSum += id * length * (index + (length - 1) / 2);
			index += length;
			j = [j[0], j[1] - length];
			i = [i[0], i[1] + length];
		}
	}
	return rollingSum;
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const line = lines[0].split("").map((x) => Number.parseInt(x));
	const fileCount = (line.length + 1) / 2;
	const files: { index: number; size: number; id: number }[] = [];
	let index = 0;
	for (let i = 0; i < line.length; i++) {
		if (i % 2 === 0) {
			files.push({ id: i / 2, size: line[i], index });
		}
		index += line[i];
	}
	for (let i = files.length - 1; i >= 0; i--) {
		const insertionPoint = files.slice(1).findIndex((file, j) => {
			return (
				j <= i && file.index >= files[j].index + files[j].size + files[i].size
			);
		});
		console.log({ insertionPoint });
		if (insertionPoint >= 0 && insertionPoint < i) {
			const newIndex = files[insertionPoint].index + files[insertionPoint].size;
			console.log(
				`Inserting ${files[i].id} at ${insertionPoint + 1}, new index: ${newIndex}`,
			);
			const file = { ...files[i], index: newIndex };
			files.splice(i, 1);
			files.splice(insertionPoint + 1, 0, file);
			i++;
		}
	}
	return sum(
		files.map(
			(file) => file.id * file.size * (file.index + (file.size - 1) / 2),
		),
	);
};
