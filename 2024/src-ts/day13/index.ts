import { readLines } from "../utils/file";
import { newGrid } from "../utils/grid";
import { determinant, sum } from "../utils/math";

const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	const matrices: {
		a: number[];
		b: number[];
		total: number[];
	}[] = [];
	for (let i = 0; i < lines.length; i += 4) {
		const [machineA, machineB, total] = [lines[i], lines[i + 1], lines[i + 2]];
		if (
			machineA === undefined ||
			machineB === undefined ||
			total === undefined
		) {
			throw new Error("undefined");
		}
		matrices.push({
			a: machineA
				.split("+")
				.slice(1)
				.map((l) => Number.parseInt(l.split(",")[0]?.trim() ?? "")),
			b: machineB
				.split("+")
				.slice(1)
				.map((l) => Number.parseInt(l.split(",")[0]?.trim() ?? "")),
			total: total
				.split(" ")
				.slice(1)
				.map((l) => Number.parseInt(l.split("=")[1] ?? "")),
		});
	}
	return matrices;
};

export const star1 = async () => {
	const matrices = await parse();
	return sum(
		matrices.map(({ a, b, total }) => {
			const denominator = determinant(newGrid({ values: [a, b] }));
			if (denominator === 0) {
				throw new Error("a and b are linearly dependent");
			}
			const bNumerator = determinant(newGrid({ values: [total, b] }));
			const aNumerator = determinant(newGrid({ values: [a, total] }));
			if (aNumerator % denominator !== 0 || bNumerator % denominator !== 0) {
				return 0;
			}
			return aNumerator / denominator + (bNumerator * 3) / denominator;
		}),
	);
};

export const star2 = async () => {
	const matrices = await parse();
	return sum(
		matrices.map(({ a, b, total }) => {
			const adjustedTotal = total.map((t) => t + 10000000000000);
			const denominator = determinant(newGrid({ values: [a, b] }));
			if (denominator === 0) {
				throw new Error("a and b are linearly dependent");
			}
			const bNumerator = determinant(newGrid({ values: [adjustedTotal, b] }));
			const aNumerator = determinant(newGrid({ values: [a, adjustedTotal] }));
			if (aNumerator % denominator !== 0 || bNumerator % denominator !== 0) {
				return 0;
			}
			return aNumerator / denominator + (bNumerator * 3) / denominator;
		}),
	);
};
