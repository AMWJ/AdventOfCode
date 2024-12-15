import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const matrices: {
		a: [number, number];
		b: [number, number];
		total: [number, number];
	}[] = [];
	for (let i = 0; i < lines.length; i += 4) {
		matrices.push({
			a: lines[i]
				.split("+")
				.slice(1)
				.map((l) => Number.parseInt(l.split(",")[0].trim())) as [
				number,
				number,
			],
			b: lines[i + 1]
				.split("+")
				.slice(1)
				.map((l) => Number.parseInt(l.split(",")[0].trim())) as [
				number,
				number,
			],
			total: lines[i + 2]
				.split(" ")
				.slice(1)
				.map((l) => Number.parseInt(l.split("=")[1])) as [number, number],
		});
	}
	return sum(
		matrices.map(({ a, b, total }) => {
			const denominator = a[0] * b[1] - a[1] * b[0];
			if (denominator === 0) {
				console.log({ a, b, total });
				console.log("denominator is 0");
			}
			const bNumerator = total[0] * b[1] - total[1] * b[0];
			const aNumerator = a[0] * total[1] - a[1] * total[0];
			if (aNumerator % denominator !== 0 || bNumerator % denominator !== 0) {
				return 0;
			}
			return aNumerator / denominator + (bNumerator * 3) / denominator;
		}),
	);
};

export const star2 = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const matrices: {
		a: [number, number];
		b: [number, number];
		total: [number, number];
	}[] = [];
	for (let i = 0; i < lines.length; i += 4) {
		matrices.push({
			a: lines[i]
				.split("+")
				.slice(1)
				.map((l) => Number.parseInt(l.split(",")[0].trim())) as [
				number,
				number,
			],
			b: lines[i + 1]
				.split("+")
				.slice(1)
				.map((l) => Number.parseInt(l.split(",")[0].trim())) as [
				number,
				number,
			],
			total: lines[i + 2]
				.split(" ")
				.slice(1)
				.map((l) => Number.parseInt(l.split("=")[1])) as [number, number],
		});
	}
	return sum(
		matrices.map(({ a, b, total }) => {
			const denominator = a[0] * b[1] - a[1] * b[0];
			total = [total[0] + 10000000000000, total[1] + 10000000000000];
			if (denominator === 0) {
				console.log({ a, b, total });
				console.log("denominator is 0");
			}
			const bNumerator = total[0] * b[1] - total[1] * b[0];
			const aNumerator = a[0] * total[1] - a[1] * total[0];
			if (aNumerator % denominator !== 0 || bNumerator % denominator !== 0) {
				return 0;
			}
			return aNumerator / denominator + (bNumerator * 3) / denominator;
		}),
	);
};
