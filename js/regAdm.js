document.addEventListener('DOMContentLoaded', () => {
    // Referensi elemen DOM
    const searchInput = document.getElementById('Hehe');
    const nameListContainer = document.getElementById('name-list');
    const userInfo = document.getElementById('user-info');
    const addUserBtn = document.getElementById('addUserBtn');
    const toggleDeleteModeBtn = document.getElementById('toggleDeleteModeBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');

    // Buat tombol tambahan untuk ubah email dan tutup detail
    const changeEmailBtn = document.createElement('button');
    changeEmailBtn.id = 'changeEmailBtn';
    changeEmailBtn.classList.add('btn');
    changeEmailBtn.style.display = 'none';
    changePasswordBtn.parentNode.insertBefore(changeEmailBtn, changePasswordBtn.nextSibling);

    const closeDetailBtn = document.createElement('button');
    closeDetailBtn.id = 'closeDetailBtn';
    closeDetailBtn.classList.add('btn');
    closeDetailBtn.style.display = 'none';
    changePasswordBtn.parentNode.insertBefore(closeDetailBtn, changeEmailBtn.nextSibling);

    // Event listener untuk tombol ubah email dan tutup detail
    changeEmailBtn.addEventListener('click', () => {
        openChangeEmailModal();
    });
    closeDetailBtn.addEventListener('click', () => {
        closeUserDetail();
    });

    let allUsers = [];
    let currentSelectedUser = null;
    let deleteMode = false;

    // Ambil data pengguna dari koleksi "users"
    db.collection("users").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const userData = doc.data();
                console.log("Data User:", userData);

                if (!userData.username || typeof userData.username !== "string") {
                    console.warn("Dokumen tidak memiliki field username:", doc.id, userData);
                    return;
                }

                // Tambahkan field email (jika tidak ada, default ke string kosong)
                allUsers.push({
                    docId: doc.id,
                    username: userData.username,
                    password: userData.password || "",
                    email: userData.email || ""
                });
            });
            displayUsers('');
        })
        .catch((error) => {
            console.error("Error mengambil data pengguna:", error);
        });

    // Fungsi untuk menampilkan daftar pengguna (dengan filter)
    function displayUsers(filter) {
        nameListContainer.innerHTML = '';
        const filtered = allUsers.filter(user =>
            (user.username || "").toLowerCase().includes(filter.toLowerCase())
        );
        filtered.forEach((user) => {
            const nameItem = document.createElement('div');
            nameItem.classList.add('name-item');

            const userSpan = document.createElement('span');
            userSpan.textContent = user.username;
            nameItem.appendChild(userSpan);

            // Tombol DELETE (tampil jika deleteMode aktif)
            if (deleteMode) {
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-user-btn');
                deleteBtn.textContent = 'DELETE';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openConfirmModal({
                        title: 'Konfirmasi Hapus Pengguna',
                        description: `Yakin ingin menghapus pengguna "${user.username}"?`,
                        onYes: () => {
                            openCaptchaModal({
                                onSuccess: () => {
                                    db.collection("users").doc(user.docId)
                                        .delete()
                                        .then(() => {
                                            showPopup(`Pengguna "${user.username}" berhasil dihapus.`);
                                            allUsers = allUsers.filter(u => u.docId !== user.docId);
                                            displayUsers(searchInput.value.trim());
                                            if (currentSelectedUser && currentSelectedUser.docId === user.docId) {
                                                userInfo.innerHTML = '<p>Pilih pengguna dari panel kiri untuk melihat detail.</p>';
                                                userInfo.innerHTML = '<p><br>Kamu bisa menambahkan user, memodifikasi password dan email mereka, menghapus user, serta melihat informasi user yang terdaftar dalam sistem website Marketing Indogrosir.</p>';
                                                currentSelectedUser = null;
                                                changePasswordBtn.style.display = 'none';
                                                changeEmailBtn.style.display = 'none';
                                                closeDetailBtn.style.display = 'none';
                                            }
                                        })
                                        .catch(err => console.error("Error menghapus pengguna:", err));
                                }
                            });
                        }
                    });
                });
                nameItem.appendChild(deleteBtn);
            }

            // Klik pada item pengguna untuk menampilkan detail
            nameItem.addEventListener('click', () => {
                currentSelectedUser = user;
                document.querySelectorAll('.name-item').forEach(item => item.classList.remove('selected'));
                nameItem.classList.add('selected');
                showUserDetails(user);
            });
            nameListContainer.appendChild(nameItem);
        });
    }

    // Event untuk filter pencarian
    searchInput.addEventListener('input', () => {
        displayUsers(searchInput.value.trim());
    });

    // Toggle delete mode
    toggleDeleteModeBtn.addEventListener('click', () => {
        deleteMode = !deleteMode;
        toggleDeleteModeBtn.textContent = deleteMode ? 'Batalkan' : 'Hapus Pengguna';
        displayUsers(searchInput.value.trim());
    });

    // Jawaban benar -> ubah tipe input password menjadi text
    const passwordField = document.getElementById('passwordField');
    if (passwordField) {
        passwordField.type = 'text';
    }

    // Sembunyikan tombol "Lihat Password"
    const revealPasswordBtn = document.getElementById('revealPasswordBtn');
    if (revealPasswordBtn) {
        revealPasswordBtn.style.display = 'none';
    }

    // Modal Security Question
    function openSecurityQuestionModal() {
        const securityModal = document.getElementById('securityModal');
        const closeSecurityModal = document.getElementById('closeSecurityModal');
        const securityQuestion = document.getElementById('securityQuestion');
        const securityAnswer = document.getElementById('securityAnswer');
        const submitBtn = document.getElementById('submitSecurityAnswer');
        const securityError = document.getElementById('securityError');
    
        securityAnswer.value = '';
        securityError.textContent = '';
    
        securityModal.style.display = 'block';
    
        closeSecurityModal.onclick = function() {
            securityModal.style.display = 'none';
        };
    
        window.onclick = function(event) {
            if (event.target === securityModal) {
                securityModal.style.display = 'none';
            }
        };
    
        fetch('assets/list/tanya.json')
            .then(response => response.json())
            .then(questions => {
                const randomIndex = Math.floor(Math.random() * questions.length);
                const selectedQuestion = questions[randomIndex];
                securityQuestion.textContent = selectedQuestion.pertanyaan;
    
                submitBtn.onclick = function() {
                    const userAnswer = securityAnswer.value.trim().toLowerCase();
                    const correctAnswer = selectedQuestion.jawaban.toLowerCase();
    
                    if (userAnswer === correctAnswer) {
                        // Jawaban benar -> ubah tipe input password menjadi text
                        const passwordField = document.getElementById('passwordField');
                        if (passwordField) {
                            passwordField.type = 'text';
                        }
    
                        // Sembunyikan tombol "Lihat Password"
                        const revealPasswordBtn = document.getElementById('revealPasswordBtn');
                        if (revealPasswordBtn) {
                            revealPasswordBtn.style.display = 'none';
                        }
    
                        securityModal.style.display = 'none';
                    } else {
                        securityError.textContent = 'Jawaban salah, silakan coba lagi!';
                    }
                };
            })
            .catch(error => {
                console.error('Error memuat pertanyaan keamanan:', error);
                securityQuestion.textContent = 'Gagal memuat pertanyaan keamanan.';
            });
    }

    // Menampilkan detail pengguna di panel kanan (termasuk Email Pengguna)
    function showUserDetails(user) {
        userInfo.innerHTML = `
            <div class="registrasi-box">
                <h3>Username Pengguna</h3>
                <div class="inputBox">
                    <input type="text" value="${user.username}" readonly>
                </div>

                <h3>Password Pengguna</h3>
                <div class="inputBox">
                    <!-- Menggunakan type="password" agar disembunyikan -->
                    <input id="passwordField" type="password" value="${user.password}" readonly>
                    <!-- Tombol "Lihat Password" untuk menampilkan modal security -->
                    <button id="revealPasswordBtn" class="btn" style="margin-top:10px;">Lihat Password</button>
                </div>

                <h3>Email Pengguna</h3>
                <div class="inputBox">
                    <input type="text" value="${user.email}" readonly>
                    
                </div>
            </div>
        `;

        // Update teks tombol untuk password
        if (user.password === "") {
            changePasswordBtn.textContent = "Tambah Password";
        } else {
            changePasswordBtn.textContent = "Ganti Password";
        }
        changePasswordBtn.style.display = 'block';

        // Update teks tombol untuk email
        if (user.email === "") {
            changeEmailBtn.textContent = "Tambah Email";
        } else {
            changeEmailBtn.textContent = "Ganti Email";
        }
        changeEmailBtn.style.display = 'block';

        // Tampilkan tombol "Tutup Detail"
        closeDetailBtn.textContent = "Tutup Detail";
        closeDetailBtn.style.display = 'block';

        // Event listener tombol "Lihat Password"
        const revealPasswordBtn = document.getElementById('revealPasswordBtn');
        if (revealPasswordBtn) {
            revealPasswordBtn.addEventListener('click', () => {
                // Fungsi ini memunculkan modal security question
                openSecurityQuestionModal();
            });
        }
    }

    // Update/tambah password pengguna
    changePasswordBtn.addEventListener('click', () => {
        if (!currentSelectedUser) {
            showPopup("Pilih pengguna terlebih dahulu.");
            return;
        }
        // Jika password kosong: flow tambah password
        if (currentSelectedUser.password === "") {
            changePasswordModal.innerHTML = `
                <div class="modal-content">
                    <h2>Tambah Password</h2>
                    <div class="inputBox">
                        <input type="password" id="newPasswordAdd" placeholder="Masukkan Password" autocomplete="off">
                    </div>
                    <div class="inputBox">
                        <input type="password" id="confirmPasswordAdd" placeholder="Konfirmasi Password Baru" autocomplete="off">
                    </div>
                    <div class="modal-buttons">
                        <button id="cancelAddPasswordBtn">Batal</button>
                        <button id="confirmAddPasswordBtn">Konfirmasi</button>
                    </div>
                </div>
            `;
            changePasswordModal.style.display = 'flex';
            document.getElementById('cancelAddPasswordBtn').addEventListener('click', () => {
                changePasswordModal.style.display = 'none';
            });
            document.getElementById('confirmAddPasswordBtn').addEventListener('click', () => {
                const newPasswordAdd = document.getElementById('newPasswordAdd').value.trim();
                const confirmPasswordAdd = document.getElementById('confirmPasswordAdd').value.trim();
                if (newPasswordAdd === "" || confirmPasswordAdd === "") {
                    showPopup("Harap isi semua kolom.");
                    return;
                }
                if (newPasswordAdd !== confirmPasswordAdd) {
                    showPopup("Password dan konfirmasi tidak cocok.");
                    return;
                }
                if (newPasswordAdd.length < 6) {
                    showPopup("Password harus minimal 6 karakter.");
                    return;
                }
                db.collection("users").doc(currentSelectedUser.docId)
                    .set({ password: newPasswordAdd }, { merge: true })
                    .then(() => {
                        showPopup(`Password pengguna "${currentSelectedUser.username}" berhasil ditambahkan.`);
                        currentSelectedUser.password = newPasswordAdd;
                        showUserDetails(currentSelectedUser);
                        changePasswordModal.style.display = 'none';
                    })
                    .catch((err) => {
                        console.error("Error menambahkan password:", err);
                        showPopup("Gagal menambahkan password.");
                    });
            });
        } else {
            // Flow ganti password
            changePasswordModal.innerHTML = `
                <div class="modal-content">
                    <h2>Ganti Password</h2>
                    <div class="inputBox">
                        <input type="password" id="oldPasswordInput" placeholder="Masukkan Password Lama" autocomplete="off">
                    </div>
                    <div class="inputBox">
                        <input type="password" id="newPasswordInputModal" placeholder="Masukkan Password Baru" autocomplete="off">
                    </div>
                    <div class="modal-buttons">
                        <button id="cancelChangePasswordBtn">Batal</button>
                        <button id="confirmChangePasswordBtn">Konfirmasi</button>
                    </div>
                </div>
            `;
            changePasswordModal.style.display = 'flex';
            document.getElementById('cancelChangePasswordBtn').addEventListener('click', () => {
                changePasswordModal.style.display = 'none';
            });
            document.getElementById('confirmChangePasswordBtn').addEventListener('click', () => {
                const oldPassword = document.getElementById('oldPasswordInput').value.trim();
                const newPassword = document.getElementById('newPasswordInputModal').value.trim();
                if (oldPassword === "" || newPassword === "") {
                    showPopup("Harap isi semua kolom.");
                    return;
                }
                if (oldPassword !== currentSelectedUser.password) {
                    showPopup("Password lama salah.");
                    return;
                }
                if (newPassword.length < 6) {
                    showPopup("Password baru harus minimal 6 karakter.");
                    return;
                }
                db.collection("users").doc(currentSelectedUser.docId)
                    .set({ password: newPassword }, { merge: true })
                    .then(() => {
                        showPopup(`Password pengguna "${currentSelectedUser.username}" berhasil diperbarui.`);
                        currentSelectedUser.password = newPassword;
                        showUserDetails(currentSelectedUser);
                        changePasswordModal.style.display = 'none';
                    })
                    .catch((err) => {
                        console.error("Error memperbarui password:", err);
                        showPopup("Gagal memperbarui password.");
                    });
            });
        }
    });

    // Fungsi untuk membuka modal ubah/tambah email
    function openChangeEmailModal() {
        changePasswordModal.innerHTML = `
            <div class="modal-content">
                <h2>${currentSelectedUser.email === "" ? "Tambah Email" : "Ganti Email"}</h2>
                <div class="inputBox">
                    <input type="email" id="newEmailInput" placeholder="Masukkan Email Baru" autocomplete="off">
                </div>
                <div class="modal-buttons">
                    <button id="cancelChangeEmailBtn">Batal</button>
                    <button id="confirmChangeEmailBtn">Konfirmasi</button>
                </div>
            </div>
        `;
        changePasswordModal.style.display = 'flex';
        document.getElementById('cancelChangeEmailBtn').addEventListener('click', () => {
            changePasswordModal.style.display = 'none';
        });
        document.getElementById('confirmChangeEmailBtn').addEventListener('click', () => {
            const newEmail = document.getElementById('newEmailInput').value.trim();
            if (newEmail === "") {
                showPopup("Harap masukkan email.");
                return;
            }
            db.collection("users").doc(currentSelectedUser.docId)
                .set({ email: newEmail }, { merge: true })
                .then(() => {
                    showPopup(`Email pengguna "${currentSelectedUser.username}" berhasil diperbarui.`);
                    currentSelectedUser.email = newEmail;
                    showUserDetails(currentSelectedUser);
                    changePasswordModal.style.display = 'none';
                })
                .catch((err) => {
                    console.error("Error memperbarui email:", err);
                    showPopup("Gagal memperbarui email.");
                });
        });
    }

    // Fungsi untuk menutup detail pengguna
    function closeUserDetail() {
        userInfo.innerHTML = '<p>Pilih pengguna dari panel kiri untuk melihat detail. <br><br>Kamu bisa menambahkan user, memodifikasi password dan email mereka, menghapus user, serta melihat informasi user yang terdaftar dalam sistem website Marketing Indogrosir.</p>';
        changePasswordBtn.style.display = 'none';
        changeEmailBtn.style.display = 'none';
        closeDetailBtn.style.display = 'none';
        currentSelectedUser = null;
        document.querySelectorAll('.name-item').forEach(item => item.classList.remove('selected'));
    }

    // Tambah pengguna baru (pop up form registrasi)
    addUserBtn.addEventListener('click', () => {
        openAddUserModal();
    });

    function openAddUserModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        modalOverlay.innerHTML = `
            <div class="reg-container">
                <div class="reg-box">
                    <h2>Tambah Pengguna</h2>
                        <form id="addUserForm">
                            <div class="inBox">
                                <input type="text" id="newUsername" required placeholder="Username" autocomplete="off">
                            </div>
                            <div class="inBox">
                                <input type="password" id="newPassword" required placeholder="Password" autocomplete="off">
                            </div>
                            <div class="inBox">
                                <input type="password" id="confirmPassword" required placeholder="Konfirmasi Password" autocomplete="off">
                            </div>
                            <div class="inBox">
                                <input type="email" id="newEmail" required placeholder="Email" autocomplete="off">
                            </div>
                            <button type="submit" class="btn">Tambah Pengguna</button>
                        </form>
                </div>
            </div>
        `;
        modalOverlay.style.display = 'flex';

        // Tutup modal jika klik di luar konten (container registrasi)
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });

        // Tangani submit form penambahan pengguna
        document.getElementById('addUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const newEmail = document.getElementById('newEmail').value.trim();

            if (newPassword !== confirmPassword) {
                showPopup('Password dan konfirmasi password tidak cocok.');
                return;
            }
            const exists = allUsers.some(u => u.username.toLowerCase() === newUsername.toLowerCase());
            if (exists) {
                showPopup('Pengguna sudah ada.');
                return;
            }
            db.collection("users").doc(newUsername)
                .set({
                    username: newUsername,
                    password: newPassword,
                    email: newEmail
                })
                .then(() => {
                    const newUser = { docId: newUsername, username: newUsername, password: newPassword, email: newEmail };
                    allUsers.push(newUser);
                    showPopup(`Pengguna "${newUsername}" berhasil ditambahkan.`);
                    displayUsers(searchInput.value.trim());
                    modalOverlay.style.display = 'none';
                })
                .catch((err) => {
                    console.error("Error menambahkan pengguna:", err);
                    showPopup('Gagal menambahkan pengguna.');
                });
        });
    }
});

