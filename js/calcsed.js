const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearButton = document.getElementById('clear');
const equalsButton = document.getElementById('equals');

let currentInput = '';
let operator = '';
let result = '';
let newOperation = false;
let isResultDisplayed = false;

buttons.forEach(button => {
    button.addEventListener('click', () =>
        handleButtonClick(button.innerText));
})

clearButton.addEventListener('click', clearDisplay);

equalsButton.addEventListener('click', performCalculation);

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        handleButtonClick(key);
    } else if (key === '.') {
        handleButtonClick(key);
    } else if (key === 'Backspace') {
        handleButtonClick('←');
    } else if (key === 'Enter' || key === '=') {
        performCalculation();
    } else if (key === '+') {
        handleButtonClick('+');
    } else if (key === '-') {
        handleButtonClick('-');
    } else if (key === '*') {
        handleButtonClick('x');
    } else if (key === '/') {
        handleButtonClick('/');
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

function handleButtonClick(value) {
    if (newOperation && !isOperator(value)) {
        currentInput = '';
        newOperation = false;
    }

    if (isResultDisplayed && !isOperator(value)) {
        result = '';
        isResultDisplayed = false;
    }

    if (value >= '0' && value <= '9') {
        if ((currentInput + value).length > 48) {
            showAlert();
            return;
        }
        currentInput += value;
    } else if (value === '.' && !currentInput.includes('.')) {
        currentInput += value;
    } else if (value === 'C') {
        clearDisplay();
    } else if (value === '←') {
        currentInput = currentInput.substring(0, currentInput.length - 1);
    } else if (isOperator(value)) {
        if (currentInput !== '' || result !== '') {
            if (operator && currentInput) {
                performCalculation();
            } else if (result === '') {
                result = currentInput;
            }
            operator = value;
            currentInput = '';
        }
    } else if (value === '=') {
        performCalculation();
        operator = '';
    }

    display.value = `${result} ${operator} ${currentInput}`;
    adjustFontSize();
}

function performCalculation() {
    if (currentInput !== '') {
        if (operator === '+') {
            result = (parseFloat(result) + parseFloat(currentInput)).toString();
        } else if (operator === '-') {
            result = (parseFloat(result) - parseFloat(currentInput)).toString();
        } else if (operator === 'x') {
            result = (parseFloat(result) * parseFloat(currentInput)).toString();
        } else if (operator === '/') {
            result = (parseFloat(result) / parseFloat(currentInput)).toString();
        } else {
            result = currentInput;
        }
    }
    currentInput = '';
    newOperation = true;
    isResultDisplayed = true;

    if (result.length > 9) {
        result = parseFloat(result).toExponential(2);
    }

    display.value = result;
    adjustFontSize();
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    result = '';
    display.value = '0';
    newOperation = false;
    isResultDisplayed = false;
    adjustFontSize();
}

function isOperator(value) {
    return value === '+' || value === '-' || value === 'x' || value === '/';
}

function adjustFontSize() {
    const maxLength = 10; // Jumlah karakter maksimum sebelum mengubah ukuran font
    const defaultFontSize = 45; // Ukuran font default
    const minFontSize = 20; // Ukuran font minimum

    if (display.value.length > maxLength) {
        const newFontSize = Math.max(minFontSize, defaultFontSize - (display.value.length - maxLength) * 2);
        display.style.fontSize = `${newFontSize}px`;
    } else {
        display.style.fontSize = `${defaultFontSize}px`;
    }
}

function showAlert() {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '50%';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translate(-50%, -50%)';
    alertBox.style.backgroundColor = 'white';
    alertBox.style.padding = '20px';
    alertBox.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    alertBox.style.zIndex = '1000';
    alertBox.style.textAlign = 'center';
    alertBox.innerText = "Ups... Maksimal digit dalam kalkulator ini adalah 48 digit";

    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.style.marginTop = '10px';
    okButton.style.padding = '5px 10px';
    okButton.style.border = 'none';
    okButton.style.backgroundColor = 'dodgerblue';
    okButton.style.color = 'white';
    okButton.style.cursor = 'pointer';

    okButton.addEventListener('click', () => {
        document.body.removeChild(alertBox);
        document.removeEventListener('keydown', handleAlertKeydown);
    });

    alertBox.appendChild(okButton);
    document.body.appendChild(alertBox);

    function handleAlertKeydown(event) {
        if (event.key === 'Enter') {
            document.body.removeChild(alertBox);
            document.removeEventListener('keydown', handleAlertKeydown);
        }
    }

    document.addEventListener('keydown', handleAlertKeydown);
}
