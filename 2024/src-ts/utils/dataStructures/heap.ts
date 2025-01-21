export type Heap<T> = {
	insert: (...values: T[]) => void;
	popMin: () => T | undefined;
	size: () => number;
};

export const ArrayHeap = <T>() => {
	const array: T[] = [];
	return {
		insert: (...values: T[]) => array.push(...values),
		size: () => array.length,
		popMin: () => array.shift(),
	};
};
