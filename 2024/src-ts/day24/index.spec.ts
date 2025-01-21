import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect({ value: await star1() }).toMatchInlineSnapshot(
			{
				value: 56278503604006,
			},
			`
{
  "value": 56278503604006,
}
`,
		);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect({ value: await star2() }).toMatchInlineSnapshot({
  value: "bhd,brk,dhg,dpd,nbf,z06,z23,z38"
}, `
{
  "value": "bhd,brk,dhg,dpd,nbf,z06,z23,z38",
}
`);
	});
});
