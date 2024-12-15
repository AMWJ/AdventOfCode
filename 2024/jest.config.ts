import type { Config } from "jest";

const config: Config = {
	modulePathIgnorePatterns: ["template/"],
	verbose: false,
	preset: "ts-jest",
	reporters: ["default"],
};

export default config;
