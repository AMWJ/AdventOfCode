import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect({ value: await star1() }).toMatchInlineSnapshot({ value: 4905 }, `
{
  "value": 4905,
}
`);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect({ value: await star2() }).toMatchInlineSnapshot({ value: 6204 }, `
{
  "value": 6204,
}
`);
	});
});
