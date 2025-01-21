import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect({ value: await star1() }).toMatchInlineSnapshot({
  value: 6432869891895
}, `
{
  "value": 6432869891895,
}
`);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect({ value: await star2() }).toMatchInlineSnapshot({
  value: 6467290479134
}, `
{
  "value": 6467290479134,
}
`);
	});
});
