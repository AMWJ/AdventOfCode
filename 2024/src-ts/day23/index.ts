import { readLines } from "../utils/file";

export const parse = async () => {
	const lines = await readLines(`${__dirname}/input.txt`);
	return lines
		.map((line) => line.split("-"))
		.map(([from, to]) => [from ?? "", to ?? ""] as const);
};

export const star1 = async () => {
	const connectionLines = await parse();
	const connections: { [key: string]: Set<string> } = {};
	let count = 0;
	for (const [from, to] of connectionLines) {
		connections[from] = connections[from] || new Set<string>();
		connections[from].add(to);
		connections[to] = connections[to] || new Set<string>();
		connections[to].add(from);
	}
	const tsCompleted = new Set<string>();
	for (const [from, to] of Object.entries(connections).filter(([from]) =>
		from.startsWith("t"),
	)) {
		const toList = [];
		for (const toItem1 of to) {
			if (tsCompleted.has(toItem1)) {
				continue;
			}
			for (const toItem2 of toList) {
				if (tsCompleted.has(toItem2)) {
					continue;
				}
				if (connections?.[toItem1]?.has(toItem2)) {
					count++;
				}
			}
			toList.push(toItem1);
		}
		tsCompleted.add(from);
	}
	return count;
};

export const star2 = async () => {
	const connectionLines = await parse();
	const connections: { [key: string]: Set<string> } = {};
	const nodes = new Set<string>();
	for (let [from, to] of connectionLines) {
		nodes.add(from);
		nodes.add(to);
		[from, to] = from < to ? [from, to] : [to, from];
		connections[from] = connections[from] || new Set<string>();
		connections[from]?.add(to);
	}
	const nodeList = nodes.values().toArray().toSorted();
	const queue = Object.entries(connections).flatMap(([from, to]) =>
		Array.from(to.values()).map((to) => [from, to]),
	);
	while (true) {
		const nodeNetwork = queue.shift();
		if (queue.length === 0) {
			return nodeNetwork?.join(",");
		}
		const lastNode = nodeNetwork?.[nodeNetwork.length - 1];
		if (lastNode === undefined) {
			throw new Error("lastNode is undefined");
		}
		for (const nodeToAdd of nodeList.slice(nodeList.indexOf(lastNode) + 1)) {
			if (nodeNetwork?.every((node) => connections?.[node]?.has(nodeToAdd))) {
				const newNetwork = [...nodeNetwork, nodeToAdd];
				queue.push(newNetwork);
			}
		}
	}
};
