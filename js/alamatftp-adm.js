document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const nameListContainer = document.getElementById('name-list');
    const ftpDisplay = document.getElementById('ftp-display');
    const rightPanel = document.querySelector('.right-panel');
    const motorContainer = document.querySelector('.motor-container');

    // Tombol “Tambah FTP” (untuk menambah alamat ftp pada user terpilih)
    const addFtpBtn = document.getElementById('addFtpBtn');
    // Tombol “Tambah User”
    const addUserBtn = document.getElementById('addUserBtn');
    // Tombol toggle delete mode
    const toggleDeleteModeBtn = document.getElementById('toggleDeleteModeBtn');

    let allUsers = [];
    let currentSelectedUser = null;

    // Mode hapus user (default: off)
    let deleteMode = false;

    // --------------------------------------------------------
    // 1. AMBIL DATA FIRESTORE
    // --------------------------------------------------------
    db.collection("ftpUsers").get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            const userData = doc.data();
            if (!userData.name || typeof userData.name !== "string") {
                console.warn("Skipping doc with missing name field:", doc.id, userData);
                return;
            }

            const ftpArray = Array.isArray(userData.ftp) ? userData.ftp : [];
            allUsers.push({
                docId: doc.id,
                name: userData.name,
                ftp: ftpArray
            });
        });
        displayUsers(''); // Tampilkan semua user di panel kiri
    })
    .catch((error) => {
        console.error("Error loading data from Firestore:", error);
    });

    // --------------------------------------------------------
    // 2. MENAMPILKAN DAFTAR USER DI PANEL KIRI
    // --------------------------------------------------------
    function displayUsers(filter) {
        nameListContainer.innerHTML = '';

        const filtered = allUsers.filter(user =>
            (user.name || "").toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(user => {
            // Kontainer utama (flex)
            const nameItem = document.createElement('div');
            nameItem.classList.add('name-item');

            // Span nama user
            const userNameSpan = document.createElement('span');
            userNameSpan.textContent = user.name;

            // Tombol Delete User
            const deleteUserBtn = document.createElement('button');
            deleteUserBtn.classList.add('delete-user-btn');
            deleteUserBtn.textContent = 'DELETE';

            // Tampilkan/hide sesuai deleteMode
            if (deleteMode) {
                deleteUserBtn.style.display = 'inline-block';
            } else {
                deleteUserBtn.style.display = 'none';
            }

            // Event klik tombol Delete => hapus user
            deleteUserBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // jangan buka panel FTP
                openConfirmModal({
                    title: 'Konfirmasi Hapus User',
                    description: `Yakin ingin menghapus user "${user.name}"?`,
                    onYes: () => {
                        db.collection("ftpUsers").doc(user.docId).delete()
                        .then(() => {
                            showPopup(`User "${user.name}" berhasil dihapus.`);
                            // Hapus dari array
                            allUsers = allUsers.filter(u => u.docId !== user.docId);
                            // Refresh list
                            displayUsers('');
                            // Jika user dihapus sedang dipilih, tutup panel kanan
                            if (currentSelectedUser && currentSelectedUser.docId === user.docId) {
                                rightPanel.classList.remove('active');
                                motorContainer.classList.remove('hidden');
                                addFtpBtn.style.display = 'none';
                                ftpDisplay.innerHTML = '';
                                currentSelectedUser = null;
                            }
                        })
                        .catch(err => console.error("Error deleting user:", err));
                    }
                });
            });

            // Klik pada baris user => tampilkan FTP
            nameItem.addEventListener('click', () => {
                currentSelectedUser = user;
                document.querySelectorAll('.name-item').forEach(item => item.classList.remove('selected'));
                nameItem.classList.add('selected');
                showFtp(user);
            });

            // Masukkan ke DOM
            nameItem.appendChild(userNameSpan);
            nameItem.appendChild(deleteUserBtn);
            nameListContainer.appendChild(nameItem);
        });
    }

    // --------------------------------------------------------
    // 3. Toggle Delete Mode
    // --------------------------------------------------------
    toggleDeleteModeBtn.addEventListener('click', () => {
        deleteMode = !deleteMode;
        // Ubah teks tombol
        toggleDeleteModeBtn.textContent = deleteMode ? 'DELETE MODE ON' : 'DELETE MODE OFF';
        // Refresh list agar tombol delete muncul/hilang
        displayUsers(searchInput.value.trim());
    });

    // --------------------------------------------------------
    // 4. MENAMPILKAN ALAMAT FTP DI PANEL KANAN
    // --------------------------------------------------------
    function showFtp(user) {
        ftpDisplay.innerHTML = '';
        rightPanel.classList.remove('active');
        motorContainer.classList.add('hidden');

        if (!user.ftp || user.ftp.length === 0) {
            rightPanel.classList.remove('active');
            motorContainer.classList.remove('hidden');
            addFtpBtn.style.display = 'block';
            return;
        }

        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10);

        addFtpBtn.style.display = 'block';

        user.ftp.forEach((ftpAddress) => {
            const ftpContainer = document.createElement('div');
            ftpContainer.classList.add('ftp-container');

            const ftpText = document.createElement('span');
            ftpText.classList.add('ftp-text');
            ftpText.textContent = ftpAddress;

            // Tombol COPY
            const copyBtn = document.createElement('button');
            copyBtn.classList.add('copy-btn');
            copyBtn.textContent = 'COPY';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(ftpAddress)
                    .then(() => showPopup(`FTP berhasil disalin: ${ftpAddress}`))
                    .catch((err) => console.error('Gagal menyalin:', err));
            });

            // Tombol EDIT
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'EDIT';
            editBtn.addEventListener('click', () => {
                openModalForm({
                    title: 'Edit Alamat FTP',
                    description: 'Ubah alamat FTP di bawah:',
                    defaultValue: ftpAddress,
                    onConfirm: (newVal) => {
                        if (newVal && newVal !== ftpAddress) {
                            const idx = user.ftp.indexOf(ftpAddress);
                            if (idx !== -1) {
                                user.ftp[idx] = newVal;
                                db.collection("ftpUsers").doc(user.docId)
                                    .update({ ftp: user.ftp })
                                    .then(() => {
                                        showPopup(`Alamat FTP berhasil diubah: ${newVal}`);
                                        showFtp(user);
                                    })
                                    .catch((err) => console.error("Gagal update:", err));
                            }
                        }
                    }
                });
            });

            // Tombol DELETE
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'DELETE';
            deleteBtn.addEventListener('click', () => {
                openConfirmModal({
                    title: 'Konfirmasi Hapus',
                    description: `Yakin ingin menghapus alamat FTP: "${ftpAddress}"?`,
                    onYes: () => {
                        openCaptchaModal({
                            onSuccess: () => {
                                const index = user.ftp.indexOf(ftpAddress);
                                if (index !== -1) {
                                    user.ftp.splice(index, 1);
                                    db.collection("ftpUsers").doc(user.docId)
                                        .update({ ftp: user.ftp })
                                        .then(() => {
                                            showPopup(`Alamat FTP berhasil dihapus: ${ftpAddress}`);
                                            showFtp(user);
                                        })
                                        .catch((err) => console.error("Gagal menghapus FTP:", err));
                                }
                            }
                        });
                    }
                });
            });

            ftpContainer.appendChild(ftpText);
            ftpContainer.appendChild(copyBtn);
            ftpContainer.appendChild(editBtn);
            ftpContainer.appendChild(deleteBtn);
            ftpDisplay.appendChild(ftpContainer);
        });
    }

    // --------------------------------------------------------
    // 5. PENCARIAN
    // --------------------------------------------------------
    searchInput.addEventListener('input', () => {
        displayUsers(searchInput.value.trim());
    });

    // --------------------------------------------------------
    // 6. KLIK DI LUAR PANEL => TUTUP PANEL KANAN
    // --------------------------------------------------------
    document.addEventListener('click', (e) => {
        if (!rightPanel.contains(e.target) && !nameListContainer.contains(e.target)) {
            rightPanel.classList.remove('active');
            motorContainer.classList.remove('hidden');
            addFtpBtn.style.display = 'none';
        }
    });

    // --------------------------------------------------------
    // 7. TOMBOL "TAMBAH FTP" (untuk user terpilih)
    // --------------------------------------------------------
    addFtpBtn.addEventListener('click', () => {
        if (!currentSelectedUser) return;
        openModalForm({
            title: 'Tambah Alamat FTP',
            description: 'Masukkan alamat FTP baru:',
            defaultValue: '',
            onConfirm: (newVal) => {
                if (newVal) {
                    currentSelectedUser.ftp.push(newVal);
                    db.collection("ftpUsers").doc(currentSelectedUser.docId)
                        .update({ ftp: currentSelectedUser.ftp })
                        .then(() => {
                            showPopup(`Alamat FTP baru ditambahkan: ${newVal}`);
                            showFtp(currentSelectedUser);
                        })
                        .catch((err) => console.error("Gagal menambahkan FTP:", err));
                }
            }
        });
    });

    // --------------------------------------------------------
    // 8. TOMBOL "TAMBAH USER"
    // --------------------------------------------------------
    addUserBtn.addEventListener('click', () => {
        openModalForm({
            title: 'Tambah User Baru',
            description: 'Masukkan nama user:',
            defaultValue: '',
            onConfirm: (newUserName) => {
                if (newUserName) {
                    db.collection("ftpUsers")
                        .doc(newUserName)
                        .set({
                            name: newUserName,
                            ftp: ["dummy_ftp_1"]
                        })
                    .then(() => {
                        allUsers.push({
                            docId: newUserName,
                            name: newUserName,
                            ftp: ["dummy_ftp_1"]
                        });
                        showPopup(`User baru "${newUserName}" telah ditambahkan (ID: ${newUserName}).`);
                        displayUsers('');
                    })
                    .catch((err) => console.error("Error adding new user:", err));
                }
            }
        });
    });
});

