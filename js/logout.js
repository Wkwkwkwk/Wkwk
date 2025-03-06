import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Konfigurasi Firebase (Pastikan ini sesuai dengan konfigurasi Firebase Anda)
const firebaseConfig = {
    apiKey: "AIzaSyDptFYVVq3HF8o2vtXGQ2jdNaX-G8c1FfE",
    authDomain: "indogrosir-174b9.firebaseapp.com",
    projectId: "indogrosir-174b9",
    storageBucket: "indogrosir-174b9.appspot.com",
    messagingSenderId: "1077982905368",
    appId: "1:1077982905368:web:a1b36e958d1c5289f6af6d",
    measurementId: "G-7FLVT90LNX"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Fungsi untuk menghapus cookie dengan aman
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; Secure; SameSite=Lax`;
}

// Event listener untuk tombol logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async function() {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        // Tampilkan animasi loading
        logoutBtn.innerHTML = "Logging out... <span class='spinner'></span>";
        logoutBtn.disabled = true;

        try {
            // Logout dari Firebase Authentication
            await signOut(auth);

            // Hapus cookie 'username' dan 'loggedIn'
            deleteCookie('username');
            deleteCookie('loggedIn');

            // Hapus data dari localStorage atau sessionStorage
            localStorage.removeItem('userData');
            sessionStorage.clear();

            // Tunggu sebentar agar pengguna melihat animasi logout
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Logout gagal. Silakan coba lagi.");
        } finally {
            // Reset tombol logout jika terjadi error
            setTimeout(() => {
                logoutBtn.innerHTML = "Logout";
                logoutBtn.disabled = false;
            }, 1500);
        }
    }
});
