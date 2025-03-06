console.log("Firebase DB instance:", db);

const allowedUsernames = ["sebastian", "naufal", "developer"];
const adminUsername = ["admin"];

// Konstanta untuk batas percobaan dan durasi blokir
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15; // dalam detik

// Fungsi untuk mendapatkan data percobaan dari localStorage
function getFailedAttempts() {
    const attempts = localStorage.getItem('failedAttempts');
    return attempts ? parseInt(attempts) : 0;
}

// Fungsi untuk menyetel data percobaan di localStorage
function setFailedAttempts(count) {
    localStorage.setItem('failedAttempts', count);
}

// Fungsi untuk mendapatkan waktu blokir dari localStorage
function getBlockUntil() {
    const blockUntil = localStorage.getItem('blockUntil');
    return blockUntil ? parseInt(blockUntil) : null;
}

// Fungsi untuk menyetel waktu blokir di localStorage
function setBlockUntil(timestamp) {
    localStorage.setItem('blockUntil', timestamp);
}

// Fungsi untuk reset percobaan dan blokir
function resetFailedAttempts() {
    localStorage.removeItem('failedAttempts');
    localStorage.removeItem('blockUntil');
}

// Fungsi untuk memeriksa apakah saat ini sedang dalam keadaan blokir
function isBlocked() {
    const blockUntil = getBlockUntil();
    if (blockUntil) {
        const now = Date.now();
        if (now < blockUntil) {
            return Math.ceil((blockUntil - now) / 1000); // Kembalikan sisa waktu dalam detik
        } else {
            resetFailedAttempts();
            return false;
        }
    }
    return false;
}

// Fungsi untuk memulai blokir
function startBlock() {
    const blockUntil = Date.now() + BLOCK_DURATION * 1000;
    setBlockUntil(blockUntil);
    disableLoginButtons();
    showCountdown(BLOCK_DURATION);
}

// Fungsi untuk menonaktifkan tombol login
function disableLoginButtons() {
    document.querySelector('.btn[type="submit"]').disabled = true;
    document.getElementById('googleLoginBtn').disabled = true;
}

// Fungsi untuk mengaktifkan kembali tombol login
function enableLoginButtons() {
    document.querySelector('.btn[type="submit"]').disabled = false;
    document.getElementById('googleLoginBtn').disabled = false;
}

// Fungsi untuk menampilkan countdown
function showCountdown(seconds) {
    const countdownElem = document.getElementById('countdownMessage');
    countdownElem.style.display = 'block';
    countdownElem.innerText = `Login diblokir selama ${seconds} detik. Silakan coba lagi nanti.`;

    const interval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            countdownElem.innerText = `Login diblokir selama ${seconds} detik. Silakan coba lagi nanti.`;
        } else {
            clearInterval(interval);
            countdownElem.style.display = 'none';
            enableLoginButtons();
            resetFailedAttempts();
        }
    }, 1000);
}

// Fungsi untuk menangani kegagalan login
function handleFailedLogin() {
    const username = document.getElementById('username').value.trim();
    let attempts = getFailedAttempts();
    attempts += 1;
    setFailedAttempts(attempts);

    // Log aktivitas gagal
    logFailedLogin(username);

    if (attempts >= MAX_ATTEMPTS) {
        startBlock();
    } else {
        document.getElementById('errorMessage').innerText = `Login gagal. Percobaan: ${attempts} dari ${MAX_ATTEMPTS}.`;
    }
}

// Fungsi untuk menangani kegagalan login melalui security question
function handleFailedSecurityAnswer() {
    let attempts = getFailedAttempts();
    attempts += 1;
    setFailedAttempts(attempts);

    if (attempts >= MAX_ATTEMPTS) {
        startBlock();
    } else {
        document.getElementById('securityError').innerText = `Jawaban salah. Percobaan: ${attempts} dari ${MAX_ATTEMPTS}.`;
    }
}

// Periksa apakah saat ini sedang dalam keadaan blokir saat halaman dimuat
window.addEventListener('load', () => {
    const remaining = isBlocked();
    if (remaining) {
        disableLoginButtons();
        showCountdown(remaining);
    }
});

