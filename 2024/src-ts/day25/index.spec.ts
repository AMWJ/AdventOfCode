import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect({ value: await star1() }).toMatchInlineSnapshot(
			{
				value: 3608,
			},
			`
{
  "value": 3608,
}
`,
		);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect({ value: await star2() }).toMatchInlineSnapshot({
  value: undefined
}, `
{
  "value": undefined,
}
`);
	});
});
