/*
  To accomplish a persistent state per user environment we will use core
  localstorage API and its getItem and setItem methods. 
 */

/**
 * Loads the serialized state from localstorage and parses it
 * @return {object/undefined} The parsed json or undefined
 */
export const loadStorage = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

/**
 * Serializes and saves the state to localstorage
 */
export const saveStorage = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

/**
 * Clears local storage
 */
export const clearStorage = () => {
  localStorage.clear();
};
