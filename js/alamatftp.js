document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.getElementById('marquee');
    const marqueeText = document.getElementById('marqueeText');

    // Elemen pencarian dan container daftar user
    const searchInput = document.getElementById('searchInput');
    const nameListContainer = document.getElementById('name-list');
    
    // Elemen untuk menampilkan FTP
    const ftpDisplay = document.getElementById('ftp-display');
    const rightPanel = document.querySelector('.right-panel'); 
    const motorContainer = document.querySelector('.motor-container');

    // Variabel global untuk data user
    let allUsers = [];

    // Ambil data dari Firestore di collection "ftpUsers"
    db.collection("ftpUsers").get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
        const userData = doc.data();

        // Pastikan dokumen memiliki 'name' dan 'ftp'
        // Jika 'name' tidak ada atau bukan string, kita skip agar tidak error saat toLowerCase
        if (!userData.name || typeof userData.name !== "string") {
            console.warn("Skipping doc with missing or invalid name field:", doc.id, userData);
            return;
        }

        // Pastikan 'ftp' adalah array
        const ftpArray = Array.isArray(userData.ftp) ? userData.ftp : [];

        allUsers.push({
            name: userData.name,
            ftp: ftpArray
        });
        });
        
        // Setelah data berhasil diambil, tampilkan di panel kiri
        displayUsers('');
    })
    .catch((error) => {
        console.error("Error loading data from Firestore:", error);
    });

    // Fungsi menampilkan daftar user di panel kiri
    function displayUsers(filter) {
        nameListContainer.innerHTML = '';

        // Filter user berdasarkan pencarian
        const filtered = allUsers.filter(user => {
            // Pastikan user.name ada, atau gunakan string kosong agar tidak error
            const userName = user.name || "";
            return userName.toLowerCase().includes(filter.toLowerCase());
        });

        filtered.forEach(user => {
            const nameItem = document.createElement('div');
            nameItem.classList.add('name-item');
            nameItem.textContent = user.name;

            // Klik pada nama
            nameItem.addEventListener('click', () => {
                // Tampilkan alamat FTP milik user tersebut
                showFtp(user);
                
                // Tandai item yang sedang dipilih
                document.querySelectorAll('.name-item').forEach(item => {
                    item.classList.remove('selected');
                });
                nameItem.classList.add('selected');
            });

            nameListContainer.appendChild(nameItem);
        });
    }

    // Fungsi menampilkan alamat FTP seseorang di panel kanan
    function showFtp(user) {
        ftpDisplay.innerHTML = '';
        rightPanel.classList.remove('active'); // Reset animasi sebelum diaktifkan kembali
        motorContainer.classList.add('hidden'); // Sembunyikan GIF motor

        // Jika user tidak memiliki FTP atau isinya kosong
        if (!user.ftp || user.ftp.length === 0) {
            rightPanel.classList.remove('active');
            motorContainer.classList.remove('hidden');
            return;
        }

        // Tampilkan panel kanan dengan animasi
        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10); // Delay agar transisi terlihat
    
        user.ftp.forEach(ftpAddress => {
            // Bungkus tiap ftp address dalam container
            const ftpContainer = document.createElement('div');
            ftpContainer.classList.add('ftp-container');
    
            const ftpText = document.createElement('span');
            ftpText.classList.add('ftp-text');
            ftpText.textContent = ftpAddress;
    
            // Tombol copy
            const copyBtn = document.createElement('button');
            copyBtn.classList.add('copy-btn');
            copyBtn.innerHTML = '<img src="https://www.svgrepo.com/show/309480/copy.svg" width="15" height="15" alt="Copy"> COPY';
            
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(ftpAddress)
                    .then(() => {
                        showPopup(`FTP berhasil disalin: ${ftpAddress}`);
                    })
                    .catch(err => {
                        console.error('Gagal menyalin FTP:', err);
                    });
            });
    
            ftpContainer.appendChild(ftpText);
            ftpContainer.appendChild(copyBtn);
            ftpDisplay.appendChild(ftpContainer);
        });
    }

    // Event listener untuk pencarian
    searchInput.addEventListener('input', () => {
        const filterValue = searchInput.value.trim();
        displayUsers(filterValue);
    });

    // Klik di luar panel kanan untuk menutup panel
    document.addEventListener('click', (e) => {
        // Jika klik di luar rightPanel & di luar daftar nama, tutup panel dan tampilkan GIF
        if (!rightPanel.contains(e.target) && !nameListContainer.contains(e.target)) {
            rightPanel.classList.remove('active');
            motorContainer.classList.remove('hidden');
        }
    });
});

// Fungsi menampilkan popup
function showPopup(message) {
    const popupOverlay = document.getElementById('popup-message');
    const popupText = document.getElementById('popup-text');
    
    // Tampilkan pesan di <p id="popup-text">
    popupText.textContent = message;
    
    // Tampilkan popup
    popupOverlay.style.display = 'flex';
    
    // Klik di luar konten = tutup popup
    popupOverlay.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
    });
    
    // Mencegah popup menutup jika user klik tepat di area konten
    const popupContent = document.getElementById('popup-content');
    popupContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}
