document.addEventListener('DOMContentLoaded', function () {
    const convertBtn = document.getElementById('convert-btn');
    const imageInput = document.getElementById('image');
    const fileDisplay = document.getElementById('file-display');
    const outputFileList = document.getElementById('output-file-list');
    const downloadBtn = document.getElementById('download-btn');
    const dropSection = document.getElementById('drop-section');
    const fileList = document.getElementById('file-list');
    const loadingPopup = document.getElementById('loading-popup');
    const resetBtn = document.getElementById('reset-btn');

    let files = [];
    let selectedFormat = 'png'; // Default format

    const formatButtons = {
        'ico': document.getElementById('ico-btn'),
        'jpeg': document.getElementById('jpeg-btn'),
        'png': document.getElementById('png-btn'),
        'pdf': document.getElementById('pdf-btn'),
        'tiff': document.getElementById('tiff-btn'),
        'gif': document.getElementById('gif-btn'),
        'webp': document.getElementById('webp-btn'),
        'bmp': document.getElementById('bmp-btn'),
    };

    Object.keys(formatButtons).forEach(format => {
        formatButtons[format].addEventListener('click', () => selectFormat(format));
    });

    function selectFormat(format) {
        selectedFormat = format;
        Object.keys(formatButtons).forEach(fmt => formatButtons[fmt].classList.remove('active'));
        formatButtons[format].classList.add('active');
    }

    dropSection.addEventListener('click', function () {
        imageInput.click();
    });

    imageInput.addEventListener('change', function () {
        files.push(...Array.from(imageInput.files));
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

    convertBtn.addEventListener('click', function () {
        if (files.length < 1) {
            alert('Please upload at least one image file.');
            return;
        }
        // Show loading popup
        loadingPopup.style.display = 'flex';
        handleFiles(files, selectedFormat);
    });

    resetBtn.addEventListener('click', function () {
        files = [];
        fileList.innerHTML = '';
        outputFileList.innerHTML = '';
        imageInput.value = ''; // Reset input file

        // Show "Drag & Drop gambar di sini gan" text
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }

        // Hide download button and file display
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
            const fileType = file.type.split('/')[1];
            fileIcon.src = fileType === 'pdf' ? 'assets/img/pdf.png' : `assets/img/format${fileType}.png`;
            fileIcon.alt = `${fileType} Icon`;

            const fileName = document.createElement('span');
            fileName.textContent = truncateFileName(file.name, 15);

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);

            const outputFileItem = document.createElement('div');
            outputFileItem.classList.add('file-item');
            outputFileItem.setAttribute('data-index', index);

            const outputFileIcon = document.createElement('img');
            outputFileIcon.src = selectedFormat === 'pdf' ? 'assets/img/pdf.png' : `assets/img/format${selectedFormat}.png`;
            outputFileIcon.alt = `${selectedFormat} Icon`;

            const outputFileName = document.createElement('span');
            outputFileName.textContent = truncateFileName(file.name, 15).replace(/\.[^/.]+$/, "") + `.${selectedFormat}`;

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
        try {
            const images = [];
            
            console.log('Starting file conversion...'); // Log tambahan
            for (const file of files) {
                console.log(`Converting file: ${file.name}`); // Log tambahan
                const img = await convertImage(file, format);
                images.push(img);
            }

            displayImages(images);
            setupDownload(images);

            loadingPopup.style.display = 'none';

            console.log('Images converted and displayed successfully.');
        } catch (error) {
            console.error('Error converting images:', error);
            alert('Error converting images. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    function setupDownload(images) {
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = async function () {
            // Tampilkan popup loading
            loadingPopup.style.display = 'flex';

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
                a.download = "file_hasil_konversi.zip";
                a.click();
                URL.revokeObjectURL(url);

                // Sembunyikan popup loading setelah proses selesai
                loadingPopup.style.display = 'none';
            }).catch(function (error) {
                console.error('Error generating ZIP file:', error);
                alert('Error generating ZIP file. Please try again.');

                // Sembunyikan popup loading jika terjadi kesalahan
                loadingPopup.style.display = 'none';
            });
        };
    }

    async function convertImage(file, format) {
        if (format === 'pdf') {
            return await convertImageToPdf(file);
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                if (file.type === 'image/tiff' || file.type === 'image/tif') {
                    const buffer = event.target.result;
                    const ifds = UTIF.decode(buffer);
                    UTIF.decodeImage(buffer, ifds[0]);
                    const firstPage = ifds[0];
                    const rgba = UTIF.toRGBA8(firstPage);
                    const width = firstPage.width;
                    const height = firstPage.height;
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.createImageData(width, height);
                    imageData.data.set(rgba);
                    ctx.putImageData(imageData, 0, 0);
                    handleCanvasConversion(canvas, file, format, resolve, reject);
                } else {
                    const imgElement = new Image();
                    imgElement.onload = function () {
                        const canvas = document.createElement('canvas');
                        canvas.width = imgElement.width;
                        canvas.height = imgElement.height;
                        const context = canvas.getContext('2d');
                        context.drawImage(imgElement, 0, 0);
                        handleCanvasConversion(canvas, file, format, resolve, reject);
                    };
                    imgElement.onerror = () => reject(new Error('Image loading failed.'));
                    imgElement.src = event.target.result;
                }
            };
            reader.onerror = () => reject(new Error('File reading failed.'));
            reader.readAsArrayBuffer(file); // Use readAsArrayBuffer for TIFF files
        });
    }

    function handleCanvasConversion(canvas, file, format, resolve, reject) {
        let mimeType;
        switch (format) {
            case 'ico':
                mimeType = 'image/x-icon';
                break;
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'tiff':
                mimeType = 'image/tiff';
                break;
            case 'gif':
                mimeType = 'image/gif';
                break;
            case 'webp':
                mimeType = 'image/webp';
                break;
            case 'bmp':
                mimeType = 'image/bmp';
                break;
            default:
                mimeType = 'image/png';
        }
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Conversion to blob failed.'));
                return;
            }
            const url = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = url;
            img.alt = file.name.replace(/\.[^/.]+$/, "") + `.${format}`;
            resolve(img);
        }, mimeType);
    }

    async function convertImageToPdf(file) {
        const { jsPDF } = window.jspdf;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgElement = new Image();
                imgElement.onload = function () {
                    const pdf = new jsPDF({
                        orientation: imgElement.width > imgElement.height ? 'landscape' : 'portrait',
                        unit: 'px',
                        format: [imgElement.width, imgElement.height]
                    });
                    pdf.addImage(imgElement, 'JPEG', 0, 0, imgElement.width, imgElement.height);
                    const url = pdf.output('bloburl');
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = file.name.replace(/\.[^/.]+$/, "") + `.pdf`;
                    resolve(img);
                };
                imgElement.onerror = reject;
                imgElement.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function displayImages(images) {
        outputFileList.innerHTML = '';
        images.forEach((img, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.setAttribute('data-index', index);

            const fileIcon = document.createElement('img');
            fileIcon.src = selectedFormat === 'pdf' ? 'assets/img/pdf.png' : img.src;
            fileIcon.alt = 'Image Icon';

            const fileName = document.createElement('span');
            fileName.textContent = img.alt;

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            outputFileList.appendChild(fileItem);
        });
    }
});
