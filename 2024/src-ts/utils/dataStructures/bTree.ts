import { zip } from "../general";
import { sum } from "../math";

const MAX_NODES = 2;

type Node<T> = {
	values: T[];
	parent?: Node<T>;
};

type ParentNode<T> = {
	values: T[];
	parent?: Node<T>;
	children: Node<T>[];
	size: number;
};

const isParentNode = <T>(node: Node<T>): node is ParentNode<T> => {
	return "children" in node && node.children !== undefined;
};

const checkForDuplicates = <T>(node: Node<T>, seen?: Set<T>) => {
	const newseen = seen ?? new Set<T>();
	for (const value of node.values) {
		if (newseen.has(value)) {
			throw new Error("Duplicate value");
		}
		newseen.add(value);
	}
	if (isParentNode(node)) {
		for (const child of node.children) {
			checkForDuplicates(child, newseen);
		}
	}
};

const rotate = <T>(
	node: ParentNode<T>,
	index: number,
	direction: 1 | -1,
	quantity: number,
) => {
	const sourceChild = node.children[index];
	const destinationChild = node.children[index + direction];
	if (sourceChild === undefined) {
		throw new Error("No child to rotate from");
	}
	if (destinationChild === undefined) {
		throw new Error("No child to rotate to");
	}
	const sourceValues =
		direction === -1 ? sourceChild.values : sourceChild.values.toReversed();
	const destinationValues =
		direction === -1
			? destinationChild.values
			: destinationChild.values.toReversed();
	const promotedValue = node.values[direction === 1 ? index : index - 1];
	if (promotedValue === undefined) {
		throw new Error("Value not found in node");
	}
	const movingValues = sourceValues.slice(0, quantity - 1);
	const newDestinationValues = [
		...destinationValues,
		promotedValue,
		...movingValues,
	];
	const newSourceValues = sourceValues.slice(quantity);
	const newPromotedValue = sourceValues[quantity - 1];
	if (newPromotedValue === undefined) {
		throw new Error("No value found in node to promote");
	}

	sourceChild.values =
		direction === -1 ? newSourceValues : newSourceValues.toReversed();
	destinationChild.values =
		direction === -1 ? newDestinationValues : newDestinationValues.toReversed();
	node.values[direction === 1 ? index : index - 1] = newPromotedValue;

	if (isParentNode(sourceChild) && isParentNode(destinationChild)) {
		const sourceChildren =
			direction === -1
				? sourceChild.children
				: sourceChild.children.toReversed();
		const destinationChildren =
			direction === -1
				? destinationChild.children
				: destinationChild.children.toReversed();
		const movingChildren = sourceChildren.slice(0, quantity);
		const newSourceChildren = sourceChildren.slice(quantity);
		const newDestinationChildren = [...destinationChildren, ...movingChildren];

		sourceChild.children =
			direction === -1 ? newSourceChildren : newSourceChildren.toReversed();
		destinationChild.children =
			direction === -1
				? newDestinationChildren
				: newDestinationChildren.toReversed();
	}
};

const splitChild = <T>(node: ParentNode<T>, index: number) => {
	const child = node.children[index];
	if (child === undefined) {
		throw new Error("Child not found");
	}
	const split = Math.floor(child.values.length / 2);
	const promotedValue = child.values[split];
	if (promotedValue === undefined) {
		throw new Error("No value found to promote");
	}
	const leftValues = child.values.slice(0, split);
	const leftChildren = isParentNode(child)
		? child.children.slice(0, split + 1)
		: undefined;
	const leftNode = {
		values: leftValues,
		children: leftChildren,
		size:
			leftChildren !== undefined
				? leftValues.length +
					sum(
						leftChildren?.map((c) =>
							isParentNode(c) ? c.size : c.values.length,
						) ?? [0],
					)
				: undefined,
	};
	const rightValues = child.values.slice(split + 1);
	const rightChildren = isParentNode(child)
		? child.children.slice(split + 1)
		: undefined;
	const rightNode = {
		values: rightValues,
		children: rightChildren,
		size:
			rightChildren !== undefined
				? rightValues.length +
					sum(
						rightChildren?.map((c) =>
							isParentNode(c) ? c.size : c.values.length,
						) ?? [0],
					)
				: undefined,
	};
	node.values.splice(index, 0, promotedValue);
	const children = node.children;
	const newChildren = children.toSpliced(index, 1, leftNode, rightNode); // Corrected line
	node.children = newChildren;
};

const mergeChildren = <T>(
	node: ParentNode<T>,
	index: number,
	direction: 1 | -1,
) => {
	const sourceChild = node.children[index];
	const destinationChild = node.children[index + direction];
	if (sourceChild === undefined) {
		throw new Error("No child to merge");
	}
	if (destinationChild === undefined) {
		throw new Error("No child to merge into");
	}
	const promotedValue = node.values[index];
	if (promotedValue === undefined) {
		throw new Error("No value found to demote");
	}
	destinationChild.values =
		direction === 1
			? [...sourceChild.values, promotedValue, ...destinationChild.values]
			: [...destinationChild.values, promotedValue, ...sourceChild.values];
	if (isParentNode(sourceChild) && isParentNode(destinationChild)) {
		destinationChild.children = [
			...sourceChild.children,
			...destinationChild.children,
		];
		destinationChild.size += sourceChild.size + 1;
	}
	node.children.splice(index, 1);
	node.values.splice(index, 1);
};

