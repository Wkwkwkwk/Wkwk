document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById("file");
    const fileList = document.getElementById("file-list");
    const dropSection = document.getElementById("drop-section");
    const resultDiv = document.getElementById("result");
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById("download-btn");
    const loadingPopup = document.getElementById("loading-popup");

    let selectedFile = null; // Variable to store the selected file

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

    // Handle enhance button
    document.getElementById('enhance-btn').addEventListener('click', function () {
        if (selectedFile) {
            showLoading();
            enhanceImage(selectedFile)
                .then(enhancedImageUrl => displayEnhancedImage(enhancedImageUrl))
                .catch(error => {
                    console.error('Error during image enhancement:', error);
                    alert('Error enhancing the image. Please try again.');
                    hideLoading();
                });
        } else {
            alert('Please upload an image.');
        }
    });

    // Handle download button
    downloadBtn.addEventListener('click', function () {
        if (downloadBtn.href) {
            const link = document.createElement('a');
            link.href = downloadBtn.href;
            link.download = 'enhanced_image.png';
            link.click();
        }
    });

    function handleNewFile(files) {
        if (files.length > 0) {
            const file = files[0];
            const fileType = file.type;

            // Check if the file type is supported
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
                alert('File format not supported. Please upload a JPEG, JPG, atau PNG image.');
                resetFileInput();
                return;
            }

            resetFileInput();
            displayFiles(files);
            selectedFile = file; // Store the selected file
        }
    }

    function displayFiles(files) {
        fileList.innerHTML = '';
        resultDiv.innerHTML = '';
        downloadBtn.style.display = 'none'; // Hide the download button initially

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
        downloadBtn.style.display = 'none'; // Hide the download button when reset
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

    async function enhanceImage(file) {
        try {
            const pica = window.pica();
            const imageBitmap = await createImageBitmap(file);
            const canvas = document.createElement('canvas');
            const outputCanvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = imageBitmap.width;
            canvas.height = imageBitmap.height;
            ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

            // Increase resolution by factor of 2
            outputCanvas.width = canvas.width * 2;
            outputCanvas.height = canvas.height * 2;

            await pica.resize(canvas, outputCanvas);

            const enhancedImageUrl = outputCanvas.toDataURL('image/png');
            return enhancedImageUrl;
        } catch (error) {
            throw new Error('Error enhancing the image');
        }
    }

    function displayEnhancedImage(enhancedImageUrl) {
        resultDiv.innerHTML = `
            <p>Enhanced Image:</p>
        `;
        const enhancedImageElement = document.createElement('img');
        enhancedImageElement.src = enhancedImageUrl;
        resultDiv.appendChild(enhancedImageElement);

        downloadBtn.style.display = 'block';
        downloadBtn.href = enhancedImageUrl;

        hideLoading(); // Hide loading popup when done
    }
});
