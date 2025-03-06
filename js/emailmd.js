document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.getElementById('marquee');
    const marqueeText = document.getElementById('marqueeText');

    // Tab items (SUP IGR, SAM IGR, SM IGR, MSJM IGR)
    const tabItems = document.querySelectorAll('.tab-item');
    // Kontainer list nama email di panel kiri
    const nameListContainer = document.getElementById('name-list');
    // Input pencarian
    const searchInput = document.getElementById('searchInput');
    
    // Bagian output email di panel kanan
    const emailDisplay = document.getElementById('email-display');
    const copyBtn = document.getElementById('copy-btn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearBtn = document.getElementById('clear-btn'); // Pastikan ini sudah ada di HTML

    // Di sini kita siapkan container untuk sub tab
    const subTabSection = document.querySelector('.sub-tab-section');

    // ---------------------------------------------
    // DATA SUB TAB (Contoh)
    // ---------------------------------------------
    const subTabData = {
    // division1 = F
    division1: [
        {
        key: 'food 1A',
        label: 'F1A',
        members: [
            { name: 'F1A Yemima', email: 'snack.igr.idm@indomaret.co.id' },
            { name: 'F1A Mishella', email: 'misshella@indomaret.co.id' },
            { name: 'F1A Hengky Yap', email: 'hengky@indomaret.co.id' },
            // tambahkan lagi...
        ]
        },
        {
            key: 'food 1B',
            label: 'F1B',
            members: [
                { name: 'F1B Monika Purba', email: 'biscuit.igr.adm@indomaret.co.id' },
                { name: 'F1B Jonathan', email: 'jonathan@indomaret.co.id' },
                { name: 'F1B Oscar', email: 'biscuit.igr.spv@indomaret.co.id' },
                { name: 'F1B Lauren', email: 'biscuit.igr.spv@indomaret.co.id' },
                // tambahkan lagi...
            ]
            },
        {
        key: 'food 2A',
        label: 'F2A',
        members: [
            { name: 'F2A Silvi', email: 'basicfood.igr.adm@indomaret.co.id' },
            { name: 'F2A Cahyo Nugroho', email: 'cahyo@indomaret.co.id' },
            { name: 'F2A Handoko', email: 'handoko@indomaret.co.id' },
            // tambahkan lagi...
        ]
        },
        {
        key: 'food 3B',
        label: 'F3B',
        members: [
            { name: 'F3B Narya', email: 'breakfast.igr.adm@indomaret.co.id' },
            { name: 'F3B Banu', email: 'banu.p@indomaret.co.id' },
            { name: 'F3B Maria F', email: 'mariaf@indomaret.co.id' },
            { name: 'F3B Ardi', email: 'ardi@indomaret.co.id' },
        ]
        },
        {
        key: 'food 4A',
        label: 'F4A',
        members: [
            { name: 'F4A Oka', email: 'instantfood.igr.adm@indomaret.co.id' },
            { name: 'F4A Amir', email: 'amirp@indomaret.co.id' },
            { name: 'F4A Powa', email: 'powa@indomaret.co.id' },
            { name: 'F4A LEI', email: 'lemie@indomaret.co.id' },
            
        ]
        },
        {
            key: 'food 5A',
            label: 'F5A',
            members: [
                { name: 'F5A Rizal', email: 'beverages.igr.adm1@indomaret.co.id' },
                { name: 'F5A Evi', email: 'beverages.igr.adm2@indomaret.co.id' },
                { name: 'F5A Greg', email: 'greg@indomaret.co.id' },
                { name: 'F5A Findy', email: 'findy@indomaret.co.id' },
                { name: 'F5A DCA', email: 'denielc@indomaret.co.id' },
            ]
        },
        {
            key: 'food 5B',
            label: 'F5B',
            members: [
                { name: 'F5B Fitri', email: 'milk.igr.adm@indomaret.co.id' },
                { name: 'F5B DCA', email: 'denielc@indomaret.co.id' },
                { name: 'F5B Kezia Emeralda', email: 'keziaemeralda@indomaret.co.id' },
                { name: 'F5B ANDI', email: 'andi.saputra@indomaret.co.id' },
            ]
        },
    ],

    // division2 = NF
    division2: [
        {
            key: 'nonfood 1A',
            label: 'NF1A',
            members: [
                { name: 'NF1A Sinta', email: 'bodycare.igr.adm@indomaret.co.id' },
                { name: 'NF1A Septian', email: 'septian.h@indomaret.co.id' },
                { name: 'NF1A Wati Asih', email: 'wati@indomaret.co.id' },
                { name: 'NF1A Cahyono', email: 'cahyonoh@indomaret.co.id' },
                
                // tambahkan lagi...
            ]
            },
            {
                key: 'nonfood 1B',
                label: 'NF1B',
                members: [
                    { name: 'NF1B Ruben', email: 'cosmetic.igr.adm@indomaret.co.id' },
                    { name: 'NF1B Jelita', email: 'jelita@indomaret.co.id' },
                    { name: 'NF1B Ating', email: 'ating@indomaret.co.id' },
                    { name: 'NF1B Cahyono', email: 'cahyonoh@indomaret.co.id' },
                    
                    // tambahkan lagi...
                ]
                },
            {
            key: 'nonfood 2 A',
            label: 'NF2A',
            members: [
                { name: 'NF2A Arika', email: 'detergent.igr.adm@indomaret.co.id' },
                { name: 'NF2A Wilmington', email: 'wilmington@indomaret.co.id' },
                { name: 'NF2A Michael J', email: 'michaelj@indomaret.co.id' },
                { name: 'NF2A HLN', email: 'helen@indomaret.co.id' },
                // tambahkan lagi...
            ]
            },
            {
            key: 'nonfood 3A',
            label: 'NF3A',
            members: [
                { name: 'NF3A HLN', email: 'helen@indomaret.co.id' },
                { name: 'NF3A Daniel', email: 'medicine.igr.adm@indomaret.co.id' },
                { name: 'NF3A Faiz Derry', email: 'faiz.derry@indomaret.co.id' },
                { name: 'NF3A Budi P', email: 'budip@indomaret.co.id' },
            ]
            },
        // tambahkan sub-tab lain (Sumatra, Sulawesi, dsb.) sesuai kebutuhan
    ],

    // division3 = GMS
    division3: [
        {
            key: 'gms 1A',
            label: 'GMS 1A',
            members: [
                { name: 'GMS1A Diah', email: 'babycare.idm.adm@indomaret.co.id' },
                { name: 'GMS1A Ryan', email: 'ryan.a@indomaret.co.id' },
                { name: 'GMS1A Oke', email: 'oke@indomaret.co.id' },
                { name: 'GMS1A HKY', email: 'hengkys@indomaret.co.id' },
                // tambahkan lagi...
            ]
            },
        // tambahkan sub-tab lain
    ],

    // division4 = Perishable
    division4: [
        {
            key: 'perishable',
            label: 'Perishable',
            members: [
                { name: 'PS Christian R. Bola', email: 'c.raynaldo@indomaret.co.id' },
                // tambahkan lagi...
            ]
            },
        // tambahkan sub-tab lain
    ]
    };

    // ---------------------------------------------
    // Variabel global data
    // ---------------------------------------------
    let allData = {};
    // Menampung nama-nama (lintas divisi) yang dipilih
    let selectedNames = [];
    // Divisi yang sedang aktif
    let currentDivision = 'division1';
    // Sub tab yang sedang aktif (null = tidak ada)
    let currentSubTab = null;

    // ---------------------------------------------
    // Fetch data dari JSON (data utama)
    // ---------------------------------------------
    fetch('../assets/list/emailmd.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            // Tampilkan data default (tanpa sub tab)
            displayNames(currentDivision, '');
        })
        .catch(error => console.error('Error loading JSON:', error));

    // ---------------------------------------------
    // Fungsi menampilkan sub-tab (dinamis)
    // ---------------------------------------------
    function createSubTabsForDivision(divisionKey) {
    const ul = document.createElement('ul');
    ul.classList.add('sub-tab-list');
    ul.id = `sub-tab-${divisionKey}`;
    ul.style.display = 'none';

    const subTabs = subTabData[divisionKey];
    if (subTabs) {
        subTabs.forEach(sub => {
        const li = document.createElement('li');
        li.classList.add('sub-tab-item');
        li.textContent = sub.label;
        li.setAttribute('data-subKey', sub.key);

        // Saat sub-tab di-klik
        li.addEventListener('click', () => {
            // 1. Tandai sub-tab mana yang aktif
            const siblings = ul.querySelectorAll('.sub-tab-item');
            siblings.forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            // 2. Simpan sub tab aktif di variable global
            currentSubTab = sub; 
            // 3. Tampilkan data sub-tab ini di panel kiri
            displaySubTabMembers(sub.members);
        });

        ul.appendChild(li);
        });
    }

    return ul;
    }

    function displaySubTabMembers(members) {
    // Bersihkan name-list
    nameListContainer.innerHTML = '';

    members.forEach(item => {
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

    // Generate sub-tab untuk semua division
    Object.keys(subTabData).forEach(divisionKey => {
        const subTabUl = createSubTabsForDivision(divisionKey);
        subTabSection.appendChild(subTabUl);
        // Tampilkan sub-tab untuk division1 (currentDivision)
        const defaultSubTabUl = document.getElementById(`sub-tab-${currentDivision}`);
        if (defaultSubTabUl) {
            // Supaya terlihat, set display sub-tab jadi 'flex'
            defaultSubTabUl.style.display = 'flex';
            
            // Tidak ada sub-tab yang di-set "active" dan
            // TIDAK memanggil displaySubTabMembers() di sini
            // agar benar-benar tidak ada sub-tab yang langsung terbuka.
        }
    });

    // ---------------------------------------------
    // Fungsi untuk menampilkan data bawaan JSON
    // ---------------------------------------------
    function displayNames(divisionKey, filter) {
    currentSubTab = null; // reset sub-tab active
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

    // ---------------------------------------------
    // Tambah/hapus item dari selectedNames
    // ---------------------------------------------
    function addSelectedName(item) {
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

    // ---------------------------------------------
    // Tampilkan email terpilih di panel kanan
    // ---------------------------------------------
    function displayEmails() {
        const emailList = selectedNames.map(obj => obj.email);
        if (emailList.length > 0) {
            emailDisplay.textContent = emailList.join('; ') + ';';
        } else {
            emailDisplay.textContent = ''; // Kosongkan jika tidak ada email
        }
    }

    // ---------------------------------------------
    // Pencarian
    // ---------------------------------------------
    searchInput.addEventListener('input', () => {
    const filterValue = searchInput.value.trim();
    // Jika sedang ada sub-tab aktif, tampilkan sub-tab data
    if (currentSubTab) {
        // Filter data sub-tab
        const filtered = currentSubTab.members.filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
        );
        displaySubTabMembers(filtered);
    } else {
        // Jika tidak ada sub-tab, gunakan data main
        displayNames(currentDivision, filterValue);
    }
    });

    // ---------------------------------------------
    // Event listener: Tab utama (SUP, SAM, SM, MSJM)
    // ---------------------------------------------
    tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
        // Nonaktifkan tab lama
        document.querySelector('.tab-item.active').classList.remove('active');
        // Aktifkan tab baru
        tab.classList.add('active');

        // Perbarui currentDivision
        currentDivision = tab.getAttribute('data-division');

        // Reset pencarian
        searchInput.value = '';

        // Tampilkan data default (dari JSON) di panel kiri
        displayNames(currentDivision, '');

        // Sembunyikan semua sub-tab
        const allSubTabLists = document.querySelectorAll('.sub-tab-list');
        allSubTabLists.forEach(ul => {
            ul.style.display = 'none';
            ul.querySelectorAll('.sub-tab-item').forEach(item => item.classList.remove('active'));
        });

        // Tampilkan sub-tab milik division yg aktif
        const activeSubTabUl = document.getElementById(`sub-tab-${currentDivision}`);
        if (activeSubTabUl) {
            activeSubTabUl.style.display = 'flex';
        }
    });
    });

    // ---------------------------------------------
    // Tombol "Select All" / "Unselect All" (hanya tab atau sub-tab aktif)
    // ---------------------------------------------
    selectAllBtn.addEventListener('click', () => {
    // Jika ada sub-tab aktif, select/unselect data sub-tab saja
    if (currentSubTab) {
        toggleSelectAllSubTab(currentDivision, currentSubTab);
    } else {
        // Jika tidak ada sub-tab, select/unselect data main tab
        toggleSelectAllMain(currentDivision);
    }
    });

    // Fungsi select/unselect di sub-tab aktif
    function toggleSelectAllSubTab(divisionKey, sub) {
    // Cek apakah semua item sub-tab sudah diselected
    const subEmails = sub.members.map(m => m.email);
    const allSelected = sub.members.every(m =>
        selectedNames.some(sel => sel.email === m.email)
    );

    if (!allSelected) {
        // Jika belum semua dipilih -> pilih semua
        sub.members.forEach(item => addSelectedName(item));
    } else {
        // Jika sudah semua dipilih -> unselect semua
        sub.members.forEach(item => removeSelectedName(item));
    }

    // Refresh panel kiri (sub-tab) dan panel kanan
    displaySubTabMembers(sub.members);
    displayEmails();
    }

    // Fungsi select/unselect di main tab
    function toggleSelectAllMain(divisionKey) {
    // data main tab
    const dataTab = allData[divisionKey] || [];
    // Cek apakah semua item main tab sudah diselected
    const allSelected = dataTab.every(m =>
        selectedNames.some(sel => sel.email === m.email)
    );

    if (!allSelected) {
        // Belum semua -> select all
        dataTab.forEach(item => addSelectedName(item));
    } else {
        // Sudah semua -> unselect all
        dataTab.forEach(item => removeSelectedName(item));
    }

    // Refresh panel kiri (main tab) dan panel kanan
    displayNames(divisionKey, searchInput.value);
    displayEmails();
    }

    // ---------------------------------------------
    // Tombol Clear All
    // ---------------------------------------------
    clearBtn.addEventListener('click', clearAllSelections);

    function clearAllSelections() {
    selectedNames = [];
    // Reset tampilan email
    displayEmails();

    // Jika sedang lihat sub-tab, refresh sub-tab
    if (currentSubTab) {
        displaySubTabMembers(currentSubTab.members);
    } else {
        displayNames(currentDivision, searchInput.value);
    }
    }

    // ---------------------------------------------
    // Fungsi Copy ke Clipboard
    // ---------------------------------------------
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
