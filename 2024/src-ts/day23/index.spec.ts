import { describe } from "node:test";
import { star1, star2 } from "./index";

describe("star1", () => {
	it("should be correct", async () => {
		expect({ value: await star1() }).toMatchInlineSnapshot({
  value: 1046
}, `
{
  "value": 1046,
}
`);
	});
});

describe("star2", () => {
	it("should be correct", async () => {
		expect({ value: await star2() }).toMatchInlineSnapshot({
  value: "de,id,ke,ls,po,sn,tf,tl,tm,uj,un,xw,yz"
}, `
{
  "value": "de,id,ke,ls,po,sn,tf,tl,tm,uj,un,xw,yz",
}
`);
	});
});
