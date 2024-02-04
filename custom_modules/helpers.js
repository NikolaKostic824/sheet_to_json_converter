// Function to change input value to camelCase
export const toCamelCase = (input) => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .trim();
};
