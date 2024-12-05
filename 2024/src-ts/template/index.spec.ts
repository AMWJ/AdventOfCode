import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect(await star1()).toMatchInlineSnapshot(Number.NaN);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect(await star2()).toMatchInlineSnapshot(Number.NaN);
	});
});