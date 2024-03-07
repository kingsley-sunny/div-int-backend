/**
 * This is the function that runs after the application starts
 * @param hookFuncs - an array of async functions
 * @returns
 */
export const afterStart = async (...hookFuncs: (() => Promise<void>)[]) => {
  try {
    hookFuncs.forEach(async func => {
      Promise.resolve(func());
    });
  } catch (error: any) {
    Promise.reject(error);
  }
};

/**
 * The function that runs before a migration
 * @param hookFuncs - an array of async functions
 * @returns
 */
export const beforeMigrate = async (...hookFuncs: (() => Promise<void>)[]) => {
  try {
    hookFuncs.forEach(async func => {
      Promise.resolve(func());
    });
  } catch (error: any) {
    Promise.reject(error);
  }
};

/**
 * The function that runs after a migration
 * @param hookFuncs - an array of async functions
 * @returns
 */
export const afterMigrate = async (...hookFuncs: (() => Promise<void>)[]) => {
  try {
    hookFuncs.forEach(async func => {
      Promise.resolve(func());
    });
  } catch (error: any) {
    Promise.reject(error);
  }
};
