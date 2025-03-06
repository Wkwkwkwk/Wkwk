document.addEventListener('DOMContentLoaded', function () {
    const mergeBtn = document.getElementById('merge-btn');
    const pdfInput = document.getElementById('pdf');
    const qrDisplay = document.getElementById('qr-display');
    const downloadBtn = document.getElementById('download-btn');
    const dropSection = document.getElementById('drop-section');
    const fileList = document.getElementById('file-list');
    const loadingPopup = document.getElementById('loading-popup');

    const rightPanel = document.querySelector('.right-panel'); 
    const motorContainer = document.querySelector('.motor-container');

    let files = [];


    dropSection.addEventListener('click', function () {
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

    mergeBtn.addEventListener('click', function () {
        rightPanel.classList.remove('active'); // Reset animasi sebelum diaktifkan kembali
        motorContainer.classList.add('hidden'); // Sembunyikan GIF motor

        // Tampilkan panel kanan dengan animasi
        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10); // Delay untuk memastikan transisi terlihat
        
        if (files.length < 1) {
            alert('Please upload at least one PDF file.');
            return;
        }
        // Show loading popup
        loadingPopup.style.display = 'flex';
        handleFiles(files);
    });

    function displayFiles(files) {
        fileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            const fileIcon = document.createElement('img');
            fileIcon.src = 'assets/img/pdf.png'; // Path to your PDF icon
            fileIcon.alt = 'PDF Icon';

            const fileName = document.createElement('span');
            fileName.textContent = truncateFileName(file.name, 35);

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);
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
            const mergedPdfBytes = await mergePdfPages(files);

            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Display PDF in the right panel
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.width = '100%';
            iframe.height = '400px';
            qrDisplay.innerHTML = '';
            qrDisplay.appendChild(iframe);

            // Show download button
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = function () {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'hasil.pdf';
                a.click();
                window.URL.revokeObjectURL(url);
            };

            // Hide loading popup
            loadingPopup.style.display = 'none';

            console.log('PDF merged and displayed successfully.');
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Error merging PDFs. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    async function mergePdfPages(files) {
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of files) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdfDocument = await loadingTask.promise;

                // Render the first two pages
                const page1ImageData = await renderPageToImage(pdfDocument, 1);
                const page2ImageData = await renderPageToImage(pdfDocument, 2);

                if (page1ImageData && page2ImageData) {
                    const page1Image = await mergedPdf.embedPng(page1ImageData);
                    const page2Image = await mergedPdf.embedPng(page2ImageData);

                    const width = page1Image.width + page2Image.width;
                    const height = Math.max(page1Image.height, page2Image.height);

                    const newPage = mergedPdf.addPage([width, height]);

                    newPage.drawImage(page1Image, {
                        x: 0,
                        y: 0,
                        width: page1Image.width,
                        height: page1Image.height,
                    });

                    newPage.drawImage(page2Image, {
                        x: page1Image.width,
                        y: 0,
                        width: page2Image.width,
                        height: page2Image.height,
                    });

                    console.log('Merged pages as images side by side.');
                } else {
                    console.warn('Document does not have enough pages:', file.name);
                }
            } catch (error) {
                console.error('Error processing document:', file.name, error);
            }
        }

        console.log('All pages merged successfully.');
        return await mergedPdf.save();
    }

    async function renderPageToImage(pdfDocument, pageNumber) {
        try {
            const page = await pdfDocument.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 2 }); // Adjust scale as needed

            // Create a canvas element to render the PDF page
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;

            // Convert canvas to image data URL
            const imageDataUrl = canvas.toDataURL('image/png');

            return imageDataUrl;
        } catch (error) {
            console.error('Error rendering page to image:', error);
            return null;
        }
    }

    // Event listener for reset button
    document.getElementById('reset-btn').addEventListener('click', function () {
        files = [];
        fileList.innerHTML = '';
        pdfInput.value = ''; // Reset input file

        // Show "Drag & Drop PDF-nya di sini gan" text
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }

        // Hide download button and QR display
        qrDisplay.innerHTML = '';
        downloadBtn.style.display = 'none';

        rightPanel.classList.remove('active');
        motorContainer.classList.remove('hidden');
    });
});
