export const toBits = (n: number): (0 | 1)[] => {
	const result = [];
	let copy = n;
	if (copy < 0) {
		throw new Error("Not implemented");
	}
	while (copy > 0) {
		result.unshift(copy % 2);
		copy = Math.floor(copy / 2);
	}
	return result.filter((x) => x === 0 || x === 1);
};

export const fromBits = (n: (0 | 1)[]): number => {
	let result = 0;
	for (const i of n) {
		result *= 2;
		result += i;
	}
	return result;
};
