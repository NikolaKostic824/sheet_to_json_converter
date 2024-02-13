import { toCamelCase } from "./helpers.js";

/**
 * Function to create JSON data based on added rows.
 * @param {Array} row - The row data from the Excel file.
 * @param {Object} addedRows - Object containing the added row indices.
 * @returns {Object} - JSON object created from the row data and added rows.
 */
const createJsonData = (row, addedRows) => {
  const jsonObj = {};
  for (const [key, value] of Object.entries(addedRows)) {
    const index = value - 1;
    if (index >= 0 && index < row.length) {
      jsonObj[key] = row[index];
    } else {
      // Handle invalid index
      jsonObj[key] = null;
    }
  }
  return jsonObj;
};

/**
 * Function to create JSON data automatically from column names.
 * @param {Array} row - The row data from the Excel file.
 * @param {Array} columnNames - Array containing column names.
 * @returns {Object} - JSON object created automatically from the row data and column names.
 */
const createAutomaticJsonData = (row, columnNames) => {
  const jsonObj = {};
  columnNames.forEach((e, i) => {
    if (i >= 0 && i < row.length) {
      jsonObj[toCamelCase(e)] = row[i];
    } else {
      // Handle invalid index
      jsonObj[toCamelCase(e)] = null;
    }
  });
  return jsonObj;
};

/**
 * Function to create JSON from data.
 * @param {Array} jsonData - Array of row data from the Excel file.
 * @param {Object} addedRows - Object containing the added row indices.
 * @returns {Array} - Array of JSON objects created from the row data and added rows.
 */
export const createJson = async (jsonData, addedRows) => {
  const data = [];
  for (const row of jsonData) {
    const jsonObj = createJsonData(row, addedRows);
    data.push(jsonObj);
  }
  return data;
};

/**
 * Function to create automatic JSON from data.
 * @param {Array} jsonData - Array of row data from the Excel file.
 * @param {Array} columnNames - Array containing column names.
 * @returns {Array} - Array of JSON objects created automatically from the row data and column names.
 */
export const createAutomaticJson = async (jsonData, columnNames) => {
  const data = [];
  for (const row of jsonData) {
    const jsonObj = createAutomaticJsonData(row, columnNames);
    data.push(jsonObj);
  }
  return data;
};

/**
 * Function to download JSON file.
 * @param {Array} data - Array of JSON data to be downloaded.
 * @param {string} type - Type of JSON file to be downloaded ("automatic" or "custom").
 */
export const downloadJSON = (data, type) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download =
      type === "automatic" ? "automatic_data.json" : "custom_data.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    // Handle JSON stringification error
    console.error("Error creating JSON:", error);
  }
};
