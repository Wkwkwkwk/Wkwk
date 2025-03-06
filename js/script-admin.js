const closeAllPopups = () => {
    document.querySelectorAll('.popupContainer').forEach(popup => {
        popup.classList.remove('popupActive');
    });
};

const closeAllChildSubButtons = () => {
    document.querySelectorAll('.child-sub-buttons').forEach(child => {
        child.classList.remove('show');
    });
};

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (event) {
        // Close all popups and child sub buttons if a main button is clicked
        if (!this.classList.contains('toggleChild')) {
            closeAllChildSubButtons();
            closeAllPopups();
        }

        // Preventing click on 'btn' sub-buttons to close parent popup
        if (this.classList.contains('toggleChild')) {
            event.stopPropagation();
        }
    });
});

document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.closest('.popupContainer').classList.remove('popupActive');
    });
});


// Event listener untuk button "registrasi"
const registrasiBtn = document.getElementById("registrasiBtn");
const closeRegistrasi = document.getElementById("closeRegistrasi");
const popupRegistrasi = document.getElementById("popupRegistrasi");

registrasiBtn.addEventListener("click", function () {
    closeAllPopups();
    popupRegistrasi.classList.add("popupActive");
});

closeRegistrasi.addEventListener("click", function () {
    popupRegistrasi.classList.remove("popupActive");
});

// Toggle child sub buttons
document.querySelectorAll('.toggleChild').forEach(button => {
    button.addEventListener('click', function (event) {
        const childSubButtons = this.nextElementSibling;
        if (childSubButtons.classList.contains('show')) {
            childSubButtons.classList.remove('show');
        } else {
            closeAllChildSubButtons();
            childSubButtons.classList.add('show');
        }
        event.stopPropagation(); // Prevent triggering parent's click event
    });
});

// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.querySelector('p').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Sudah di-copy, bosku!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
