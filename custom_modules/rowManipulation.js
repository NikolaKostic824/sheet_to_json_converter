import { toCamelCase } from "./helpers.js";

const createHTMLInput = (type, placeholder, className) => {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  if (className != null) {
    input.classList.add(className);
  }
  return input;
};

const createHTMLRow = (customClass) => {
  // Create elements for the new row
  const row = document.createElement("div");
  if (customClass != null) {
    row.classList.add(customClass);
  }
  return row;
};

const createHTMLSelect = (className) => {
  const select = document.createElement("select");
  if (className != null) {
    select.classList.add(className);
  }
  return select;
};

const createHTMLButton = (btnTxt, customClass, disabled) => {
  const btn = document.createElement("button");
  btn.textContent = btnTxt;
  if (customClass != null) {
    btn.classList.add(customClass);
  }
  btn.disabled = disabled;
  return btn;
};
const createDeleteButton = (
  input,
  select,
  keyValueElement,
  selectedValue,
  availableOptions,
  rowsContainer,
  addedRows,
  buttons,
  rowNames
) => {
  const deleteButton = createHTMLButton("Delete", "delete-button", false);

  deleteButton.addEventListener("click", () => {
    deleteRow(
      keyValueElement,
      input.value,
      selectedValue,
      select,
      availableOptions,
      rowsContainer,
      addedRows,
      buttons,
      rowNames
    );
  });

  return deleteButton;
};
const appendHTML = (rowsContainer, row, input, select, btn) => {
  row.appendChild(input);
  row.appendChild(select);
  row.appendChild(btn);
  rowsContainer.appendChild(row);
};
const createHTMLOption = (value, text, isDisabled) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  option.disabled = isDisabled ? true : false;
  option.selected = isDisabled ? true : false;
  option.hidden = isDisabled ? true : false;
  option.dataset.rowName = text;
  return option;
};
// Function to remove elements of a row
const removeRowElements = (row, input, select, btn) => {
  row.removeChild(input);
  row.removeChild(select);
  row.removeChild(btn);
};

const createHTMLDiv = (customClass, text) => {
  const div = document.createElement("div");
  div.classList.add(customClass);
  div.textContent = text;
  return div;
};

//
const createRowText = (inputValue, selectedValue, addedRows, rowNames) => {
  const camelCaseInput = toCamelCase(inputValue);
  addedRows[camelCaseInput] = parseInt(selectedValue, 10);
  const rowText = `"${inputValue}": ${rowNames[addedRows[camelCaseInput] - 1]}`;
  return rowText;
};
// Function to create a new row
export const createRow = (
  buttons,
  rowsContainer,
  availableOptions,
  addedRows,
  rowNames
) => {
  buttons.addRowButton.disabled = true; // Disable the "Add Row" button temporarily
  const row = createHTMLRow("row");
  const select = createHTMLSelect("select-row");
  const input = createHTMLInput("text", "Input value", null);
  updateSelectOptions(select, availableOptions, rowNames);
  const confirmButton = createHTMLButton("Confirm", null, true);

  // Add event listeners to input and select for validation
  input.addEventListener("input", (e) => {
    validateForm(input, select, confirmButton);
    const newValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    e.target.value = newValue;
  });
  // validate select options
  select.addEventListener("change", () => {
    validateForm(input, select, confirmButton);
  });

  // Handle the confirmation of the row
  confirmButton.addEventListener("click", () => {
    if (!confirmButton.disabled) {
      const selectedValue = select.value;
      if (selectedValue !== "Select an option") {
        const divText = createRowText(
          input.value,
          selectedValue,
          addedRows,
          rowNames
        );
        const keyValueElement = createHTMLDiv("key-value-element", divText);
        const deleteButton = createDeleteButton(
          input,
          select,
          keyValueElement,
          selectedValue,
          availableOptions,
          rowsContainer,
          addedRows,
          buttons,
          rowNames
        );

        keyValueElement.appendChild(deleteButton);
        rowsContainer.appendChild(keyValueElement);

        removeRowElements(row, input, select, confirmButton);
        rowsContainer.removeChild(row);

        const optionToRemoveIndex = availableOptions.indexOf(
          parseInt(selectedValue, 10)
        );
        if (optionToRemoveIndex !== -1) {
          availableOptions.splice(optionToRemoveIndex, 1);
        }

        buttons.addRowButton.disabled = false; // Re-enable the "Add Row" button
        buttons.downloadButton.disabled = false; // Re-enable the "Download" button
      }
    }
  });

  // Append elements to the row and rows container
  appendHTML(rowsContainer, row, input, select, confirmButton);
  validateForm(input, select, confirmButton); // Initial validation
};

// Function to delete row
const deleteRow = (
  keyValueElement,
  inputValue,
  selectedValue,
  select,
  availableOptions,
  rowsContainer,
  addedRows,
  buttons,
  rowNames
) => {
  rowsContainer.removeChild(keyValueElement);
  delete addedRows[inputValue];
  availableOptions.push(parseInt(selectedValue, 10));
  availableOptions.sort((a, b) => a - b);
  updateSelectOptions(select, availableOptions, rowNames);
  buttons.addRowButton.disabled = false;
  buttons.downloadButton.disabled = Object.keys(addedRows).length === 0; // Disable the "Download"
};
// Function to update the options in the select element
const updateSelectOptions = (select, availableOptions, rowNames) => {
  select.innerHTML = "";
  const option = createHTMLOption("", "Select an option", true);
  select.appendChild(option);
  availableOptions.forEach((optionValue) => {
    const rowIndex = optionValue - 1;
    const rowName = rowNames[rowIndex] || "No Row Name";
    const optionString = `${optionValue} - ${rowName}`;
    const option = createHTMLOption(optionValue, optionString, false);
    select.appendChild(option);
  });
};

// Function to validate the form
const validateForm = (input, select, confirmButton) => {
  const isInputValid = input.value.trim() !== "";
  const isSelectValid = select.value !== "Select an option";
  confirmButton.disabled = !(isInputValid && isSelectValid);
};