const balance = <T>(node: ParentNode<T>) => {
	const minNodes = Math.floor(MAX_NODES / 2);
	const underFilledChildren = node.children.filter(
		({ values }) => values.length < minNodes,
	);
	for (const underFilledChild of underFilledChildren) {
		const index = node.children.indexOf(underFilledChild);
		const missing = minNodes - underFilledChild.values.length;
		if (index < 0) {
			continue;
		}

		const leaning = index < node.children.length / 2;
		const options = leaning
			? ([1 as const, -1 as const] as const)
			: ([-1 as const, 1 as const] as const);
		const workingDirection = options.find((option) => {
			const sibling =
				node.children[node.children.indexOf(underFilledChild) + option];
			return (
				sibling !== undefined && sibling.values.length - missing >= minNodes
			);
		});
		// If there's a sibling with enough values, rotate values from sibling
		if (workingDirection !== undefined) {
			rotate(
				node,
				index + workingDirection,
				-workingDirection as 1 | -1,
				missing,
			);
			continue;
		}
		mergeChildren(node, index, options[0]);
	}

	const overFilledChildren = node.children.filter(
		({ values }) => values.length > MAX_NODES,
	);

	for (const overFilledChild of overFilledChildren) {
		const index = node.children.indexOf(overFilledChild);
		const overflowing = overFilledChild.values.length - MAX_NODES;
		const leaning = index < node.children.length / 2;
		const options = leaning
			? [1 as const, -1 as const]
			: [-1 as const, 1 as const];
		const workingDirection = options.find((option) => {
			const sibling =
				node.children[node.children.indexOf(overFilledChild) + option];
			return (
				sibling !== undefined &&
				sibling.values.length + overflowing <= MAX_NODES
			);
		});
		if (workingDirection !== undefined) {
			rotate(node, index, workingDirection as 1 | -1, overflowing);
			continue;
		}
		splitChild(node, index);
	}
};

export const insert = <T>(
	node: Node<T>,
	t: T,
	comparator: (a: T, b: T) => boolean,
) => {
	checkForDuplicates(node);
	const matchingIndex = node.values.findIndex((value) => !comparator(t, value));
	const index = matchingIndex === -1 ? node.values.length : matchingIndex;
	if (!isParentNode(node)) {
		node.values.splice(index, 0, t);
		return;
	}
	const child = node.children?.[index];
	if (child === undefined) {
		throw new Error("Child not found");
	}
	node.size++;
	insert(child, t, comparator);
	balance(node);
	checkForDuplicates(node);
};

export const removeMin = <T>(
	node: Node<T>,
	comparator: (a: T, b: T) => boolean,
): T | undefined => {
	if (!isParentNode(node) || node.children[0] === undefined) {
		const min = node.values[0];
		node.values.splice(0, 1);
		return min;
	}
	node.size--;
	const min = removeMin(node.children[0], comparator);
	balance(node);
	return min;
};

export const removeMax = <T>(
	node: Node<T>,
	comparator: (a: T, b: T) => boolean,
): T | undefined => {
	const lastChild = isParentNode(node)
		? node.children[node.children.length - 1]
		: undefined;
	if (!isParentNode(node) || lastChild === undefined) {
		const max = node.values[node.values.length - 1];
		node.values.splice(node.values.length - 1, 1);
		return max;
	}
	node.size--;
	const max = removeMax(lastChild, comparator);
	balance(node);
	return max;
};

export const min = <T>(node: Node<T>): T | undefined => {
	const firstChildNode = isParentNode(node) ? node.children[0] : undefined;
	if (firstChildNode !== undefined) {
		return min(firstChildNode);
	}
	return node.values[0];
};

export const max = <T>(node: Node<T>): T | undefined => {
	const lastChildNode = isParentNode(node)
		? node.children[node.children.length - 1]
		: undefined;
	if (lastChildNode !== undefined) {
		return max(lastChildNode);
	}
	return node.values[node.values.length - 1];
};

const size = <T>(node: Node<T>): number => {
	return isParentNode(node) ? node.size : node.values.length;
};

export const stringify = <T>(
	node: Node<T>,
	print?: (t: T) => string,
): string => {
	const printValue = print ?? ((t) => JSON.stringify(t));
	if (!isParentNode(node)) {
		return `{${node.values.map((value) => printValue(value)).join("")}}`;
	}
	return `{${node.children[0] ? stringify(node.children[0], print) : ""}${zip(
		node.values,
		node.children?.slice(1, 1 + node.values.length),
	)
		.map(([value, child]) => `${printValue(value)}${stringify(child, print)}`)
		.join("")}}`;
};

export const BTree = <T>(
	initialValues: T[],
	comparator: (a: T, b: T) => boolean,
) => {
	let root: Node<T> = { values: [] };
	const tree = {
		min: () => min(root),
		max: () => max(root),
		insert: (t: T) => {
			insert(root, t, comparator);
			if (root.values.length > MAX_NODES) {
				root = {
					values: [],
					children: [root],
					size: root.values.length,
				} as ParentNode<T>;
				if (!isParentNode(root)) {
					throw new Error("Failed to split root");
				}
				balance(root);
			}
		},
		popMin: () => {
			const min = removeMin(root, comparator);
			if (
				isParentNode(root) &&
				root.children.length === 1 &&
				root.children[0] !== undefined
			) {
				root = root.children[0];
			}
			return min;
		},
		popMax: () => {
			const max = removeMax(root, comparator);
			if (
				isParentNode(root) &&
				root.children.length === 1 &&
				root.children[0] !== undefined
			) {
				root = root.children[0];
			}
			return max;
		},
		size: () => (isParentNode(root) ? root.size : root.values.length),
		root: () => root,
	};
	for (const value of initialValues) {
		tree.insert(value);
	}
	return tree;
};
