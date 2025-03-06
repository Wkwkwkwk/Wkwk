const popupOverlay = document.getElementById('popupOverlay');
const popupText = document.querySelector('.popup p');

// Fungsi untuk menampilkan pop-up dengan pesan kustom
function showPopup(message) {
    popupText.textContent = message;
    popupOverlay.style.display = 'block';
}

// Mencegah klik kanan dan menampilkan pop-up
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    showPopup('Maaf, website ini tidak mengizinkan untuk klik kanan.');
});

// Tutup pop-up ketika user klik di luar area pop-up
popupOverlay.addEventListener('click', function (event) {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});


// Disable berbagai shortcut keyboard untuk Developer Tools
document.addEventListener('keydown', function (e) {
    // Disable F12
    if (e.key === 'F12') {
        e.preventDefault();
        showPopup('Maaf, Developer Tools tidak diizinkan.');
    }

    // Disable Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && ['I', 'C', 'J', 'K', 'P'].includes(e.key)) {
        e.preventDefault();
        showPopup('Maaf, Developer Tools tidak diizinkan.');
    }

    // Disable Ctrl+U
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        showPopup('Maaf, View Source tidak diizinkan.');
    }
});

function createWhiteOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontFamily = 'Arial, sans-serif';

    // Tambahkan teks utama
    const text = document.createElement('div');
    text.innerText = 'Dilarang foto-foto di sini guys';
    text.style.fontSize = '24px';
    text.style.fontWeight = 'bold';
    text.style.color = 'black';
    text.style.marginBottom = '20px';
    overlay.appendChild(text);

    // Tambahkan countdown
    const countdown = document.createElement('div');
    countdown.style.fontSize = '20px';
    countdown.style.color = 'black';
    overlay.appendChild(countdown);

    let remainingTime = 10; // 10 detik countdown
    countdown.innerText = `Tutup dalam ${remainingTime} detik...`;

    const interval = setInterval(() => {
        remainingTime--;
        countdown.innerText = `Tutup dalam ${remainingTime} detik...`;

        if (remainingTime <= 0) {
            clearInterval(interval);
        }
    }, 1000);

    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 10000); // Durasi 10 detik
}

// Disable Screenshoot bro
document.addEventListener('keyup', (e) => {
    if (e.key == 'PrintScreen') {
        navigator.clipboard.writeText('');
        createWhiteOverlay();
        showPopup('Maaf, screenshoot tidak diizinkan.');
    }
    
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key == 'p') {
        showPopup('Maaf, print halaman tidak diizinkan.');
        e.preventDefault();
        
    }
});

document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.metaKey) {
        navigator.clipboard.writeText('');
        e.stopImmediatePropagation();
        createWhiteOverlay();
        showPopup('Maaf, screenshoot tidak diizinkan.');
    }
});

document.onkeydown = function(e){ 
    console.log(e.key);
}