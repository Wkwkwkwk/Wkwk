document.addEventListener('DOMContentLoaded', function () {
    const splitBtn = document.getElementById('split-btn');
    const pdfInput = document.getElementById('pdf');
    const qrDisplay = document.getElementById('qr-display');
    const downloadSection = document.getElementById('download-section');
    const dropSection = document.getElementById('drop-section');
    const fileNameDisplay = document.getElementById('file-name');
    const loadingPopup = document.getElementById('loading-popup');
    const startPageInput = document.getElementById('start-page');
    const endPageInput = document.getElementById('end-page');
    const pagesInput = document.getElementById('pages');
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const resetBtn = document.getElementById('reset-btn');

    let file;
    let pdfDoc;

    dropSection.addEventListener('click', function (e) {
        pdfInput.click();
    });

    pdfInput.addEventListener('change', function () {
        file = pdfInput.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            loadPdf(file);
        }
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
        file = e.dataTransfer.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            loadPdf(file);
        }
    });

    function loadPdf(file) {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result);
                pdfDoc = await PDFLib.PDFDocument.load(typedarray);
                const totalPages = pdfDoc.getPageCount();
                startPageInput.max = totalPages;
                endPageInput.max = totalPages;
                endPageInput.value = totalPages;
            } catch (error) {
                console.error('Error loading PDF:', error);
                alert('Error loading PDF. Please try again.');
            }
        };
        fileReader.readAsArrayBuffer(file);
    }

    splitBtn.addEventListener('click', function () {
        if (!file || !pdfDoc) {
            alert('Please upload a PDF file first.');
            return;
        }

        // Show loading popup
        loadingPopup.style.display = 'flex';

        const activeTab = document.querySelector('.tab-item.active').dataset.tab;
        if (activeTab === 'range-tab') {
            handleRangeSplit();
        } else if (activeTab === 'pages-tab') {
            handlePagesSplit();
        }
    });

    function validatePageNumbers(startPage, endPage, totalPages) {
        if (startPage < 1 || endPage > totalPages || startPage > endPage) {
            alert('Invalid page range.');
            loadingPopup.style.display = 'none';
            return false;
        }
        return true;
    }

    async function handleRangeSplit() {
        try {
            const totalPages = pdfDoc.getPageCount();
            const startPage = parseInt(startPageInput.value);
            const endPage = parseInt(endPageInput.value);

            if (!validatePageNumbers(startPage, endPage, totalPages)) {
                return;
            }

            const newPdfDoc = await PDFLib.PDFDocument.create();
            const pages = await newPdfDoc.copyPages(pdfDoc, [...Array(endPage - startPage + 1).keys()].map(i => i + startPage - 1));
            pages.forEach((page) => newPdfDoc.addPage(page));

            const pdfBytes = await newPdfDoc.save();
            displaySplitPdf(pdfBytes, `Pdf Halaman ${startPage}-${endPage}.pdf`);
        } catch (error) {
            console.error('Error splitting PDF:', error);
            alert('Error splitting PDF. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    async function handlePagesSplit() {
        try {
            const totalPages = pdfDoc.getPageCount();
            const pagesInputValue = pagesInput.value.trim();
            if (!pagesInputValue) {
                alert('Please enter page numbers.');
                loadingPopup.style.display = 'none';
                return;
            }

            const pageNumbers = pagesInputValue.split(',').map(num => parseInt(num.trim()));
            const invalidPage = pageNumbers.find(num => num < 1 || num > totalPages || isNaN(num));
            if (invalidPage) {
                alert(`Invalid page number: ${invalidPage}`);
                loadingPopup.style.display = 'none';
                return;
            }

            downloadSection.innerHTML = '';
            for (const pageNum of pageNumbers) {
                const newPdfDoc = await PDFLib.PDFDocument.create();
                const [page] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
                newPdfDoc.addPage(page);
                const pdfBytes = await newPdfDoc.save();
                displaySplitPdf(pdfBytes, `Pdf Halaman ${pageNum}.pdf`, true);
            }
            loadingPopup.style.display = 'none';
            downloadSection.style.display = 'block';
        } catch (error) {
            console.error('Error splitting PDF:', error);
            alert('Error splitting PDF. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    function displaySplitPdf(pdfBytes, fileName, isMultiple = false) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        if (isMultiple) {
            const downloadButton = document.createElement('button');
            downloadButton.textContent = `Download ${fileName}`;
            downloadButton.onclick = function () {
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
            downloadSection.appendChild(downloadButton);
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.width = '100%';
            iframe.height = '500px';
            qrDisplay.innerHTML = '';
            qrDisplay.appendChild(iframe);

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download PDF Hasilnya';
            downloadBtn.onclick = function () {
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
            downloadSection.innerHTML = '';
            downloadSection.appendChild(downloadBtn);
            downloadSection.style.display = 'block';

            loadingPopup.style.display = 'none';
        }
    }

    // Tab functionality
    tabItems.forEach(tab => {
        tab.addEventListener('click', function () {
            tabItems.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Reset functionality
    resetBtn.addEventListener('click', function () {
        file = null;
        pdfDoc = null;
        pdfInput.value = '';
        fileNameDisplay.textContent = '';
        startPageInput.value = 1;
        endPageInput.value = 1;
        pagesInput.value = '';
        qrDisplay.innerHTML = '';
        downloadSection.innerHTML = '';
        downloadSection.style.display = 'none';

        // Show "Drag & Drop PDF-nya di sini gan" text
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }
    });
});
