const displayFileInformation = (file, fileIndicator, buttons) => {
  if (file) {
    fileIndicator.textContent = file.name;
    buttons.addRowButton.disabled = false;
    buttons.automaticDownloadButton.disabled = false;
  } else {
    fileIndicator.textContent = "No file selected";
    buttons.addRowButton.disabled = true;
    buttons.automaticDownloadButton.disabled = true;
  }
};

const processExcelFile = async (
  file,
  updateRowNames,
  updateAvailableOptions,
  updateJSONData
) => {
  try {
    let workbook = await XlsxPopulate.fromDataAsync(file);
    let firstSheet = workbook.sheet(0);
    let jsonDataTemp = firstSheet.usedRange().value();

    if (!Array.isArray(jsonDataTemp) || jsonDataTemp.length === 0) {
      throw new Error("Invalid data format in Excel file");
    }

    let tempExcelRowsNames = jsonDataTemp.shift();
    const tempReplaced = tempExcelRowsNames.map((item) =>
      item !== undefined ? item : "unknown"
    );
    await updateJSONData(jsonDataTemp);
    updateRowNames(tempReplaced);

    const updatedOptions = Array.from(
      { length: jsonDataTemp[0].length },
      (_, index) => index + 1
    );

    updateAvailableOptions(updatedOptions);
  } catch (error) {
    console.error("Error processing Excel file:", error.message);
    // You can provide user-friendly error messages or handle the error accordingly
  }
};

export const handleExcelFileInputChange = async (
  event,
  buttons,
  updateAvailableOptions,
  fileIndicator,
  updateRowNames,
  updateJSONData
) => {
  try {
    let file = event.target.files[0];

    if (!file || !file.name.endsWith(".xlsx")) {
      throw new Error("Please select a valid Excel file");
    }

    displayFileInformation(file, fileIndicator, buttons);

    await processExcelFile(
      file,
      updateRowNames,
      updateAvailableOptions,
      updateJSONData
    );
  } catch (error) {
    console.error("Error handling Excel file input:", error.message);
    // You can provide user-friendly error messages or handle the error accordingly
  }
};