// =======================================================================
//                     FUNGSI - FUNGSI MODAL & POPUP
// =======================================================================

// 1. Popup singkat
function showPopup(message) {
    const popupOverlay = document.getElementById('popup-message');
    const popupText = document.getElementById('popup-text');

    popupText.textContent = message;
    popupOverlay.style.display = 'flex';

    popupOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'popup-message') {
            popupOverlay.style.display = 'none';
        }
    });
}

// 2. Modal form
function openModalForm({ title, description, defaultValue, onConfirm }) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalInput = document.getElementById('modal-input');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    modalTitle.textContent = title || 'Form';
    modalDesc.textContent = description || '';
    modalInput.value = defaultValue || '';
    modalInput.style.display = 'block';

    modalOverlay.style.display = 'flex';

    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            modalOverlay.style.display = 'none';
        }
    });

    cancelBtn.onclick = () => {
        modalOverlay.style.display = 'none';
    };

    confirmBtn.onclick = () => {
        const newValue = modalInput.value.trim();
        modalOverlay.style.display = 'none';
        if (typeof onConfirm === 'function') {
            onConfirm(newValue);
        }
    };
}

// 3. Modal konfirmasi
function openConfirmModal({ title, description, onYes }) {
    const confirmOverlay = document.getElementById('confirm-overlay');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmDesc = document.getElementById('confirm-desc');
    const cancelBtn = document.getElementById('confirm-cancel-btn');
    const okBtn = document.getElementById('confirm-ok-btn');

    confirmTitle.textContent = title || 'Konfirmasi';
    confirmDesc.textContent = description || 'Yakin?';
    confirmOverlay.style.display = 'flex';

    confirmOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'confirm-overlay') {
            confirmOverlay.style.display = 'none';
        }
    });

    cancelBtn.onclick = () => {
        confirmOverlay.style.display = 'none';
    };

    okBtn.onclick = () => {
        confirmOverlay.style.display = 'none';
        if (typeof onYes === 'function') {
            onYes();
        }
    };
}

// 4. Modal captcha
function openCaptchaModal({ onSuccess }) {
    const captchaOverlay = document.getElementById('captcha-overlay');
    const captchaTextEl = document.getElementById('captcha-text');
    const captchaInput = document.getElementById('captcha-input');
    const captchaCancelBtn = document.getElementById('captcha-cancel-btn');
    const captchaOkBtn = document.getElementById('captcha-ok-btn');

    const captcha = generateRandomCaptcha(5);
    captchaTextEl.textContent = `Ketik: ${captcha}`;
    captchaInput.value = '';

    captchaOverlay.style.display = 'flex';

    captchaOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'captcha-overlay') {
            captchaOverlay.style.display = 'none';
        }
    });

    captchaCancelBtn.onclick = () => {
        captchaOverlay.style.display = 'none';
    };

    captchaOkBtn.onclick = () => {
        const userInput = captchaInput.value.trim();
        if (userInput === captcha) {
            captchaOverlay.style.display = 'none';
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            showPopup('Captcha salah, coba lagi!');
        }
    };
}

// 5. Generate captcha
function generateRandomCaptcha(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
