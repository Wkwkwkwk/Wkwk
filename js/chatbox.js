// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Buat instance Firestore
const db = firebase.firestore();
// ---------------------------------------------

// Ambil elemen-elemen DOM
const chatboxContainer = document.getElementById('chatboxContainer');
const chatboxHeader = document.getElementById('chatboxHeader');
const chatboxBody = document.getElementById('chatboxBody');
const chatboxToggleBtn = document.getElementById('chatboxToggleBtn');
const chatboxMessages = document.getElementById('chatboxMessages');
const chatboxInput = document.getElementById('chatboxInput');
const chatboxSendBtn = document.getElementById('chatboxSendBtn');
const contactSelect = document.getElementById('contactSelect');

// Ambil user yg sedang login dari cookie (misal 'username')
const usernameCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('username='));
const currentUser = usernameCookie ? usernameCookie.split('=')[1] : 'Anonim';

// Variabel untuk menyimpan user pilihan (kontak)
let selectedContact = null;

// ========== 1. Load daftar user dari Firestore -> <select> ==========
async function loadUsers() {
    try {
    const snapshot = await db.collection('users').get();

    // Kosongkan <select> lebih dulu
    contactSelect.innerHTML = '';

    // Tambahkan option default
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Pilih Kontak --';
    contactSelect.appendChild(defaultOption);

    snapshot.forEach(doc => {
        // Asumsikan field 'username' di koleksi 'users'
        const userData = doc.data();
        const userName = userData.username;

        // Supaya tidak menampilkan diri sendiri di daftar
        if (userName && userName !== currentUser) {
        const optionEl = document.createElement('option');
        optionEl.value = userName;
        optionEl.textContent = userName;
        contactSelect.appendChild(optionEl);
        }
    });
    } catch (err) {
    console.error('Gagal memuat daftar user:', err);
    }
}

// ========== 2. Toggle Buka/Tutup Chatbox ==========

// Klik di header — kita abaikan logika khusus untuk <select> agar tidak menutup saat pilih kontak
chatboxHeader.addEventListener('click', () => {
    // (Opsional) Anda bisa menambahkan logika di sini jika ingin berbeda
});

// Pisahkan tombol toggle agar tidak bentrok dengan dropdown
chatboxToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // cegah event bubbling ke header
    chatboxContainer.classList.toggle('chatbox-open');

    // Ganti simbol panah
    if (chatboxContainer.classList.contains('chatbox-open')) {
    chatboxToggleBtn.innerHTML = '&#9650;'; // Panah atas (tutup)
    } else {
    chatboxToggleBtn.innerHTML = '&#9660;'; // Panah bawah (buka)
    }
});

// ========== 3. Mengubah "selectedContact" saat user memilih di dropdown ==========
contactSelect.addEventListener('change', () => {
    selectedContact = contactSelect.value || null;

    // Jika ada kontak yang dipilih, baru kita pasang listener chat
    if (selectedContact) {
    listenToChat(selectedContact);
    } else {
    // Jika belum ada yg dipilih, kosongkan tampilan chat
    chatboxMessages.innerHTML = '';
    }
});

// Reference untuk real-time listener (agar bisa di-unsubscribe)
let unsubscribeChat = null;

// ========== 4. Fungsi real-time listener ke Firestore sesuai pasangan user ==========
function listenToChat(contact) {
    // Sebelum pasang listener baru, matikan yang lama
    if (unsubscribeChat) {
    unsubscribeChat();
    unsubscribeChat = null;
    }

    // Gunakan field "participants" = array [fromUser, toUser] (sorted) agar mempermudah filter 1 lawan 1
    const sortedParticipants = [currentUser, contact].sort();

    // Query: chats di mana participants = [A, B], lalu urutkan dari timestamp
    const query = db.collection('chats')
    .where('participants', '==', sortedParticipants)
    .orderBy('timestamp', 'asc');

    unsubscribeChat = query.onSnapshot(
    snapshot => {
        // Bersihkan tampilan
        chatboxMessages.innerHTML = '';

        snapshot.forEach(doc => {
        const data = doc.data();
        const from = data.from || 'Anonim';
        const msg = data.message || '';
        // Timestamp optional
        const time = data.timestamp
            ? data.timestamp.toDate().toLocaleTimeString()
            : '...';

        // Buat elemen pesan
        const msgEl = document.createElement('div');
        msgEl.style.marginBottom = '6px';

        // Pesan user sendiri di kanan
        if (from === currentUser) {
            msgEl.style.textAlign = 'right';
            msgEl.innerHTML = `
            <div style="display:inline-block; background:#ffc; padding:4px 8px; border-radius:4px;">
                <strong>${from}:</strong> ${msg}
                <br><small style="font-size:10px; color:gray;">${time}</small>
            </div>
            `;
        } else {
            // Pesan lawan bicara di kiri
            msgEl.style.textAlign = 'left';
            msgEl.innerHTML = `
            <div style="display:inline-block; background:#eee; padding:4px 8px; border-radius:4px;">
                <strong>${from}:</strong> ${msg}
                <br><small style="font-size:10px; color:gray;">${time}</small>
            </div>
            `;
        }

        chatboxMessages.appendChild(msgEl);
        });

        // Scroll ke bawah
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    },
    err => {
        console.error('Error onSnapshot chats:', err);
    }
    );
}

// ========== 5. Fungsi kirim pesan ke Firestore ==========
async function sendMessage() {
    if (!selectedContact) {
    alert('Pilih kontak terlebih dahulu!');
    return;
    }
    const text = chatboxInput.value.trim();
    if (!text) return;

    const sortedParticipants = [currentUser, selectedContact].sort();
    try {
    await db.collection('chats').add({
        participants: sortedParticipants,   // array [A, B]
        from: currentUser,                  // pengirim
        to: selectedContact,                // penerima
        message: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    chatboxInput.value = '';
    } catch (err) {
    console.error('Gagal mengirim pesan:', err);
    }
}

// ========== 6. Event Listener Tombol & Tekan Enter ==========
chatboxSendBtn.addEventListener('click', sendMessage);

chatboxInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
    sendMessage();
    }
});

// Panggil loadUsers() saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadUsers);
