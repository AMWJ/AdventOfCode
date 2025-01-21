import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect({ value: await star1() }).toMatchInlineSnapshot({
  value: "7,1,3,4,1,2,6,7,1"
}, `
{
  "value": "7,1,3,4,1,2,6,7,1",
}
`);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect({ value: await star2() }).toMatchInlineSnapshot({
  value: 109019476330651
}, `
{
  "value": 109019476330651,
}
`);
	});
});
