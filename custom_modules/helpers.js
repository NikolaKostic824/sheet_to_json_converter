/**
 * Function to convert input value to camelCase.
 * @param {string} input - The input value to be converted.
 * @returns {string} - The input value converted to camelCase.
 */
export const toCamelCase = (input) => {
  return input
    .toLowerCase() // Convert input to lowercase
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()) // Replace non-alphanumeric characters with uppercase characters
    .trim(); // Trim any leading or trailing whitespace
};
