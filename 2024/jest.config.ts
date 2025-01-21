import type { Config } from "jest";

const config: Config = {
	modulePathIgnorePatterns: ["template/"],
	verbose: false,
	preset: "ts-jest",
	testTimeout: 500,
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	moduleFileExtensions: ["ts", "js"],
};

export default config;
