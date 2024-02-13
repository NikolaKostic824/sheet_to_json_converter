/**
 * Function to update available options in the state.
 * @param {Object} state - The state object containing available options.
 * @param {number[]} updatedOptions - The updated array of available options.
 */
export const updateAvailableOptions = (state, updatedOptions) => {
  state.availableOptions = updatedOptions;
};

/**
 * Function to update row names in the state.
 * @param {Object} state - The state object containing row names.
 * @param {string[]} rowNames - The updated array of row names.
 */
export const updateRowNames = (state, rowNames) => {
  state.excelRowsNames = rowNames;
};

/**
 * Function to update JSON data in the state.
 * @param {Object} state - The state object containing JSON data.
 * @param {Object[]} newData - The updated JSON data.
 */
export const updateJSONData = (state, newData) => {
  state.jsonData = newData;
};
