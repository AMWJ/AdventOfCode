import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { argv } from "node:process";

const main = async () => {
	if (argv.length < 3) {
		console.log("Usage: node index.ts <input>");
		return;
	}
	const day = argv[2];

	try {
		await import(`./day${day}`);
	} catch (e) {
		console.log(e);
		const files = await readdir("./src-ts/template/");
		mkdir(`./src-ts/day${day}`);
		for (const file of files) {
			await writeFile(
				`./src-ts/day${day}/${file}`,
				await readFile(`./src-ts/template/${file}`, "utf-8"),
			);
		}
	}
	const { star1, star2 } = await import(`./day${day}`);

	if (star1) {
		console.log("Found star1", await star1());
	}
	if (star2) {
		console.log("Found star2", await star2());
	}
};

main();
