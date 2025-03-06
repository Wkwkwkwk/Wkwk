// Fungsi registrasi pengguna baru ke Firestore
document.getElementById('registrasiForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    // Cek apakah password dan konfirmasi password sama
    if (password !== password2) {
        document.getElementById('errorMessage').innerText = 'Password berbeda. Mohon diulangi.';
        return; // Menghentikan proses registrasi jika password tidak cocok
    }

    // Cek apakah password valid (minimal 6 karakter, terdiri dari huruf dan angka)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('errorMessage').innerText = 'Password harus terdiri dari huruf dan angka, dan minimal 6 karakter.';
        return; // Menghentikan proses registrasi jika password tidak valid
    }

    try {
        // Cek apakah username sudah ada
        const userDoc = await db.collection("users").doc(username).get();
        if (userDoc.exists) {
            document.getElementById('errorMessage').innerText = 'Username sudah terdaftar. Silakan pilih username lain.';
        } else {
            // Tambahkan pengguna baru ke Firestore
            await db.collection("users").doc(username).set({ 
                username: username, 
                password: password 
            });
            document.getElementById('errorMessage').innerText = 'Registrasi Berhasil. Silakan Login.';

            // Mengganti form registrasi dengan dua tombol
            const registrasiContainer = document.querySelector('.registrasi-box');
            registrasiContainer.innerHTML = `
                <h2>Yey! Pendaftaran Berhasil!</h2>
                <button onclick="registrasiLagi()" class="btn spaced-btn">Registrasi Lagi</button>
                <button onclick="login()" class="btn spaced-btn">Login</button>
            `;
        }
    } catch (error) {
        console.error("Error adding user:", error);
        document.getElementById('errorMessage').innerText = 'Wah registrasinya bermasalah. Mohon hubungi Sebastian.';
    }
});

// Fungsi untuk tombol "Registrasi Lagi"
function registrasiLagi() {
    window.location.reload(); // Muat ulang halaman untuk registrasi baru
}

// Fungsi untuk tombol "Login"
function login() {
    window.location.href = 'login.html'; // Pindah ke halaman login
}

function togglePasswordVisibility1() {
    var passwordInput = document.getElementById('password');
    var openEye = document.querySelector('.open-eye1');
    var closedEye = document.querySelector('.closed-eye1');
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

function togglePasswordVisibility2() {
    var passwordInput = document.getElementById('password2');
    var openEye = document.querySelector('.open-eye2');
    var closedEye = document.querySelector('.closed-eye2');
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


// Animasi gambar motor
const motorAnimation = document.querySelector('.motor-animation');
const motorBaruteks = document.querySelector('.motor-baruteks');

motorAnimation.addEventListener('mouseover', () => {
    motorAnimation.style.display = 'none';
    motorBaruteks.style.display = 'block';
});

motorBaruteks.addEventListener('mouseout', () => {
    motorBaruteks.style.display = 'none';
    motorAnimation.style.display = 'block';
});
