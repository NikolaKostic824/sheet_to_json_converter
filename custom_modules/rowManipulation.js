import { toCamelCase } from "./helpers.js";

/**
 * Function to create an HTML input element.
 * @param {string} type - The type of the input element.
 * @param {string} placeholder - The placeholder text for the input element.
 * @param {string} className - The class name for the input element.
 * @returns {HTMLInputElement} - The created HTML input element.
 */
const createHTMLInput = (type, placeholder, className) => {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  if (className != null) {
    input.classList.add(className);
  }
  return input;
};

/**
 * Function to create an HTML row element.
 * @param {string} customClass - The custom class for the row element.
 * @returns {HTMLDivElement} - The created HTML row element.
 */
const createHTMLRow = (customClass) => {
  const row = document.createElement("div");
  if (customClass != null) {
    row.classList.add(customClass);
  }
  return row;
};

/**
 * Function to create an HTML select element.
 * @param {string} className - The class name for the select element.
 * @returns {HTMLSelectElement} - The created HTML select element.
 */
const createHTMLSelect = (className) => {
  const select = document.createElement("select");
  if (className != null) {
    select.classList.add(className);
  }
  return select;
};

/**
 * Function to create an HTML button element.
 * @param {string} btnTxt - The text content of the button.
 * @param {string} customClass - The custom class for the button element.
 * @param {boolean} disabled - The initial disabled state of the button.
 * @returns {HTMLButtonElement} - The created HTML button element.
 */
const createHTMLButton = (btnTxt, customClass, disabled) => {
  const btn = document.createElement("button");
  btn.textContent = btnTxt;
  if (customClass != null) {
    btn.classList.add(customClass);
  }
  btn.disabled = disabled;
  return btn;
};

/**
 * Function to create a delete button for a row.
 * @param {HTMLInputElement} input - The input element associated with the row.
 * @param {HTMLSelectElement} select - The select element associated with the row.
 * @param {HTMLDivElement} keyValueElement - The key-value element associated with the row.
 * @param {string} selectedValue - The selected value of the select element.
 * @param {number[]} availableOptions - Array of available options.
 * @param {HTMLDivElement} rowsContainer - The container element for rows.
 * @param {Object} addedRows - Object containing added row indices.
 * @param {Object} buttons - Object containing various buttons.
 * @param {string[]} rowNames - Array containing row names.
 * @returns {HTMLButtonElement} - The created delete button element.
 */
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

/**
 * Function to append HTML elements to a row.
 * @param {HTMLDivElement} rowsContainer - The container element for rows.
 * @param {HTMLDivElement} row - The row element to which elements will be appended.
 * @param {HTMLInputElement} input - The input element to be appended to the row.
 * @param {HTMLSelectElement} select - The select element to be appended to the row.
 * @param {HTMLButtonElement} btn - The button element to be appended to the row.
 */
const appendHTML = (rowsContainer, row, input, select, btn) => {
  row.appendChild(input);
  row.appendChild(select);
  row.appendChild(btn);
  rowsContainer.appendChild(row);
};

/**
 * Function to create an HTML option element.
 * @param {string} value - The value attribute of the option.
 * @param {string} text - The text content of the option.
 * @param {boolean} isDisabled - The disabled state of the option.
 * @returns {HTMLOptionElement} - The created HTML option element.
 */
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

/**
 * Function to remove elements of a row.
 * @param {HTMLDivElement} row - The row element from which elements will be removed.
 * @param {HTMLInputElement} input - The input element to be removed.
 * @param {HTMLSelectElement} select - The select element to be removed.
 * @param {HTMLButtonElement} btn - The button element to be removed.
 */
const removeRowElements = (row, input, select, btn) => {
  row.removeChild(input);
  row.removeChild(select);
  row.removeChild(btn);
};

/**
 * Function to create an HTML div element.
 * @param {string} customClass - The custom class for the div element.
 * @param {string} text - The text content of the div element.
 * @returns {HTMLDivElement} - The created HTML div element.
 */
const createHTMLDiv = (customClass, text) => {
  const div = document.createElement("div");
  div.classList.add(customClass);
  div.textContent = text;
  return div;
};

/**
 * Function to create text for a row.
 * @param {string} inputValue - The value of the input element.
 * @param {string} selectedValue - The value of the select element.
 * @param {Object} addedRows - Object containing added row indices.
 * @param {string[]} rowNames - Array containing row names.
 * @returns {string} - The created row text.
 */
const createRowText = (inputValue, selectedValue, addedRows, rowNames) => {
  const camelCaseInput = toCamelCase(inputValue);
  addedRows[camelCaseInput] = parseInt(selectedValue, 10);
  const rowText = `"${inputValue}": ${rowNames[addedRows[camelCaseInput] - 1]}`;
  return rowText;
};

/**
 * Function to create a new row.
 * @param {Object} buttons - Object containing various buttons.
 * @param {HTMLDivElement} rowsContainer - The container element for rows.
 * @param {number[]} availableOptions - Array of available options.
 * @param {Object} addedRows - Object containing added row indices.
 * @param {string[]} rowNames - Array containing row names.
 */
export const createRow = (
  buttons,
  rowsContainer,
  availableOptions,
  addedRows,
  rowNames
) => {
  buttons.addRowButton.disabled = true;
  const row = createHTMLRow("row");
  const select = createHTMLSelect("select-row");
  const input = createHTMLInput("text", "Input value", null);
  updateSelectOptions(select, availableOptions, rowNames);
  const confirmButton = createHTMLButton("Confirm", null, true);

  input.addEventListener("input", (e) => {
    validateForm(input, select, confirmButton);
    const newValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    e.target.value = newValue;
  });

  select.addEventListener("change", () => {
    validateForm(input, select, confirmButton);
  });

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

        buttons.addRowButton.disabled = false;
        buttons.downloadButton.disabled = Object.keys(addedRows).length === 0;
      }
    }
  });

  appendHTML(rowsContainer, row, input, select, confirmButton);
  validateForm(input, select, confirmButton);
};

/**
 * Function to delete a row.
 * @param {HTMLDivElement} keyValueElement - The key-value element associated with the row.
 * @param {string} inputValue - The value of the input element.
 * @param {string} selectedValue - The value of the select element.
 * @param {HTMLSelectElement} select - The select element associated with the row.
 * @param {number[]} availableOptions - Array of available options.
 * @param {HTMLDivElement} rowsContainer - The container element for rows.
 * @param {Object} addedRows - Object containing added row indices.
 * @param {Object} buttons - Object containing various buttons.
 * @param {string[]} rowNames - Array containing row names.
 */
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
  buttons.downloadButton.disabled = Object.keys(addedRows).length === 0;
};

/**
 * Function to update the options in the select element.
 * @param {HTMLSelectElement} select - The select element to be updated.
 * @param {number[]} availableOptions - Array of available options.
 * @param {string[]} rowNames - Array containing row names.
 */
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

/**
 * Function to validate the form.
 * @param {HTMLInputElement} input - The input element to be validated.
 * @param {HTMLSelectElement} select - The select element to be validated.
 * @param {HTMLButtonElement} confirmButton - The confirm button element.
 */
const validateForm = (input, select, confirmButton) => {
  const isInputValid = input.value.trim() !== "";
  const isSelectValid = select.value !== "Select an option";
  confirmButton.disabled = !(isInputValid && isSelectValid);
};
