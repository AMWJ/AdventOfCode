const BIG_PRIME = Number.MAX_SAFE_INTEGER;
const SMALL_PRIME = 87178291199;

/**
 * Generates a random integer between min (inclusive) and max (exclusive) using a seed.
 * @param min The minimum value (inclusive)
 * @param max The maximum value (exclusive)
 * @param seed The seed to use. Uses 1 if not provided.
 * @returns A random integer between min (inclusive) and max (exclusive)
 */
export const randomInt = (min: number, max: number, seed = 1) => {
	let result = seed;
	const mod = max - min;
	for (let i = 0; i < 100; i++) {
		result *= SMALL_PRIME;
		result %= BIG_PRIME;
	}
	return (result % mod) + min;
};

export const randomInts = (
	min: number,
	max: number,
	count: number,
	seed = 1,
) => {
	const result = [];
	for (let i = 0; i < count; i++) {
		result.push(
			randomInt(min, max, result.length ? result[result.length - 1] : seed),
		);
	}
	return result;
};
