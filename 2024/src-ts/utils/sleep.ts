/**
 * @deprecated This method is for debugging purposes only. Delete its usage once the code is correct.
 */
export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
