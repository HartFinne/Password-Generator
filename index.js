const lengthInput = document.getElementById("length-input")
const symbolsCheckbox = document.getElementById("symbols-checkbox")
const numbersCheckbox = document.getElementById("numbers-checkbox")
const passwordGenerator = document.getElementById("password-generator")
const passwordInput1 = document.getElementById("password-input-1")
const passwordInput2 = document.getElementById("password-input-2")

const lowerCase = "abcdefghijklmnopqrstuvxyz";
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
const numbers = "0123456789";
const symbols = "£$&()*+[]@#^-_!?";


function generatePassword(length, symbolsChecked, numbersChecked) {
    // Determine required character groups and the overall pool
    let pool = lowerCase + upperCase;
    const requiredChars = [];

    if (numbersChecked) {
        pool += numbers;
        // ensure at least one number
        requiredChars.push(randomCharFrom(numbers));
    }

    if (symbolsChecked) {
        pool += symbols;
        // ensure at least one symbol
        requiredChars.push(randomCharFrom(symbols));
    }

    // If length is less than required chars, adjust or throw
    if (length < requiredChars.length) {
        // Option A: clamp length up to required count
        // length = requiredChars.length;
        // Option B (preferred): inform the caller by returning '' or throwing
        throw new Error(`Length must be at least ${requiredChars.length} to include required character types.`);
    }

    // Build password array starting with required chars
    const passwordChars = requiredChars.slice();

    // Fill the rest randomly from the combined pool
    for (let i = passwordChars.length; i < length; i++) {
        passwordChars.push(randomCharFrom(pool));
    }

    // Shuffle so required chars are not always at front
    shuffleArray(passwordChars);

    console.log(passwordChars.length, "Password")

    // Return as string
    return passwordChars.join('');
}

// helper: pick a random char from a string
function randomCharFrom(str) {
    return str[Math.floor(Math.random() * str.length)];
}

// helper: in-place Fisher–Yates shuffle
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


console.log(generatePassword())

function renderPassword() {
  const length = parseInt(lengthInput.value, 10);
  const symbolsChecked = symbolsCheckbox.checked;
  const numbersChecked = numbersCheckbox.checked;

  // Validation (example)
  if (isNaN(length) || length < 1) {
    alert("Please enter a valid length.");
    return;
  }

  try {
    passwordInput1.value = generatePassword(length, symbolsChecked, numbersChecked);
    passwordInput2.value = generatePassword(length, symbolsChecked, numbersChecked);
  } catch (err) {
    alert(err.message);
  }
}



function copyPassword(input) {
    // Copy password to clipboard
    navigator.clipboard.writeText(input.value).then(() => {
        showTooltip(input, "Copied!");
    }).catch(() => {
        showTooltip(input, "Failed to copy");
    });
}

function showTooltip(input, message) {
    // Create tooltip element
    const tooltip = document.createElement("span");
    tooltip.textContent = message;
    tooltip.className = "tooltip";

    // Position tooltip near input
    input.parentElement.appendChild(tooltip);

    // Remove after animation
    setTimeout(() => tooltip.remove(), 1500);
}

passwordGenerator.addEventListener("click", renderPassword)
passwordInput1.addEventListener("click", () => copyPassword(passwordInput1))
passwordInput2.addEventListener("click", () => copyPassword(passwordInput2))