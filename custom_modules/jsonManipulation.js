import { toCamelCase } from "./helpers.js";

// Function to create JSON data based on added rows
const createJsonData = (row, addedRows) => {
  const jsonObj = {};
  // Iterate over addedRows and map the values to corresponding row indices
  for (const [key, value] of Object.entries(addedRows)) {
    const index = value - 1;
    // Check if index is valid before accessing row
    if (index >= 0 && index < row.length) {
      jsonObj[key] = row[index];
    } else {
      // Handle invalid index (e.g., log a warning, provide a default value, etc.)
      jsonObj[key] = null;
    }
  }
  return jsonObj;
};

// Function to create JSON data automatically from column names
const createAutomaticJsonData = (row, columnNames) => {
  const jsonObj = {};
  columnNames.forEach((e, i) => {
    // Check if index is valid before accessing row
    if (i >= 0 && i < row.length) {
      jsonObj[toCamelCase(e)] = row[i];
    } else {
      // Handle invalid index (e.g., log a warning, provide a default value, etc.)
      jsonObj[toCamelCase(e)] = null;
    }
  });
  return jsonObj;
};

// Function to create JSON from data
export const createJson = async (jsonData, addedRows) => {
  const data = [];
  for (const row of jsonData) {
    const jsonObj = createJsonData(row, addedRows);
    data.push(jsonObj);
  }
  return data;
};

// Function to create automatic JSON from data
export const createAutomaticJson = async (jsonData, columnNames) => {
  const data = [];
  for (const row of jsonData) {
    const jsonObj = createAutomaticJsonData(row, columnNames);
    data.push(jsonObj);
  }
  return data;
};

// Function to download JSON file
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
    // Handle JSON stringification error (e.g., log the error, notify the user, etc.)
    console.error("Error creating JSON:", error);
  }
};
