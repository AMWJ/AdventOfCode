import type { Config } from "jest";

const config: Config = {
	modulePathIgnorePatterns: ["template/"],
	verbose: false,
	preset: "ts-jest",
};

export default config;
