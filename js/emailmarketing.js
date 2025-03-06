document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.getElementById('marquee');
    const marqueeText = document.getElementById('marqueeText');

    // Tab items
    const tabItems = document.querySelectorAll('.tab-item');
    const nameListContainer = document.getElementById('name-list');
    const searchInput = document.getElementById('searchInput');
    
    // Bagian output email
    const emailDisplay = document.getElementById('email-display');
    const copyBtn = document.getElementById('copy-btn');
    const selectAllBtn = document.getElementById('selectAllBtn');

    const rightPanel = document.querySelector('.right-panel'); 
    const motorContainer = document.querySelector('.motor-container');

    // Variabel global data
    let allData = {};
    // Menampung nama-nama (lintas divisi) yang dipilih
    let selectedNames = [];
    // Divisi yang sedang aktif
    let currentDivision = 'division1';

    // Status "Select All" per divisi (untuk toggle)
    let isAllSelected = {
        division1: false,
        division2: false,
        division3: false,
        division4: false
    };

    // Fetch data dari JSON
    fetch('../assets/list/emailmkt.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            displayNames(currentDivision, '');
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Fungsi untuk menampilkan nama-nama karyawan di panel kiri
    function displayNames(divisionKey, filter) {
        // Bersihkan name-list
        nameListContainer.innerHTML = '';

        // Jika data divisionKey tidak ada, berhenti
        if (!allData[divisionKey]) return;

        // Filter berdasarkan teks pencarian
        const filteredData = allData[divisionKey].filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        );

        // Render item
        filteredData.forEach(item => {
            const nameItem = document.createElement('div');
            nameItem.classList.add('name-item');
            nameItem.textContent = item.name;
            nameItem.setAttribute('data-email', item.email);

            // Tandai jika sudah terpilih di selectedNames
            if (selectedNames.find(sel => sel.name === item.name && sel.email === item.email)) {
                nameItem.classList.add('selected');
            }

            // Klik item => toggle pilih/batal
            nameItem.addEventListener('click', () => {
                setTimeout(() => {
                    rightPanel.classList.add('active');
                    motorContainer.classList.add('hidden');
                }, 10); // Delay untuk memastikan transisi terlihat
                if (nameItem.classList.contains('selected')) {
                    nameItem.classList.remove('selected');
                    removeSelectedName(item);
                } else {
                    nameItem.classList.add('selected');
                    addSelectedName(item);
                }
                displayEmails();
            });

            nameListContainer.appendChild(nameItem);
        });
    }

    function addSelectedName(item) {
        // Hindari duplikasi
        const exists = selectedNames.find(sel => sel.name === item.name && sel.email === item.email);
        if (!exists) {
            selectedNames.push(item);
        }
    }

    function removeSelectedName(item) {
        selectedNames = selectedNames.filter(sel => {
            return sel.name !== item.name || sel.email !== item.email;
        });
    }

    function displayEmails() {
        const emailList = selectedNames.map(obj => obj.email);
        if (emailList.length > 0) {
            emailDisplay.textContent = emailList.join('; ') + ';';
        } else {
            emailDisplay.textContent = ''; // Kosongkan jika tidak ada email
        }
    }

    // Event listener: pencarian
    searchInput.addEventListener('input', () => {
        const filterValue = searchInput.value.trim();
        displayNames(currentDivision, filterValue);
    });

    // Event listener: tab divisi
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // Nonaktifkan tab lama
            document.querySelector('.tab-item.active').classList.remove('active');
            // Aktifkan tab baru
            tab.classList.add('active');

            // Perbarui currentDivision
            currentDivision = tab.getAttribute('data-division');

            // Set teks pada tombol Select All
            updateSelectAllButtonText(currentDivision);

            // Reset pencarian
            searchInput.value = '';
            displayNames(currentDivision, '');
        });
    });

    // Tombol "Select All" / "Unselect All"
    selectAllBtn.addEventListener('click', () => {
        rightPanel.classList.remove('active'); // Reset animasi sebelum diaktifkan kembali
        motorContainer.classList.add('hidden'); // Sembunyikan GIF motor

        // Tampilkan panel kanan dengan animasi
        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10); // Delay untuk memastikan transisi terlihat
    

        toggleSelectAll(currentDivision);
    });

    // Fungsi toggling "Select All" untuk satu divisi tertentu
    function toggleSelectAll(divisionKey) {
        // Jika data tidak ada, berhenti
        if (!allData[divisionKey]) return;

        if (!isAllSelected[divisionKey]) {
            // Saat ini belum select all -> kita select semua item di divisi ini
            allData[divisionKey].forEach(item => {
                addSelectedName(item);
            });
            isAllSelected[divisionKey] = true;
        } else {
            // Sudah di-select-all -> kita unselect semua item di divisi ini
            allData[divisionKey].forEach(item => {
                removeSelectedName(item);
            });
            isAllSelected[divisionKey] = false;
        }

        // Update tampilan di panel kiri (agar item ter-check atau tidak)
        displayNames(divisionKey, searchInput.value);
        // Update tampilan email di panel kanan
        displayEmails();
        // Perbarui teks tombol
        updateSelectAllButtonText(divisionKey);
    }

    // Fungsi untuk update teks di tombol (Select All / Unselect All)
    function updateSelectAllButtonText(divisionKey) {
        if (isAllSelected[divisionKey]) {
            selectAllBtn.textContent = 'Unselect All';
        } else {
            selectAllBtn.textContent = 'Select All';
        }
    }

    // Fungsi copy ke clipboard
    copyBtn.addEventListener('click', copyToClipboard);
    function copyToClipboard() {
        const textToCopy = emailDisplay.textContent;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showPopup(`Email berhasil disalin, silakan paste di email draft anda.`);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    // Seleksi tombol Clear All
    const clearBtn = document.getElementById('clear-btn');
    // clearBtn.addEventListener('click', clearAllSelections);

    clearBtn.addEventListener('click', () => {
        selectedNames = [];
        rightPanel.classList.remove('active');
        motorContainer.classList.remove('hidden');

        // Pastikan "Select All" toggle reset (opsional)
        isAllSelected = {
            division1: false,
            division2: false,
            division3: false,
            division4: false
        };

        // Bersihkan tampilan email di panel kanan
        displayEmails();

        // Bersihkan highlight 'selected' di panel kiri
        // (panggil ulang displayNames dengan filter kosong, 
        //  agar nameList di-refresh)
        displayNames(currentDivision, searchInput.value);
    });

    // // Fungsi untuk Clear All
    // function clearAllSelections() {
    //     // Kosongkan array selectedNames
    //     selectedNames = [];

    //     // Pastikan "Select All" toggle reset (opsional)
    //     isAllSelected = {
    //         division1: false,
    //         division2: false,
    //         division3: false,
    //         division4: false
    //     };

    //     // Bersihkan tampilan email di panel kanan
    //     displayEmails();

    //     // Bersihkan highlight 'selected' di panel kiri
    //     // (panggil ulang displayNames dengan filter kosong, 
    //     //  agar nameList di-refresh)
    //     displayNames(currentDivision, searchInput.value);
    // }

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

});
