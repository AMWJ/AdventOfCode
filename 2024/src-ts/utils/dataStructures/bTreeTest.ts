import { assert, error } from "node:console";
import { BTree, stringify } from "./bTree";

const arrays = [
	{
		array: [5, 6, 2, 3, 1, 7, 10, 11, 12, 13, -4],
		adding: [
			"{5}",
			"{56}",
			"{{2}5{6}}",
			"{{23}5{6}}",
			"{{1}2{3}5{6}}",
			"{{1}2{3}5{67}}",
			"{{{1}2{3}}5{{6}7{10}}}",
			"{{{1}2{3}}5{{6}7{1011}}}",
			"{{{1}2{3}}5{{6}7{10}11{12}}}",
			"{{{1}2{3}}5{{6}7{10}11{1213}}}",
			"{{{-41}2{3}}5{{6}7{10}11{1213}}}",
		],
		popping: [
			"{{{1}2{3}}5{{6}7{10}11{1213}}}",
			"{{{23}5{6}}7{{10}11{1213}}}",
			"{{{3}5{6}}7{{10}11{1213}}}",
			"{{56}7{10}11{1213}}",
			"{{6}7{10}11{1213}}",
			"{{710}11{1213}}",
			"{{10}11{1213}}",
			"{{11}12{13}}",
			"{1213}",
			"{13}",
			"{}",
		],
	},
	{
		array: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		adding: [
			"{1}",
			"{12}",
			"{{1}2{3}}",
			"{{1}2{34}}",
			"{{1}2{3}4{5}}",
			"{{1}2{3}4{56}}",
			"{{{1}2{3}}4{{5}6{7}}}",
			"{{{1}2{3}}4{{5}6{78}}}",
			"{{{1}2{3}}4{{5}6{7}8{9}}}",
		],
		popping: [
			"{{{23}4{5}}6{{7}8{9}}}",
			"{{{3}4{5}}6{{7}8{9}}}",
			"{{45}6{7}8{9}}",
			"{{5}6{7}8{9}}",
			"{{67}8{9}}",
			"{{7}8{9}}",
			"{89}",
			"{9}",
			"{}",
		],
	},
];

for (const { array, adding, popping } of arrays) {
	const tree = BTree<number>([], (a, b) => a > b);
	if (tree.size() !== 0) {
		error("Expected empty tree");
	}
	for (const [i, value] of array.entries()) {
		tree.insert(value);
		if (stringify(tree.root()) !== (adding[i] ?? "")) {
			error(`Expected ${adding[i]}, got ${stringify(tree.root())}`);
		}
	}
	for (const [i, _] of array.entries()) {
		const min = tree.popMin();
		if (stringify(tree.root()) !== popping[i]) {
			error(`Expected ${popping[i]}, got ${stringify(tree.root())}`);
		}
	}
}
