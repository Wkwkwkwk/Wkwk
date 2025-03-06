// Fungsi untuk mengganti password
document.getElementById('gantiPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    // Validasi password baru (minimal 6 karakter, terdiri dari huruf dan angka)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        document.getElementById('errorMessage').innerText = 'Password baru harus terdiri dari huruf dan angka, dan minimal 6 karakter.';
        return;
    }

    try {
        // Cek apakah username ada
        const userDocRef = db.collection("users").doc(username);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            document.getElementById('errorMessage').innerText = 'Username tidak ditemukan.';
            return;
        }

        // Cek apakah password lama cocok
        const userData = userDoc.data();
        if (userData.password !== currentPassword) {
            document.getElementById('errorMessage').innerText = 'Password lama salah.';
            return;
        }

        // Update password baru
        await userDocRef.update({ password: newPassword });
        document.getElementById('errorMessage').innerText = 'Password berhasil diubah. Silakan login dengan password baru Anda.';

        // Mengganti form dengan pesan sukses
        const gantiPasswordContainer = document.querySelector('.gantiPassword-box');
        gantiPasswordContainer.innerHTML = `
            <h2>Yey! Password Berhasil Diubah!</h2>
            <button onclick="gantiPasswordLagi()" class="btn spaced-btn">Ganti Password Lagi</button>
            <button onclick="login()" class="btn spaced-btn">Login</button>
        `;
    } catch (error) {
        console.error("Error updating password:", error);
        document.getElementById('errorMessage').innerText = 'Terjadi kesalahan. Mohon hubungi Sebastian.';
    }
});

// Fungsi untuk tombol "Ganti Password Lagi"
function gantiPasswordLagi() {
    window.location.reload();
}

// Fungsi untuk tombol "Login"
function login() {
    window.location.href = 'login.html';
}

// Fungsi untuk toggle visibility password
function togglePasswordVisibility1() {
    var passwordInput = document.getElementById('currentPassword');
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
    var passwordInput = document.getElementById('newPassword');
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
