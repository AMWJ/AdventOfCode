import { readLines } from "../utils/file";
import { sum } from "../utils/math";

export const star1 = async () => {
	const lines = (await readLines(`${__dirname}/input.txt`)).join();

	let index = lines.indexOf("mul(");
	const possibilities: number[] = [];
	while (index !== -1) {
		possibilities.push(index + 4);
		index = lines.indexOf("mul(", index + 1);
	}
	return sum(
		possibilities.map((possibility) => {
			let firstValue = true;
			let a = 0;
			let b = 0;
			for (let i = possibility; i < lines.length; i++) {
				switch (lines[i]) {
					case ")":
						return a * b;
					case ",":
						firstValue = false;
						continue;
				}
				const number = Number.parseInt(lines[i]);
				if (Number.isNaN(number)) {
					return 0;
				}
				if (firstValue) {
					a = a * 10 + number;
				} else {
					b = b * 10 + number;
				}
			}
		}),
	);
};

export const star2 = async () => {
	const lines = (await readLines(`${__dirname}/input.txt`)).join();

	let enabled = true;
	let index = lines.indexOf("(");
	const possibilities: number[] = [];
	while (index !== -1) {
		possibilities.push(index);
		index = lines.indexOf("(", index + 1);
	}
	return sum(
		possibilities.map((possibility) => {
			const prior = lines.substring(0, possibility);
			if (lines[possibility + 1] === ")") {
				if (prior.endsWith("do") && lines[possibility + 1] === ")") {
					enabled = true;
				}
				if (prior.endsWith("don't") && lines[possibility + 1] === ")") {
					enabled = false;
				}
				return 0;
			}

			if (enabled && prior.endsWith("mul")) {
				let firstValue = true;
				let a = 0;
				let b = 0;
				for (let i = possibility + 1; i < lines.length; i++) {
					switch (lines[i]) {
						case ")":
							return a * b;
						case ",":
							firstValue = false;
							continue;
					}
					const number = Number.parseInt(lines[i]);
					if (Number.isNaN(number)) {
						return 0;
					}
					if (firstValue) {
						a = a * 10 + number;
					} else {
						b = b * 10 + number;
					}
				}
			}
			return 0;
		}),
	);
};
