document.addEventListener('DOMContentLoaded', function () {
    const mergeBtn = document.getElementById('merge-btn');
    const imgInput = document.getElementById('images');
    const qrDisplay = document.getElementById('qr-display');
    const downloadBtn = document.getElementById('download-btn');
    const dropSection = document.getElementById('drop-section');
    const fileList = document.getElementById('file-list');
    const loadingPopup = document.getElementById('loading-popup');

    const rightPanel = document.querySelector('.right-panel');
    const motorContainer = document.querySelector('.motor-container');

    let files = [];

    // Klik area drop untuk input file
    dropSection.addEventListener('click', function () {
        imgInput.click();
    });

    // Ketika file diunggah
    imgInput.addEventListener('change', function () {
        files.push(...Array.from(imgInput.files));
        displayFiles(files);
    });

    // Drag & drop
    dropSection.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropSection.classList.add('dragover');
    });

    dropSection.addEventListener('dragleave', function (e) {
        e.preventDefault();
        dropSection.classList.remove('dragover');
    });

    dropSection.addEventListener('drop', function (e) {
        e.preventDefault();
        dropSection.classList.remove('dragover');
        files.push(...Array.from(e.dataTransfer.files));
        displayFiles(files);
    });

    // Tombol Proses
    mergeBtn.addEventListener('click', function () {
        rightPanel.classList.remove('active');
        motorContainer.classList.add('hidden');

        // Animasi ke panel kanan
        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10);

        if (files.length < 1) {
            alert('Silakan upload minimal satu gambar.');
            return;
        }

        // Tampilkan popup loading
        loadingPopup.style.display = 'flex';

        handleFiles(files);
    });

    // Menampilkan daftar file
    function displayFiles(files) {
        fileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            const imgIcon = document.createElement('img');
            // Ikon standar untuk file gambar, silakan ganti dengan ikon lain jika mau
            imgIcon.src = '../assets/img/formatjpg.png';
            imgIcon.alt = 'Image Icon';

            const fileName = document.createElement('span');
            fileName.textContent = truncateFileName(file.name, 35);

            fileItem.appendChild(imgIcon);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);
        });

        // Hilangkan teks default "Drag & Drop..."
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'none';
        }
    }

    function truncateFileName(fileName, maxLength) {
        if (fileName.length > maxLength) {
            return fileName.substring(0, maxLength - 3) + '...';
        }
        return fileName;
    }

    async function handleFiles(files) {
        try {
            // Memanggil fungsi untuk membuat PDF dari banyak gambar
            const mergedPdfBytes = await mergeImagesToPdf(files);

            // Tampilkan di iframe
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Tampilkan PDF
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.width = '100%';
            iframe.height = '400px';
            qrDisplay.innerHTML = '';
            qrDisplay.appendChild(iframe);

            // Tampilkan tombol download
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = function () {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'hasilPS.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
            };

            // Sembunyikan popup loading
            loadingPopup.style.display = 'none';

            console.log('PDF created and displayed successfully.');
        } catch (error) {
            console.error('Error merging images to PDF:', error);
            alert('Terjadi kesalahan saat menggabungkan gambar. Coba lagi.');
            loadingPopup.style.display = 'none';
        }
    }

    // Fungsi untuk membuat PDF dari banyak gambar
    async function mergeImagesToPdf(files) {
        const { PDFDocument, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            try {
                // Baca file menjadi data ArrayBuffer
                const arrayBuffer = await file.arrayBuffer();
                // Buat objek Blob lalu convert jadi data URL
                const blob = new Blob([arrayBuffer]);
                const dataUrl = await blobToDataURL(blob);

                // Embed gambar ke PDF
                const imgExt = file.name.split('.').pop().toLowerCase();
                let embeddedImage;
                let imgDims;

                if (imgExt === 'png') {
                    embeddedImage = await pdfDoc.embedPng(dataUrl);
                } else {
                    // Asumsikan jpg/jpeg
                    embeddedImage = await pdfDoc.embedJpg(dataUrl);
                }

                imgDims = embeddedImage.scale(1);

                // Buat halaman baru dengan ukuran sesuai gambar
                const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: imgDims.width,
                    height: imgDims.height,
                });

                // === Tambahkan teks di pojok kiri atas ===
                // Parsing nama file: contoh "PS 05 AMB, KRI" -> ambil "AMB, KRI"
                const overlayText = parseOverlayText(file.name);
                
                // Untuk memberi background putih di belakang teks, kita butuh perkiraan lebar teks.
                // Sederhana saja: kita asumsikan lebar teks ~ (panjang karakter * 6).
                const textWidthEstimate = overlayText.length * 15;
                const textHeight = 25; // tinggi area teks
                const padding = 35;     // padding sekitar teks
                
                // Gambarkan kotak putih
                page.drawRectangle({
                    x: 0,
                    y: page.getHeight() - (textHeight + padding * 2),
                    width: textWidthEstimate + padding * 6,
                    height: textHeight + padding * 2,
                    color: rgb(1, 1, 1), // putih
                });

                // Gambarkan teks (hitam)
                page.drawText(overlayText, {
                    x: padding,
                    y: page.getHeight() - (textHeight + padding),
                    size: 40,
                    color: rgb(0, 0, 0),
                });

            } catch (error) {
                console.error('Error processing image:', file.name, error);
            }
        }

        console.log('All images processed into PDF successfully.');
        return await pdfDoc.save();
    }

    // Fungsi bantu untuk convert Blob jadi dataURL
    function blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    }

    // Fungsi parsing judul teks overlay
    // Misalnya nama file: "PS 05 AMB, KRI.jpg"
    // Maka kita hilangkan "PS" dan nomor yang mengikutinya -> "AMB, KRI"
    function parseOverlayText(filename) {
        // Hilangkan ekstensi
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        // Pisahkan kata
        const parts = nameWithoutExt.split(' ');

        // Jika format = PS + {angka} + sisanya
        // misal ["PS", "05", "AMB,", "KRI"]
        // maka kita gabungkan dari index 2
        if (parts.length > 2 && parts[0].toUpperCase() === 'PS' && !isNaN(parts[1])) {
            return parts.slice(2).join(' ');
        } else if (parts.length > 1 && parts[0].toUpperCase() === 'PS') {
            // Jika "PS" di awal tapi tidak ada angka
            return parts.slice(1).join(' ');
        }
        // Kalau tidak cocok pattern, kembalikan nama aslinya tanpa ekstensi
        return nameWithoutExt;
    }

    // Tombol Reset
    document.getElementById('reset-btn').addEventListener('click', function () {
        files = [];
        fileList.innerHTML = '';
        imgInput.value = ''; // reset input file

        // Munculkan kembali teks "Drag & Drop..."
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }

        // Sembunyikan hasil PDF
        qrDisplay.innerHTML = '';
        downloadBtn.style.display = 'none';

        rightPanel.classList.remove('active');
        motorContainer.classList.remove('hidden');
    });
});
