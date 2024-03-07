/**
 * This is the function that runs after the application starts
 * @param hookFuncs - an array of async functions
 * @returns
 */
export const afterStart = async (...hookFuncs: (() => Promise<void>)[]) => {
  return Promise.all(hookFuncs);
};

/**
 * The function that runs before a migration
 * @param hookFuncs - an array of async functions
 * @returns
 */
export const beforeMigrate = async (...hookFuncs: (() => Promise<void>)[]) => {
  return Promise.all(hookFuncs);
};

/**
 * The function that runs after a migration
 * @param hookFuncs - an array of async functions
 * @returns
 */
export const afterMigrate = async (...hookFuncs: (() => Promise<void>)[]) => {
  return Promise.all(hookFuncs);
};
