/**
 * Function to display file information and update button states based on the selected file.
 * @param {File} file - The selected file from the input.
 * @param {HTMLElement} fileIndicator - The element to display file information.
 * @param {Object} buttons - Object containing references to buttons.
 */
const displayFileInformation = (file, fileIndicator, buttons) => {
  if (file) {
    // Display the name of the selected file
    fileIndicator.textContent = file.name;
    // Enable buttons for adding rows and downloading JSON
    buttons.addRowButton.disabled = false;
    buttons.automaticDownloadButton.disabled = false;
  } else {
    // If no file is selected, display a message and disable buttons
    fileIndicator.textContent = "No file selected";
    buttons.addRowButton.disabled = true;
    buttons.automaticDownloadButton.disabled = true;
  }
};

/**
 * Function to process the Excel file and update UI elements with extracted data.
 * @param {File} file - The Excel file to process.
 * @param {Function} updateRowNames - Function to update row names in UI.
 * @param {Function} updateAvailableOptions - Function to update available options in UI.
 * @param {Function} updateJSONData - Function to update JSON data in UI.
 */
const processExcelFile = async (
  file,
  updateRowNames,
  updateAvailableOptions,
  updateJSONData
) => {
  try {
    // Load Excel workbook
    let workbook = await XlsxPopulate.fromDataAsync(file);
    // Get the first sheet
    let firstSheet = workbook.sheet(0);
    // Extract data from the used range of the first sheet
    let jsonDataTemp = firstSheet.usedRange().value();

    // Check if the data is in the correct format
    if (!Array.isArray(jsonDataTemp) || jsonDataTemp.length === 0) {
      throw new Error("Invalid data format in Excel file");
    }

    // Extract row names and handle undefined values
    let tempExcelRowsNames = jsonDataTemp.shift();
    const tempReplaced = tempExcelRowsNames.map((item) =>
      item !== undefined ? item : "unknown"
    );

    // Update UI with extracted JSON data and row names
    await updateJSONData(jsonDataTemp);
    updateRowNames(tempReplaced);

    // Update available options based on the number of columns in the data
    const updatedOptions = Array.from(
      { length: jsonDataTemp[0].length },
      (_, index) => index + 1
    );
    updateAvailableOptions(updatedOptions);
  } catch (error) {
    console.error("Error processing Excel file:", error.message);
    // Handle errors gracefully and provide user-friendly error messages
  }
};

/**
 * Function to handle changes in the Excel file input.
 * @param {Event} event - The change event triggered by the file input.
 * @param {Object} buttons - Object containing references to buttons.
 * @param {Function} updateAvailableOptions - Function to update available options in UI.
 * @param {HTMLElement} fileIndicator - The element to display file information.
 * @param {Function} updateRowNames - Function to update row names in UI.
 * @param {Function} updateJSONData - Function to update JSON data in UI.
 */
export const handleExcelFileInputChange = async (
  event,
  buttons,
  updateAvailableOptions,
  fileIndicator,
  updateRowNames,
  updateJSONData
) => {
  try {
    // Get the selected file from the input
    let file = event.target.files[0];

    // Check if a valid Excel file is selected
    if (!file || !file.name.endsWith(".xlsx")) {
      throw new Error("Please select a valid Excel file");
    }

    // Display file information and enable/disable buttons
    displayFileInformation(file, fileIndicator, buttons);

    // Process the selected Excel file
    await processExcelFile(
      file,
      updateRowNames,
      updateAvailableOptions,
      updateJSONData
    );
  } catch (error) {
    console.error("Error handling Excel file input:", error.message);
    // Handle errors gracefully and provide user-friendly error messages
  }
};
