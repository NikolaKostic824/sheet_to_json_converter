// Function to update available options
export const updateAvailableOptions = (state, updatedOptions) => {
  state.availableOptions = updatedOptions;
};

// Function to update row names
export const updateRowNames = (state, rowNames) => {
  state.excelRowsNames = rowNames;
};

// Function to update JSON data
export const updateJSONData = (state, newData) => {
  state.jsonData = newData;
};