/* --- Utility Functions: Modal & Popup --- */

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
    cancelBtn.onclick = () => { modalOverlay.style.display = 'none'; };
    confirmBtn.onclick = () => {
        const newValue = modalInput.value.trim();
        modalOverlay.style.display = 'none';
        if (typeof onConfirm === 'function') {
            onConfirm(newValue);
        }
    };
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            modalOverlay.style.display = 'none';
        }
    });
}

function openConfirmModal({ title, description, onYes }) {
    const confirmOverlay = document.getElementById('confirm-overlay');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmDesc = document.getElementById('confirm-desc');
    const cancelBtn = document.getElementById('confirm-cancel-btn');
    const okBtn = document.getElementById('confirm-ok-btn');
    confirmTitle.textContent = title || 'Konfirmasi';
    confirmDesc.textContent = description || 'Yakin?';
    confirmOverlay.style.display = 'flex';
    cancelBtn.onclick = () => { confirmOverlay.style.display = 'none'; };
    okBtn.onclick = () => {
        confirmOverlay.style.display = 'none';
        if (typeof onYes === 'function') {
            onYes();
        }
    };
    confirmOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'confirm-overlay') {
            confirmOverlay.style.display = 'none';
        }
    });
}

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
    captchaCancelBtn.onclick = () => { captchaOverlay.style.display = 'none'; };
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
    captchaOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'captcha-overlay') {
            captchaOverlay.style.display = 'none';
        }
    });
}

function generateRandomCaptcha(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
