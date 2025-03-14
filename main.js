let isValid = false;
let inputFields = document.querySelectorAll(".field");

let textInputs = document.querySelectorAll('input[type="text"]');
let radioInputs = document.querySelectorAll('input[type="radio"]');

textInputs.forEach((input) => {
  input.addEventListener("change", function () {
    removeError(input.parentElement);
  });
});

radioInputs.forEach((input) => {
  input.addEventListener("change", function () {
    removeError(input.parentElement.parentElement);
  });
});

function removeError(field) {
  field.classList.remove("error");
  let nextSibling = field.nextElementSibling;
  if (nextSibling) {
    nextSibling.remove();
  }
}

const calculateRepaymentsBtn = document.querySelector('[type="submit"]');

const resetBtn = document.querySelector('[type="reset"]');
resetBtn.addEventListener("click", function () {
  clearPreviousErrors();
  generateResultsLandPage();
});

calculateRepaymentsBtn.addEventListener("click", function (event) {
  event.preventDefault();
  trimValues();
  isValid = validateForm();

  if (isValid) {
    calculateRepayments();
    generateRepaymentsResults();
  } else {
    clearPreviousErrors();
    showErrorStates();
    generateResultsLandPage();
  }
});

function validateForm() {
  return Array.from(inputFields).every((field) => checkValidity(field));
}

function checkValidity(field) {
  let inputElement = field.querySelector('input[type="text"]');
  let radioElements = field.querySelectorAll('input[type="radio"]');

  return (
    (inputElement ? inputElement.value !== "" : false) ||
    Array.from(radioElements).some((radio) => radio.checked)
  );
}

// Function to calculate the monthly repayment amount
let monthlyRepaymentsElement = document.querySelector(".monthly-repayments > p > span + span");
let totalRepaymentsElement = document.querySelector(".total-repayments > p > span + span");

function calculateRepayments() {
  const mortgageAmount = parseFloat(document.querySelector('input[name="mortgage-amount"]').value);
  const mortgageTerm = parseFloat(document.querySelector('input[name="mortgage-term"]').value);
  const interestRate = parseFloat(document.querySelector('input[name="interest-rate"]').value);
  const mortgageType = document.querySelector('input[name="mortgage-type"]:checked').value;

  let monthlyRepayments = ((mortgageAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + (interestRate / 100 / 12), -mortgageTerm * 12))).toFixed(2)
  
  if (mortgageType === "repayment") {
    monthlyRepaymentsElement.textContent = monthlyRepayments;
    totalRepaymentsElement.textContent = (monthlyRepayments * mortgageTerm * 12).toFixed(2);
  }

  else if (mortgageType === "interest-only") {
    monthlyRepaymentsElement.textContent = (mortgageAmount * (interestRate / 100 / 12)).toFixed(2);
    totalRepaymentsElement.textContent = (monthlyRepayments * mortgageTerm * 12).toFixed(2);
  }
}

let resultsShownHere = document.querySelector(".results-shown-here");
let results = document.querySelector(".results");

function generateRepaymentsResults() {
  resultsShownHere.style.display = "none";
  results.style.display = "flex";
}

function generateResultsLandPage() {
  resultsShownHere.style.display = "block";
  results.style.display = "none";
}

function showErrorStates() {
  inputFields.forEach((field) => {
    if (!checkValidity(field)) {
      field.classList.add("error");
      addErrorMsg(field);
    }
  });
}

function clearPreviousErrors() {
  let errors = document.querySelectorAll(".error-message");
  errors.forEach((error) => error.remove());

  inputFields.forEach((field) => field.classList.remove("error"));
}

function addErrorMsg(field) {
  let error = document.createElement("span");
  error.classList.add("error-message");
  error.textContent = "This field is required";
  field.after(error);
}

function removeErrorMsg(field) {
  let error = field.nextElementSibling;
  error.remove();
}

function trimValues() {
  inputFields.forEach((field) => {
    let inputElement = field.querySelector('input[type="text"]');
    if (inputElement) {
      inputElement.value = inputElement.value.trim();
    }
  });
}