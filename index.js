import { createRow } from "./custom_modules/rowManipulation.js";
import {
  createJson,
  createAutomaticJson,
  downloadJSON,
} from "./custom_modules/jsonManipulation.js";
import { handleExcelFileInputChange } from "./custom_modules/fileManipulation.js";
// Wait for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", () => {
  // Buttons
  let buttons = {
    addRowButton: null,
    downloadButton: null,
    automaticDownloadButton: null,
  };
  // Get references to the DOM elements and
  let rowsContainer,
    excelFileInput,
    fileIndicator,
    data,
    jsonData,
    addedRows,
    availableOptions,
    excelRowsNames;
  // Initialize references to the DOM elements
  const initializeElements = () => {
    buttons.addRowButton = document.getElementById("addRow");
    rowsContainer = document.getElementById("rows");
    excelFileInput = document.getElementById("excelFileInput");
    fileIndicator = document.getElementById("fileIndicator");
    buttons.downloadButton = document.getElementById("download-btn");
    buttons.automaticDownloadButton = document.getElementById(
      "automatic-download-btn"
    );
  };

  const initializeDataStore = () => {
    // Store added rows and available options
    data = [];
    jsonData = [];
    addedRows = {};
    availableOptions = [];
    // All excel rows names
    excelRowsNames = [];
  };
  // Setters
  const updateAvailableOptions = (updatedOptions) =>
    (availableOptions = updatedOptions);
  const updateRowNames = (rowNames) => (excelRowsNames = rowNames);
  const updateJSONData = (data) => (jsonData = data);

  // Setup event listeners
  const setupEventListeners = () => {
    // Add event listener to the "Add Row" button to create a new row
    buttons.addRowButton.addEventListener("click", () =>
      createRow(
        buttons,
        rowsContainer,
        availableOptions,
        addedRows,
        excelRowsNames
      )
    );
    // Add event listener to the chose excel file to handle pareser
    excelFileInput.addEventListener("change", (e) => {
      try {
        handleExcelFileInputChange(
          e,
          buttons,
          updateAvailableOptions,
          fileIndicator,
          updateRowNames,
          updateJSONData
        );
      } catch (error) {
        console.error("Error handling Excel file input change:", error);
      }
    });
    // Add event listener to the download button
    buttons.downloadButton.addEventListener("click", async () => {
      try {
        data = await createJson(jsonData, addedRows, data, availableOptions);
        downloadJSON(data, "custom");
      } catch (error) {
        console.error("Error creating or downloading custom JSON:", error);
        // Add specific error handling or notify the user about the issue.
      }
    });
    buttons.automaticDownloadButton.addEventListener("click", async () => {
      try {
        data = await createAutomaticJson(jsonData, excelRowsNames);
        downloadJSON(data, "automatic");
      } catch (error) {
        console.error("Error creating or downloading custom JSON:", error);
        // Add specific error handling or notify the user about the issue.
      }
    });
  };
  // Main initializer
  const initialize = () => {
    initializeElements();
    initializeDataStore();
    setupEventListeners();
  };
  // Run main initializer
  initialize();
});
