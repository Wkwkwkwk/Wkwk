document.addEventListener('DOMContentLoaded', function () {
    const compressBtn = document.getElementById('compress-btn');
    const pdfInput = document.getElementById('pdf');
    const outputFileList = document.getElementById('output-file-list');
    const downloadBtn = document.getElementById('download-btn');
    const dropSection = document.getElementById('drop-section');
    const fileList = document.getElementById('file-list');
    const loadingPopup = document.getElementById('loading-popup');
    const percentageSlider = document.getElementById('percentage-slider');
    const percentageInput = document.getElementById('percentage-input');
    const toggleSizeSettingsBtn = document.getElementById('toggle-size-settings-btn');
    const cancelSizeSettingsBtn = document.getElementById('cancel-size-settings-btn');
    const sizeSettings = document.getElementById('size-settings');
    let files = [];
    let useSizeSettings = false;

    dropSection.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            return; // Prevent triggering file input if buttons are clicked
        }
        pdfInput.click();
    });

    pdfInput.addEventListener('change', function () {
        files.push(...Array.from(pdfInput.files));
        displayFiles(files);
    });

    // Event listeners for drag and drop
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

    toggleSizeSettingsBtn.addEventListener('click', function () {
        useSizeSettings = !useSizeSettings;
        if (useSizeSettings) {
            sizeSettings.classList.add('active');
        } else {
            sizeSettings.classList.remove('active');
        }
    });

    cancelSizeSettingsBtn.addEventListener('click', function () {
        useSizeSettings = false;
        sizeSettings.classList.remove('active');
    });

    compressBtn.addEventListener('click', function () {
        if (files.length < 1) {
            alert('Please upload at least one PDF file.');
            return;
        }
        // Show loading popup
        loadingPopup.style.display = 'flex';

        if (useSizeSettings) {
            const percentage = parseInt(percentageInput.value, 10);
            console.log('Compressing PDFs with percentage:', percentage);
            handleFilesWithSizeSettings(files, percentage);
        } else {
            handleFiles(files);
        }
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
            outputFileIcon.src = 'assets/img/pdf.png';
            outputFileIcon.alt = 'PDF Icon';

            const outputFileName = document.createElement('span');
            outputFileName.textContent = truncateFileName(file.name, 15).replace(/\.[^/.]+$/, "") + `_compressed.pdf`;

            outputFileItem.appendChild(outputFileIcon);
            outputFileItem.appendChild(outputFileName);
            outputFileList.appendChild(outputFileItem);
        });

        // Remove "Drag & Drop PDF-nya di sini gan" text
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
            const compressedFiles = [];
            for (const file of files) {
                const compressedPdfBytes = await compressPdf(file);
                compressedFiles.push({
                    name: file.name.replace(/\.[^/.]+$/, "") + `_compressed.pdf`,
                    content: compressedPdfBytes
                });
            }

            setupDownload(compressedFiles);
            loadingPopup.style.display = 'none';
        } catch (error) {
            console.error('Error compressing PDFs:', error);
            alert('Error compressing PDFs. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    async function handleFilesWithSizeSettings(files, percentage) {
        try {
            const compressedFiles = [];
            for (const file of files) {
                const compressedPdfBytes = await compressPdfWithSizeSettings(file, percentage);
                compressedFiles.push({
                    name: file.name.replace(/\.[^/.]+$/, "") + `_compressed.pdf`,
                    content: compressedPdfBytes
                });
            }

            setupDownload(compressedFiles);
            loadingPopup.style.display = 'none';
        } catch (error) {
            console.error('Error compressing PDFs:', error);
            alert('Error compressing PDFs. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    async function compressPdf(file) {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const existingPdfBytes = await file.arrayBuffer();
        const existingPdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const copiedPages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
        return await pdfDoc.save();
    }

    async function compressPdfWithSizeSettings(file, percentage) {
        const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        const numPages = pdf.numPages;
        const images = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 }); // Set higher scale for better resolution
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            let quality = getQuality(percentage);
            if (percentage === 100) {
                quality = 1.0; // Highest quality for 100% percentage
            }
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg', quality));
        }

        return await createPdfFromImages(images);
    }

    function getQuality(percentage) {
        if (percentage === 100) {
            return 1.0; // Highest quality
        }
        const qualityMap = {
            1: 0.1,
            2: 0.2,
            3: 0.3,
            4: 0.4,
            5: 0.5,
            6: 0.6,
            7: 0.7,
            8: 0.8,
            9: 0.9,
            10: 1.0
        };
        const scale = percentage > 90 ? 10 : percentage > 80 ? 8 : percentage > 70 ? 6 : 4;
        return qualityMap[scale];
    }

    async function createPdfFromImages(images) {
        const pdfDoc = await PDFLib.PDFDocument.create();
        for (const imageDataUrl of images) {
            const img = await pdfDoc.embedJpg(imageDataUrl);
            const page = pdfDoc.addPage([img.width, img.height]);
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: img.width,
                height: img.height
            });
        }
        return await pdfDoc.save();
    }

    function setupDownload(files) {
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = async function () {
            // Show loading popup
            loadingPopup.style.display = 'flex';
            
            const zip = new JSZip();
            const pdfFolder = zip.folder("compressed_pdfs");

            for (const file of files) {
                pdfFolder.file(file.name, file.content);
            }

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "compressed_pdfs.zip";
            a.click();
            URL.revokeObjectURL(url);

            // Hide loading popup
            loadingPopup.style.display = 'none';
        };
    }

    // Event listener for reset button
    document.getElementById('reset-btn').addEventListener('click', function () {
        files = [];
        fileList.innerHTML = '';
        outputFileList.innerHTML = '';
        pdfInput.value = ''; // Reset input file

        // Show "Drag & Drop PDF-nya di sini gan" text
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }

        // Hide download button
        downloadBtn.style.display = 'none';
    });

    // Synchronize slider and input for percentage
    percentageSlider.addEventListener('input', function () {
        percentageInput.value = percentageSlider.value;
        console.log('Percentage Slider Value:', percentageSlider.value);
    });

    percentageInput.addEventListener('input', function () {
        percentageSlider.value = percentageInput.value;
        console.log('Percentage Input Value:', percentageInput.value);
    });
});
