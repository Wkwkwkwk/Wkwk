document.addEventListener('DOMContentLoaded', function () {
    // Set workerSrc for pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

    const convertBtn = document.getElementById('convert-btn');
    const pdfInput = document.getElementById('pdf');
    const output = document.getElementById('output');
    const dropSection = document.getElementById('drop-section');
    const fileList = document.getElementById('file-list');
    const outputFileList = document.getElementById('output-file-list');
    const downloadBtn = document.getElementById('download-btn');
    const loadingPopup = document.getElementById('loading-popup');
    const loadingPopupZip = document.createElement('div');
    loadingPopupZip.className = 'loading-popup-zip';
    loadingPopupZip.innerHTML = '<div class="loading-spinner-zip"></div><p>Mengemas file ke dalam ZIP... Mohon tunggu...</p>';
    document.body.appendChild(loadingPopupZip);
    const errorPopup = document.getElementById('error-popup');
    const closeErrorPopup = document.getElementById('close-error-popup');
    let files = [];
    let results = [];

    if (dropSection) {
        dropSection.addEventListener('click', function (e) {
            if (e.target.tagName === 'BUTTON') {
                return; // Prevent triggering file input if buttons are clicked
            }
            pdfInput.click();
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
            files = [...Array.from(e.dataTransfer.files)];
            displayFiles(files);
        });
    }

    if (pdfInput) {
        pdfInput.addEventListener('change', function () {
            files = [...Array.from(pdfInput.files)];
            displayFiles(files);
        });
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', function () {
            if (files.length === 0) {
                alert('Please upload at least one PDF file.');
                return;
            }
            // Show loading popup
            loadingPopup.style.display = 'flex';

            handleFiles(files);
        });
    }

    if (downloadBtn) {
        downloadBtn.onclick = async () => {
            loadingPopupZip.style.display = 'flex';
            const zip = new JSZip();
            results.forEach(result => {
                zip.file(result.name, result.blob);
            });

            const content = await zip.generateAsync({ type: "blob" });
            loadingPopupZip.style.display = 'none';
            const a = document.createElement('a');
            const url = URL.createObjectURL(content);
            a.href = url;
            a.download = "ConvertedPDFsToExcel.zip";
            a.click();
            URL.revokeObjectURL(url);
        };
    }

    if (closeErrorPopup) {
        closeErrorPopup.addEventListener('click', function () {
            errorPopup.style.display = 'none';
        });
    }

    if (document.getElementById('reset-btn')) {
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

            output.innerHTML = '';
            downloadBtn.style.display = 'none';
        });
    }

    if (document.getElementById('marquee')) {
        document.getElementById('marquee').addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

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
            outputFileIcon.src = 'assets/img/excel.png'; // Path to your Excel icon
            outputFileIcon.alt = 'Excel Icon';

            const outputFileName = document.createElement('span');
            outputFileName.textContent = truncateFileName(file.name.replace('.pdf', '.xlsx'), 15);

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
        results = [];
        for (const file of files) {
            const fileReader = new FileReader();
            fileReader.onload = async event => {
                const typedarray = new Uint8Array(event.target.result);
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                const pdfDoc = await loadingTask.promise;
                const pagesText = [];
                for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                    const page = await pdfDoc.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageItems = textContent.items.map(item => ({
                        str: item.str,
                        transform: item.transform,
                        font: item.fontName // Capture font information
                    }));
                    pagesText.push(pageItems);
                }

                // Convert text to table-like format
                const structuredData = structureData(pagesText);

                // Create and download Excel file
                const excelBlob = createExcelBlob(structuredData);
                results.push({ name: file.name.replace('.pdf', '.xlsx'), blob: excelBlob });

                if (results.length === files.length) {
                    loadingPopup.style.display = 'none';
                    setupDownload(results);
                }
            };
            fileReader.readAsArrayBuffer(file);
        }
    }

    function structureData(pagesText) {
        const table = [];
        let currentPage = [];
        let currentRow = [];
        let lastY = null;

        pagesText.forEach(page => {
            page.forEach(item => {
                const [x, y] = item.transform.slice(4, 6);
                if (lastY === null) {
                    lastY = y;
                }

                if (Math.abs(y - lastY) > 10) {
                    currentPage.push(currentRow);
                    currentRow = [];
                    lastY = y;
                }

                currentRow.push({
                    text: item.str,
                    align: item.transform[0] === 1 ? 'left' : 'right', // Simple left/right alignment check
                    bold: item.font && item.font.includes('Bold') // Check if font is bold
                });
            });

            if (currentRow.length > 0) {
                currentPage.push(currentRow);
            }

            table.push(...currentPage);
            currentPage = [];
            currentRow = [];
            lastY = null;
        });

        return table;
    }

    function createExcelBlob(data) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data.map(row => row.map(cell => cell.text)));
        
        // Apply styles
        data.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellRef = XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });
                if (!ws[cellRef]) ws[cellRef] = {};
                if (cell.bold) {
                    ws[cellRef].s = {
                        font: {
                            bold: true
                        }
                    };
                }
                if (cell.align === 'right') {
                    if (!ws[cellRef].s) ws[cellRef].s = {};
                    ws[cellRef].s.alignment = { horizontal: 'right' };
                }
            });
        });

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }

    function setupDownload(results) {
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = async () => {
            loadingPopupZip.style.display = 'flex';
            const zip = new JSZip();
            results.forEach(result => {
                zip.file(result.name, result.blob);
            });

            const content = await zip.generateAsync({ type: "blob" });
            loadingPopupZip.style.display = 'none';
            const a = document.createElement('a');
            const url = URL.createObjectURL(content);
            a.href = url;
            a.download = "ConvertedPDFsToExcel.zip";
            a.click();
            URL.revokeObjectURL(url);
        };
    }
});
