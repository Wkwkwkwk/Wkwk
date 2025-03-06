document.addEventListener('DOMContentLoaded', function () {
    // Set workerSrc for pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

    const convertBtn = document.getElementById('convert-btn');
    const pdfInput = document.getElementById('pdf');
    const fileDisplay = document.getElementById('file-display');
    const outputFileList = document.getElementById('output-file-list');
    const downloadBtn = document.getElementById('download-btn');
    const dropSection = document.getElementById('drop-section');
    const fileList = document.getElementById('file-list');
    const loadingPopup = document.getElementById('loading-popup');
    const qualityInput = document.getElementById('quality');
    const maxSizeInput = document.getElementById('maxSize'); // Input for maximum size
    const webpBtn = document.getElementById('webp-btn');
    const jpegBtn = document.getElementById('jpeg-btn');
    const pngBtn = document.getElementById('png-btn');
    const resetBtn = document.getElementById('reset-btn');
    let files = [];
    let selectedFormat = 'jpeg'; // Default format

    // Format selection
    webpBtn.addEventListener('click', () => selectFormat('webp'));
    jpegBtn.addEventListener('click', () => selectFormat('jpeg'));
    pngBtn.addEventListener('click', () => selectFormat('png'));

    function selectFormat(format) {
        selectedFormat = format;
        webpBtn.classList.remove('active');
        jpegBtn.classList.remove('active');
        pngBtn.classList.remove('active');
        if (format === 'webp') webpBtn.classList.add('active');
        if (format === 'jpeg') jpegBtn.classList.add('active');
        if (format === 'png') pngBtn.classList.add('active');
    }

    dropSection.addEventListener('click', function () {
        pdfInput.click();
    });

    pdfInput.addEventListener('change', function () {
        files.push(...Array.from(pdfInput.files));
        displayFiles(files);
    });

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

    convertBtn.addEventListener('click', function () {
        if (files.length < 1) {
            alert('Please upload at least one PDF file.');
            return;
        }
        loadingPopup.style.display = 'flex';
        handleFiles(files, selectedFormat);
    });

    resetBtn.addEventListener('click', function () {
        files = [];
        fileList.innerHTML = '';
        outputFileList.innerHTML = '';
        pdfInput.value = '';

        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }

        fileDisplay.innerHTML = '';
        downloadBtn.style.display = 'none';
    });

    function displayFiles(files) {
        fileList.innerHTML = '';
        outputFileList.innerHTML = '';
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.setAttribute('data-index', index);

            const fileIcon = document.createElement('img');
            fileIcon.src = 'assets/img/pdf.png'; // Path to your PDF icon
            fileIcon.alt = 'PDF Icon';

            const fileName = document.createElement('span');
            fileName.textContent = truncateFileName(file.name, 15);

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);

            const outputFileItem = document.createElement('div');
            outputFileItem.classList.add('file-item');
            outputFileItem.setAttribute('data-index', index);

            const outputFileIcon = document.createElement('img');
            outputFileIcon.src = 'assets/img/img.png'; // Path to your image icon
            outputFileIcon.alt = 'Image Icon';

            const outputFileName = document.createElement('span');
            outputFileName.textContent = truncateFileName(file.name, 15);

            outputFileItem.appendChild(outputFileIcon);
            outputFileItem.appendChild(outputFileName);
            outputFileList.appendChild(outputFileItem);
        });

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

    async function handleFiles(files, format) {
        const quality = parseInt(qualityInput.value, 10);
        const maxSize = parseInt(maxSizeInput.value, 10); // Get max size input
        try {
            const images = [];

            for (const file of files) {
                const pdfData = new Uint8Array(await file.arrayBuffer());
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                const numPages = pdf.numPages;

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const img = await convertPdfPageToImage(page, i - 1, quality, maxSize, file.name, format);
                    if (img) images.push(img);
                }
            }

            displayImages(images);
            setupDownload(images);
            loadingPopup.style.display = 'none';
        } catch (error) {
            console.error('Error converting PDFs:', error);
            alert('Error converting PDFs. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    async function convertPdfPageToImage(page, pageIndex, quality, maxSize, fileName, format) {
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        let mimeType;
        if (format === 'webp') {
            mimeType = 'image/webp';
        } else if (format === 'jpeg' || format === 'jpg') {
            mimeType = 'image/jpeg';
        } else if (format === 'png') {
            mimeType = 'image/png';
        }

        let dataUrl = canvas.toDataURL(mimeType, quality / 100);
        let img = document.createElement('img');
        img.src = dataUrl;
        img.alt = `${fileName.split('.')[0]}-${pageIndex + 1}.${format}`;

        if (await checkFileSize(img, maxSize)) {
            return img;
        } else {
            return adjustFileSize(canvas, mimeType, quality, maxSize, fileName, format, pageIndex);
        }
    }

    async function checkFileSize(img, maxSize) {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return (blob.size / 1024 <= maxSize); // size in KB
    }

    async function adjustFileSize(canvas, mimeType, quality, maxSize, fileName, format, pageIndex) {
        let adjustedQuality = quality;
        while (adjustedQuality > 10) { // stop if quality is below 10%
            adjustedQuality -= 5; // reduce quality by 5% each time
            let dataUrl = canvas.toDataURL(mimeType, adjustedQuality / 100);
            let img = document.createElement('img');
            img.src = dataUrl;
            img.alt = `${fileName.split('.')[0]}-${pageIndex + 1}.${format}`;
            if (await checkFileSize(img, maxSize)) {
                return img;
            }
        }
        alert('Cannot meet the size requirements with acceptable quality.');
        return null; // or handle this case as needed
    }

    function setupDownload(images) {
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = async function () {
            const zip = new JSZip();
            const imgFolder = zip.folder("images");

            for (const img of images) {
                const response = await fetch(img.src);
                const blob = await response.blob();
                imgFolder.file(img.alt, blob);
            }

            zip.generateAsync({ type: "blob" }).then(function (content) {
                const a = document.createElement('a');
                const url = URL.createObjectURL(content);
                a.href = url;
                a.download = "images.zip";
                a.click();
                URL.revokeObjectURL(url);
            });
        };
    }

    function displayImages(images) {
        outputFileList.innerHTML = '';
        images.forEach((img, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.setAttribute('data-index', index);

            const fileIcon = document.createElement('img');
            fileIcon.src = img.src;
            fileIcon.alt = 'Image Icon';

            const fileName = document.createElement('span');
            fileName.textContent = img.alt;

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            outputFileList.appendChild(fileItem);
        });
    }
});
