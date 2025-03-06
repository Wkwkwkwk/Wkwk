document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const newBtn = document.getElementById('new-btn');
    const qrDisplay = document.getElementById('qr-display');
    const logoDrop = document.getElementById('logo-drop');
    const logoInput = document.getElementById('logo');
    let qrCodeData = null;
    let canvas = null;

    generateBtn.addEventListener('click', function() {
        console.log("Generate QR Code button clicked");
        try {
            generateQRCode();
        } catch (error) {
            console.error("Error generating QR code:", error);
            alert('Error generating QR code. Please check the console for more details.');
        }
    });

    saveBtn.addEventListener('click', function() {
        console.log("Save QR Code button clicked");
        try {
            saveQRCode();
        } catch (error) {
            console.error("Error saving QR code:", error);
            alert('Error saving QR code. Please check the console for more details.');
        }
    });

    newBtn.addEventListener('click', function() {
        console.log("New QR Code button clicked");
        try {
            resetForm();
        } catch (error) {
            console.error("Error resetting form:", error);
            alert('Error resetting form. Please check the console for more details.');
        }
    });

    logoDrop.addEventListener('click', function() {
        logoInput.click();
    });

    logoInput.addEventListener('change', function() {
        handleLogoFiles(logoInput.files);
    });

    logoDrop.addEventListener('dragover', function(e) {
        e.preventDefault();
        logoDrop.classList.add('dragover');
    });

    logoDrop.addEventListener('dragleave', function(e) {
        e.preventDefault();
        logoDrop.classList.remove('dragover');
    });

    logoDrop.addEventListener('drop', function(e) {
        e.preventDefault();
        logoDrop.classList.remove('dragover');
        handleLogoFiles(e.dataTransfer.files);
    });

    function clearLogoDrop() {
        const existingFileName = logoDrop.querySelector('div');
        if (existingFileName) {
            logoDrop.removeChild(existingFileName);
        }
        const dropText = logoDrop.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }
    }

    function handleLogoFiles(files) {
        if (files.length > 1) {
            alert('Hanya satu logo yang bisa dipilih.');
            return;
        }
        const file = files[0];
        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/x-icon'].includes(file.type)) {
            alert('Format file tidak didukung. Pilih file dengan format PNG, JPG, JPEG, atau ICO.');
            return;
        }
        logoInput.files = files;

        clearLogoDrop();

        const dropText = logoDrop.querySelector('p');
        if (dropText) {
            dropText.style.display = 'none';
        }

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const filePreview = document.createElement('img');
        filePreview.style.maxWidth = '50px';
        filePreview.style.maxHeight = '50px';
        filePreview.style.marginLeft = '10px';
        filePreview.style.borderRadius = '5px';

        const reader = new FileReader();
        reader.onload = function (e) {
            filePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        const fileContainer = document.createElement('div');
        fileContainer.style.display = 'flex';
        fileContainer.style.alignItems = 'center';
        fileContainer.appendChild(fileName);
        fileContainer.appendChild(filePreview);

        logoDrop.appendChild(fileContainer);
    }

    function generateQRCode() {
        const url = document.getElementById('url').value;
        const logoFile = logoInput.files[0];
        const logoSize = parseInt(document.getElementById('logo-size').value);
        const padding = parseInt(document.getElementById('padding').value);
        const complexity = parseInt(document.getElementById('complexity').value);

        if (!url) {
            alert('Masukkan URL dulu bosku');
            return;
        }

        if (!validateURL(url)) {
            alert('URL yang bosku masukkan tidak valid. Silakan cek kembali.');
            return;
        }

        if (canvas && qrDisplay.contains(canvas)) {
            qrDisplay.removeChild(canvas);
        }

        const existingNote = qrDisplay.querySelector('.qr-note');
        if (existingNote) {
            qrDisplay.removeChild(existingNote);
        }

        canvas = document.createElement('canvas');
        const options = {
            text: url,
            width: 400,
            height: 400,
            colorDark: "#000000",
            colorLight: "#ffffff",
            errorCorrectionLevel: 'H',
            version: complexity
        };

        QRCode.toCanvas(canvas, options.text, { ...options }, function (error) {
            if (error) {
                console.error(error);
                return;
            }

            if (logoFile) {
                addLogoToCanvas(logoFile, canvas, logoSize, padding);
            }
        });

        qrDisplay.appendChild(canvas);
        qrCodeData = canvas;

        const note = document.createElement('p');
        note.textContent = "Silakan tes scan QR anda. Jika QR tidak bisa discan, mohon perkecil ukuran logo atau padding.";
        note.classList.add('qr-note');
        note.style.marginTop = "10px";
        note.style.marginInline = "20px";
        note.style.textAlign = "center";
        note.style.color = "#000";
        note.style.backgroundColor = "#ffffff";
        note.style.padding = "10px";
        note.style.borderRadius = "5px";
        note.style.fontSize = "14px";
        qrDisplay.appendChild(note);
    }

    function addLogoToCanvas(logoFile, canvas, logoSize, padding) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const logoDataUrl = e.target.result;
            const context = canvas.getContext('2d');
            const logo = new Image();
            logo.src = logoDataUrl;
            logo.onload = function () {
                const logoWidth = canvas.width * logoSize / 10;
                const logoHeight = logoWidth * (logo.height / logo.width);
                const logoX = (canvas.width - logoWidth) / 2;
                const logoY = (canvas.height - logoHeight) / 2;

                drawRoundedRect(context, logoX - padding, logoY - padding, logoWidth + 2 * padding, logoHeight + 2 * padding, padding);
                context.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
            };
        };
        reader.readAsDataURL(logoFile);
    }

    function drawRoundedRect(context, x, y, width, height, radius) {
        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.fill();
    }

    function saveQRCode() {
        if (qrCodeData) {
            const link = document.createElement("a");
            link.download = "qr-code.png";
            link.href = qrCodeData.toDataURL("image/png");
            link.click();
        } else {
            alert('Isi data-data QR dan buat QR-nya dulu bosku');
        }
    }

    function resetForm() {
        document.getElementById('url').value = '';
        document.getElementById('logo').value = '';
        document.getElementById('logo-size').value = 4;
        document.getElementById('padding').value = 10;
        document.getElementById('complexity').value = 10;

        if (canvas && qrDisplay.contains(canvas)) {
            qrDisplay.removeChild(canvas);
            canvas = null;
        }

        const existingNote = qrDisplay.querySelector('.qr-note');
        if (existingNote) {
            qrDisplay.removeChild(existingNote);
        }

        clearLogoDrop();
        qrCodeData = null;
    }

    function validateURL(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name and extension
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(url);
    }
});
