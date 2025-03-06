document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById("file");
    const fileList = document.getElementById("file-list");
    const dropSection = document.getElementById("drop-section");
    const resultDiv = document.getElementById("result");
    const resetBtn = document.getElementById('reset-btn');
    const downloadPngBtn = document.getElementById("download-png-btn");
    const downloadTifBtn = document.getElementById("download-tif-btn");
    const downloadTiffBtn = document.getElementById("download-tiff-btn")
    const loadingPopup = document.getElementById("loading-popup");

    let selectedFile = null; // Variable to store the selected file
    let apiKeys = [];
    let currentApiKeyIndex = 0;

    // Load API keys from JSON
    fetch('../assets/list/rembgapi.json')
        .then(response => response.json())
        .then(data => {
            apiKeys = data.api_keys;
        })
        .catch(error => console.error('Error loading API keys:', error));

    // Handle file selection
    fileInput.addEventListener('change', function () {
        handleNewFile(Array.from(fileInput.files));
    });

    // Handle drag and drop
    dropSection.addEventListener('click', function () {
        fileInput.click();
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
        handleNewFile(Array.from(e.dataTransfer.files));
    });

    // Handle reset
    resetBtn.addEventListener('click', function () {
        resetFileInput();
    });

    // Handle paste
    document.addEventListener('paste', function (e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                handleNewFile([file]);
                break;
            }
        }
    });

    // Handle remove background button
    document.querySelector('.button-section button').addEventListener('click', function () {
        if (selectedFile) {
            showLoading();
            removeBackground(selectedFile);
        } else {
            alert('Please upload an image.');
        }
    });

    // Handle download buttons
    downloadPngBtn.addEventListener('click', function () {
        if (downloadPngBtn.href) {
            const link = document.createElement('a');
            link.href = downloadPngBtn.href;
            link.download = 'background_removed.png';
            link.click();
        }
    });

    downloadTifBtn.addEventListener('click', function () {
        if (downloadTifBtn.href) {
            const link = document.createElement('a');
            link.href = downloadTifBtn.href;
            link.download = 'background_removed.tif';
            link.click();
        }
    });

    downloadTiffBtn.addEventListener('click', function () {
        if (downloadTiffBtn.href) {
            const link = document.createElement('a');
            link.href = downloadTiffBtn.href;
            link.download = 'background_removed.tiff';
            link.click();
        }
    });

    function handleNewFile(files) {
        if (files.length > 0) {
            resetFileInput();
            displayFiles(files);
            selectedFile = files[0]; // Store the selected file
        }
    }

    function displayFiles(files) {
        fileList.innerHTML = '';
        resultDiv.innerHTML = '';
        downloadPngBtn.style.display = 'none'; // Hide the download buttons initially
        downloadTifBtn.style.display = 'none';
        downloadTiffBtn.style.display = 'none';

        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.setAttribute('data-index', index);

            const fileIcon = document.createElement('img');
            fileIcon.src = 'assets/img/img.png';
            fileIcon.alt = 'Image Icon';

            const fileName = document.createElement('span');
            fileName.textContent = truncateFileName(file.name, 15);

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);
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

    function resetFileInput() {
        fileInput.value = '';
        fileList.innerHTML = '';
        resultDiv.innerHTML = '';
        selectedFile = null; // Reset the selected file
        downloadPngBtn.style.display = 'none'; // Hide the download buttons when reset
        downloadTifBtn.style.display = 'none';
        downloadTiffBtn.style.display = 'none';
        const dropText = dropSection.querySelector('p');
        if (dropText) {
            dropText.style.display = 'block';
        }
    }

    function showLoading() {
        loadingPopup.style.display = 'flex';
    }

    function hideLoading() {
        loadingPopup.style.display = 'none';
    }

    function removeBackground(file) {
        if (currentApiKeyIndex >= apiKeys.length) {
            console.log('All API keys failed, retrying from the first key');
            currentApiKeyIndex = 0; // Reset index to retry from the first key
        }

        console.log('Using API key:', apiKeys[currentApiKeyIndex]);

        const formData = new FormData();
        formData.append("image_file", file);

        fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": apiKeys[currentApiKeyIndex]
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('API key failed: ' + response.statusText);
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const image = new Image();
            image.src = url;
            image.onload = () => {
                cropToFit(image, 'image/png').then(croppedImageURL => {
                    displayResult(croppedImageURL, url);
                    hideLoading();
                });
            };
        })
        .catch(error => {
            console.error('Error:', error);
            currentApiKeyIndex++; // Move to the next API key
            removeBackground(file); // Retry with the next API key
        });
    }

    function cropToFit(image, format) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const { data } = imageData;
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = data[index + 3];
                    if (alpha > 0) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            const croppedWidth = maxX - minX + 1;
            const croppedHeight = maxY - minY + 1;
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = croppedWidth;
            croppedCanvas.height = croppedHeight;
            const croppedCtx = croppedCanvas.getContext('2d');
            croppedCtx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

            croppedCanvas.toBlob(blob => {
                const croppedImageURL = URL.createObjectURL(blob);
                resolve(croppedImageURL);
            }, format);
        });
    }

    function displayResult(croppedImageURL, originalImageURL) {
        const image = new Image();
        image.src = croppedImageURL;
        resultDiv.appendChild(image);

        // Show and configure the download buttons
        downloadPngBtn.style.display = 'block';
        downloadTifBtn.style.display = 'block';
        downloadTiffBtn.style.display = 'block';
        downloadPngBtn.href = croppedImageURL;
        downloadTifBtn.href = originalImageURL.replace('image/png', 'image/tif'); // Replace format for TIF
        downloadTiffBtn.href = originalImageURL.replace('image/png', 'image/tiff'); // Replace format for TIF
    }
});
