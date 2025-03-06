document.addEventListener('DOMContentLoaded', function () {
    const compressBtn = document.getElementById('compress-btn');
    const imageInput = document.getElementById('image');
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
            alert('Please upload at least one image file.');
            return;
        }
        // Show loading popup
        loadingPopup.style.display = 'flex';

        if (useSizeSettings) {
            const percentage = parseInt(percentageInput.value, 10);
            console.log('Compressing images with percentage:', percentage);
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
            const fileType = file.type.split('/')[1];
            fileIcon.src = `assets/img/format${fileType}.png`;
            fileIcon.alt = `${fileType} Icon`;

            // Check if the file icon exists, if not, use a default icon
            fileIcon.onerror = () => fileIcon.src = 'assets/img/formatdefault.png';

            const fileName = document.createElement('span');
            fileName.textContent = truncateFileName(file.name, 15);

            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileList.appendChild(fileItem);

            const outputFileItem = document.createElement('div');
            outputFileItem.classList.add('file-item');
            outputFileItem.setAttribute('data-index', index);

            const outputFileIcon = document.createElement('img');
            outputFileIcon.src = `assets/img/format${fileType}.png`;
            outputFileIcon.alt = `${fileType} Icon`;

            // Check if the output file icon exists, if not, use a default icon
            outputFileIcon.onerror = () => outputFileIcon.src = 'assets/img/formatdefault.png';

            const outputFileName = document.createElement('span');
            outputFileName.textContent = truncateFileName(file.name, 15).replace(/\.[^/.]+$/, "") + `_compressed.${fileType}`;

            outputFileItem.appendChild(outputFileIcon);
            outputFileItem.appendChild(outputFileName);
            outputFileList.appendChild(outputFileItem);
        });

        // Remove "Drag & Drop gambar di sini gan" text
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
                console.log(`Compressing file: ${file.name}`);
                const compressedImageBlob = await compressImage(file);
                compressedFiles.push({
                    name: file.name.replace(/\.[^/.]+$/, "") + `_compressed.${file.type.split('/')[1]}`,
                    content: compressedImageBlob
                });
            }

            setupDownload(compressedFiles);
            loadingPopup.style.display = 'none';
        } catch (error) {
            console.error('Error compressing images:', error);
            alert('Error compressing images. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    async function handleFilesWithSizeSettings(files, percentage) {
        try {
            const compressedFiles = [];
            for (const file of files) {
                console.log(`Compressing file with size settings: ${file.name}`);
                const compressedImageBlob = await compressImageWithSizeSettings(file, percentage);
                compressedFiles.push({
                    name: file.name.replace(/\.[^/.]+$/, "") + `_compressed.${file.type.split('/')[1]}`,
                    content: compressedImageBlob
                });
            }

            setupDownload(compressedFiles);
            loadingPopup.style.display = 'none';
        } catch (error) {
            console.error('Error compressing images:', error);
            alert('Error compressing images. Please try again.');
            loadingPopup.style.display = 'none';
        }
    }

    function getQuality(percentage) {
        return percentage / 100;
    }

    async function compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                if (file.type === 'image/tiff' || file.type === 'image/tif') {
                    try {
                        console.log('Processing TIFF image...');
                        const ifds = UTIF.decode(event.target.result);
                        UTIF.decodeImages(event.target.result, ifds);
                        const rgba = UTIF.toRGBA8(ifds[0]);
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = ifds[0].width;
                        canvas.height = ifds[0].height;
                        const imageData = ctx.createImageData(ifds[0].width, ifds[0].height);
                        imageData.data.set(rgba);
                        ctx.putImageData(imageData, 0, 0);
                        canvas.toBlob((blob) => {
                            if (!blob) {
                                console.error('Conversion to blob failed.');
                                reject(new Error('Conversion to blob failed.'));
                                return;
                            }
                            resolve(blob);
                        }, 'image/png'); // Convert TIFF to PNG for browser compatibility
                    } catch (error) {
                        console.error('Error processing TIFF:', error);
                        reject(new Error('Error processing TIFF.'));
                    }
                } else {
                    const imgElement = new Image();
                    imgElement.onload = function () {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = imgElement.width;
                            canvas.height = imgElement.height;
                            const context = canvas.getContext('2d');
                            context.drawImage(imgElement, 0, 0);
                            canvas.toBlob((blob) => {
                                if (!blob) {
                                    console.error('Conversion to blob failed.');
                                    reject(new Error('Conversion to blob failed.'));
                                    return;
                                }
                                resolve(blob);
                            }, file.type);
                        } catch (error) {
                            console.error('Error creating canvas or blob:', error);
                            reject(new Error('Error creating canvas or blob.'));
                        }
                    };
                    imgElement.onerror = (error) => {
                        console.error('Image loading failed:', error);
                        reject(new Error('Image loading failed.'));
                    };
                    imgElement.src = URL.createObjectURL(file);
                }
            };
            reader.onerror = (error) => {
                console.error('File reading failed:', error);
                reject(new Error('File reading failed.'));
            };
            reader.readAsArrayBuffer(file); // Use readAsArrayBuffer to support TIFF
        });
    }

    async function compressImageWithSizeSettings(file, percentage) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                if (file.type === 'image/tiff' || file.type === 'image/tif') {
                    try {
                        console.log('Processing TIFF image with size settings...');
                        const ifds = UTIF.decode(event.target.result);
                        UTIF.decodeImages(event.target.result, ifds);
                        const rgba = UTIF.toRGBA8(ifds[0]);
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = ifds[0].width;
                        canvas.height = ifds[0].height;
                        const imageData = ctx.createImageData(ifds[0].width, ifds[0].height);
                        imageData.data.set(rgba);
                        ctx.putImageData(imageData, 0, 0);
                        const quality = getQuality(percentage);
                        canvas.toBlob((blob) => {
                            if (!blob) {
                                console.error('Conversion to blob failed.');
                                reject(new Error('Conversion to blob failed.'));
                                return;
                            }
                            resolve(blob);
                        }, 'image/png', quality); // Convert TIFF to PNG for browser compatibility
                    } catch (error) {
                        console.error('Error processing TIFF:', error);
                        reject(new Error('Error processing TIFF.'));
                    }
                } else {
                    const imgElement = new Image();
                    imgElement.onload = function () {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = imgElement.width;
                            canvas.height = imgElement.height;
                            const context = canvas.getContext('2d');
                            context.drawImage(imgElement, 0, 0);
                            const quality = getQuality(percentage);
                            canvas.toBlob((blob) => {
                                if (!blob) {
                                    console.error('Conversion to blob failed.');
                                    reject(new Error('Conversion to blob failed.'));
                                    return;
                                }
                                resolve(blob);
                            }, file.type, quality);
                        } catch (error) {
                            console.error('Error creating canvas or blob:', error);
                            reject(new Error('Error creating canvas or blob.'));
                        }
                    };
                    imgElement.onerror = (error) => {
                        console.error('Image loading failed:', error);
                        reject(new Error('Image loading failed.'));
                    };
                    imgElement.src = URL.createObjectURL(file);
                }
            };
            reader.onerror = (error) => {
                console.error('File reading failed:', error);
                reject(new Error('File reading failed.'));
            };
            reader.readAsArrayBuffer(file); // Use readAsArrayBuffer to support TIFF
        });
    }

    function setupDownload(files) {
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = async function () {
            // Show loading popup
            loadingPopup.style.display = 'flex';

            const zip = new JSZip();
            const imgFolder = zip.folder("compressed_images");

            for (const file of files) {
                imgFolder.file(file.name, file.content);
            }

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "compressed_images.zip";
            a.click();
            URL.revokeObjectURL(url);

            // Hide loading popup after download starts
            loadingPopup.style.display = 'none';
        };
    }

    // Event listener for reset button
    document.getElementById('reset-btn').addEventListener('click', function () {
        files = [];
        fileList.innerHTML = '';
        outputFileList.innerHTML = '';
        imageInput.value = ''; // Reset input file

        // Show "Drag & Drop gambar di sini gan" text
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