async function recordLogin(username) {
    if (!username) {
        console.error("Username tidak valid!");
        return;
    }
    console.log(`Mencatat login untuk username: ${username}`);

    try {
        await db.collection("visitors").add({
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Statistik login untuk "${username}" berhasil dicatat di Firestore!`);
    } catch (error) {
        console.error("Error mencatat statistik login:", error);
    }
}


// Fungsi login dengan Firebase Firestore
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Periksa apakah saat ini sedang dalam keadaan blokir
    if (isBlocked()) {
        const remaining = isBlocked();
        document.getElementById('errorMessage').innerText = `Login diblokir. Silakan coba lagi dalam ${remaining} detik.`;
        return;
    }

    const username = document.getElementById('username').value.trim(); // Menghapus spasi di awal/akhir
    const password = document.getElementById('password').value;

    try {
        // Dapatkan dokumen pengguna berdasarkan username dari Firestore
        const userDoc = await db.collection("users").doc(username).get();

        if (userDoc.exists && userDoc.data().password === password) {
            // Jika username dan password cocok
            // Simpan username dalam cookie
            setCookie('username', username, 1440); // Menyimpan username selama 1 hari (1440 menit)

            // Reset percobaan gagal setelah login sukses
            resetFailedAttempts();

            // Cek jika login sebagai admin utama
            if (adminUsername.includes(username.toLowerCase())) {
                setCookie('loggedIn', 'admin', 1440); // Set cookie untuk login status admin utama
                recordLogin(username);
                window.location.href = 'main_admin.html';
            }
            // Cek jika login sebagai admin biasa
            else if (allowedUsernames.includes(username.toLowerCase())) {
                setCookie('loggedIn', 'admin', 1440); // Set cookie untuk login status admin
                recordLogin(username);
                window.location.href = 'admin.html';
            }
            // Jika bukan admin, redirect ke halaman pengguna biasa
            else {
                setCookie('loggedIn', 'user', 1440); // Set cookie untuk login status pengguna biasa
                console.log("Sebelum memanggil recordLogin:", username);
                recordLogin(username);
                console.log("Setelah memanggil recordLogin");
                window.location.href = 'loading.html';
            }
        } else {
            // Jika login gagal
            handleFailedLogin();
            document.getElementById('errorMessage').innerText = 'Salah bosku, anda karyawan mana?';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('errorMessage').innerText = 'Error logging in. Please try again later.';
    }
});

// Fungsi togglePasswordVisibility tetap sama
function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var openEye = document.querySelector('.open-eye');
    var closedEye = document.querySelector('.closed-eye');
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        openEye.style.display = 'block';
        closedEye.style.display = 'none';
    } else {
        passwordInput.type = "password";
        openEye.style.display = 'none';
        closedEye.style.display = 'block';
    }
}

// Fungsi untuk menyetel cookie dengan opsi keamanan tambahan tetap sama
function setCookie(name, value, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    const secure = location.protocol === 'https:' ? ';secure' : ''; // Hanya set 'secure' jika menggunakan HTTPS
    const path = ";path=/";
    document.cookie = `${name}=${value};${expires}${path}${secure};SameSite=Lax`;
}

// Animasi gambar motor tetap sama
// const motorAnimation = document.querySelector('.motor-animation');
// const motorBaruteks = document.querySelector('.motor-baruteks');

// motorAnimation.addEventListener('mouseover', () => {
//     motorAnimation.style.display = 'none';
//     motorBaruteks.style.display = 'block';
// });

// motorBaruteks.addEventListener('mouseout', () => {
//     motorBaruteks.style.display = 'none';
//     motorAnimation.style.display = 'block';
// });

// Event listener untuk "Lupa password?" tetap sama
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
    event.preventDefault();

    // Mengganti konten login-box dengan pesan baru
    const loginBox = document.querySelector('.login-box');
    loginBox.innerHTML = `
        <div class="info">
        <h2>Informasi</h2>
        <p>Mohon maaf, user tidak diizinkan untuk membuat akun atau mengganti password. Hal ini ditujukan untuk melindungi keamanan data internal Marketing Indogrosir.
        <br><br> Untuk membuat akun, mengganti, atau melihat password, <b> mohon hubungi Sebastian atau Naufal </b> dengan otoritas admin. Mereka akan membantumu dengan senang hati.</p>
        <button id="backToLogin" class="btn">Login Kembali</button>
        <div>
    `;

    // Menambahkan event listener untuk tombol "Login Kembali"
    document.getElementById('backToLogin').addEventListener('click', function() {
        // Memuat ulang halaman atau mengembalikan form login
        window.location.reload();
    });
});

// Tangkap elemen tombol
const googleLoginBtn = document.getElementById('googleLoginBtn');

// Fungsi untuk login dengan Google tetap sama, namun tambahkan pemanggilan handleFailedLogin pada kegagalan
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        // Pop-up Google Sign-In
        const result = await auth.signInWithPopup(provider);
        
        // Dapatkan user info
        const user = result.user;
        const email = user.email; // misal: "example@gmail.com"
        const name = user.displayName; // Nama pengguna Google

        console.log(`Google Sign-In berhasil: ${name} (${email})`);

        // (Opsional) Simpan user ke Firestore jika belum ada
        const userDocRef = db.collection('users').doc(email);
        const userDocSnap = await userDocRef.get();
        if (!userDocSnap.exists) {
            await userDocRef.set({
                username: email,
                displayName: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        // Simpan informasi login dalam cookie
        setCookie('username', email, 1440);
        setCookie('loggedIn', 'user', 1440);

        // Reset percobaan gagal setelah login sukses
        resetFailedAttempts();

        // **Mencatat login di Firestore**
        console.log(`Sebelum memanggil recordLogin: ${email}`);
        await recordLogin(email);
        console.log(`Setelah memanggil recordLogin: ${email}`);

        // Redirect ke halaman loading
        window.location.href = 'loading.html';
    
    } catch (error) {
        console.error("Google Sign-In error:", error);
        document.getElementById('errorMessage').innerText = 
        'Login dengan Google gagal: ' + (error.message || '');
        handleFailedLogin();
    }
}


// Pasang event listener
googleLoginBtn.addEventListener('click', () => {
    // Tampilkan modal pertanyaan keamanan sebelum login dengan Google
    showSecurityModal();
});

// Fungsi untuk menampilkan modal pertanyaan keamanan tetap sama, tambahkan pemanggilan handleFailedSecurityAnswer pada kegagalan
async function showSecurityModal() {
    const modal = document.getElementById('securityModal');
    const closeButton = document.querySelector('.close-button');
    const securityQuestionElem = document.getElementById('securityQuestion');
    const securityErrorElem = document.getElementById('securityError');
    const submitSecurityAnswerBtn = document.getElementById('submitSecurityAnswer');
    const securityAnswerInput = document.getElementById('securityAnswer');
    
    // Reset error message dan input
    securityErrorElem.innerText = '';
    securityAnswerInput.value = '';
    
    // Ambil pertanyaan acak dari tanya.json
    try {
        const response = await fetch('assets/list/tanya.json');
        if (!response.ok) {
            throw new Error('Gagal memuat pertanyaan keamanan.');
        }
        const questions = await response.json();
        const randomIndex = Math.floor(Math.random() * questions.length);
        const selectedQuestion = questions[randomIndex];
        
        // Tampilkan pertanyaan
        securityQuestionElem.innerText = selectedQuestion.pertanyaan;
        
        // Simpan jawaban yang benar di atribut data
        securityQuestionElem.setAttribute('data-jawaban', selectedQuestion.jawaban.toLowerCase());
        
        // Tampilkan modal
        modal.style.display = 'block';
    } catch (error) {
        console.error(error);
        document.getElementById('errorMessage').innerText = 'Error memuat pertanyaan keamanan. Silakan coba lagi.';
    }

    // Ketika pengguna mengklik tombol close
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    // Ketika pengguna mengklik di luar modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Event listener untuk submit jawaban dengan tombol Enter
    securityAnswerInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Mencegah submit form bawaan
            submitSecurityAnswerBtn.click(); // Klik tombol submit secara otomatis
        }
    });

    // Event listener untuk submit jawaban
    submitSecurityAnswerBtn.onclick = function() {
        const userAnswer = securityAnswerInput.value.trim().toLowerCase();
        const correctAnswer = securityQuestionElem.getAttribute('data-jawaban');

        if (userAnswer === correctAnswer) {
            // Jawaban benar, tutup modal dan lanjutkan login dengan Google
            modal.style.display = 'none';
            // Reset percobaan gagal setelah jawaban benar
            resetFailedAttempts();
            signInWithGoogle();
        } else {
            // Jawaban salah, tampilkan error dan tangani percobaan gagal
            securityErrorElem.innerText = 'Jawaban salah. Silakan coba lagi.';
            handleFailedSecurityAnswer();
        }
    }
}



// Tambahkan log aktivitas gagal ke Firestore
async function logFailedLogin(username) {
    try {
        const failedLogRef = db.collection("failedLogins");
        await failedLogRef.add({
            username: username || "unknown",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ip: await getPublicIP(), // Mendapatkan IP publik (opsional)
        });
        console.log("Failed login logged for:", username);
    } catch (error) {
        console.error("Error logging failed login:", error);
    }
}

// Fungsi untuk mendapatkan IP publik (opsional)
async function getPublicIP() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (response.ok) {
            const data = await response.json();
            return data.ip;
        }
    } catch (error) {
        console.error("Failed to fetch IP:", error);
    }
    return "unknown";
}

// Seleksi elemen loading overlay
const loadingOverlay = document.getElementById('loadingOverlay');
const modelViewer = document.querySelector('model-viewer');

// Fungsi untuk menampilkan overlay loading
function showLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// Fungsi untuk menyembunyikan overlay loading
function hideLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Event untuk menampilkan loading saat halaman dimuat
window.addEventListener('load', () => {
    showLoadingOverlay();
    console.log("All assets are loading...");

    // Periksa status pemuatan model-viewer
    if (modelViewer) {
        modelViewer.addEventListener('model-visibility', (event) => {
            if (event.detail.visible) {
                console.log("3D model is visible.");
                hideLoadingOverlay();
            }
        });
    } else {
        hideLoadingOverlay();
    }
});
