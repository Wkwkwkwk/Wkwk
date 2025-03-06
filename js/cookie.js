// Daftar username admin
const adminUsers = ["sebastian", "naufal", "developer"];
const adminSpecial = ["admin"];

// Fungsi untuk mengambil nilai cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// function addVisitorToFirestore(username) {
//     db.collection("visitors").add({
//         username: username,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp()
//     }).then(() => {
//         console.log("Pengunjung ditambahkan ke Firestore.");
//     }).catch((error) => {
//         console.error("Gagal menambahkan pengunjung:", error);
//     });
// }

// Validasi cookie login
const loggedIn = getCookie('loggedIn');
const username = getCookie('username');

// Fungsi untuk mengarahkan pengguna berdasarkan otoritas
function redirectUserBasedOnRole() {
    if (adminSpecial.includes(username.toLowerCase())) {
        window.location.href = 'main_admin.html'; // Redirect untuk admin spesial
    } else if (adminUsers.includes(username.toLowerCase())) {
        window.location.href = 'admin.html'; // Redirect untuk admin biasa
    } else {
        window.location.href = 'main.html'; // Redirect untuk pengguna biasa
    }
}

// Periksa halaman saat ini
const currentPages = window.location.pathname.split('/').pop();

// Jika pengguna sudah login dan mengakses login.html atau index.html
if (loggedIn && (currentPages === 'login.html' || currentPages === 'index.html')) {
    redirectUserBasedOnRole();
}

// Jika pengguna belum login dan mengakses halaman lain selain login.html atau index.html
if (!loggedIn || !username) {
    if (currentPages !== 'index.html' && currentPages !== 'login.html') {
        window.location.href = 'login.html'; // Atau index.html sesuai kebutuhan Anda
    }
} else {
    // Perbarui teks marquee dengan menyertakan username
    const marqueeText = document.getElementById('marqueeText');
    if (marqueeText) {
        marqueeText.innerHTML = `SELAMAT DATANG <strong>${username.toUpperCase()}</strong> DI WEBSITE MARKETING INDOGROSIR - SUB DIVISI DESAIN GRAFIS <img src="assets/img/igr.png" alt="Logo Indogrosir" class="marquee-logo">`;
    }
}
