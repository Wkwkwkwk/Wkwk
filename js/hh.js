document.addEventListener('DOMContentLoaded', function () {
    const hhBtn = document.getElementById('hh-btn');
    const spBtn = document.getElementById('sp-btn');
    const kebulanBtn = document.getElementById('kebulan-btn');
    const sheetEditor = document.getElementById('sheet-editor');
    const loadingPopup = document.getElementById('loading-popup');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');

    // Buat tombol untuk toggle panel kiri
    const toggleLeftPanelButton = document.createElement('button');
    toggleLeftPanelButton.style.backgroundImage = 'url("../assets/cursor/minimize.png")';
    toggleLeftPanelButton.style.backgroundSize = '50%'; // Gambar latar menempati 50% dari tombol
    toggleLeftPanelButton.style.backgroundRepeat = 'no-repeat'; // Tidak mengulang gambar
    toggleLeftPanelButton.style.backgroundPosition = 'center'; // Gambar berada di tengah
    toggleLeftPanelButton.style.width = '50px'; // Ukuran tombol
    toggleLeftPanelButton.style.height = '50px'; // Ukuran tombol
    toggleLeftPanelButton.classList.add('toggle-left-panel');
    document.body.appendChild(toggleLeftPanelButton);

    function showLoading() {
        loadingPopup.style.display = 'flex'; // Menampilkan loading
    }

    function hideLoading() {
        loadingPopup.style.display = 'none'; // Menyembunyikan loading
    }

    function loadSheet(googleSheetsUrl) {
        showLoading();
        sheetEditor.src = googleSheetsUrl;

        sheetEditor.onload = function () {
            setTimeout(hideLoading, 0.005); // Menunggu 5 ms untuk memastikan iframe termuat
        };
    }

    function togglePanelVisibility() {
        if (leftPanel.style.display === 'none') {
            leftPanel.style.display = 'block';
            rightPanel.style.flex = '1'; // Kembali ke ukuran normal
            toggleLeftPanelButton.style.backgroundImage = 'url("../assets/cursor/minimize.png")'; // Ganti ke gambar minimize
        } else {
            leftPanel.style.display = 'none';
            rightPanel.style.flex = '2'; // Memperbesar panel kanan
            toggleLeftPanelButton.style.backgroundImage = 'url("../assets/cursor/minimize.png")'; // Ganti ke gambar maximize
        }
    }

    hhBtn.addEventListener('click', function () {
        const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/1-CiNOAywOmTQzyFJxS0LSBvNl0gIro5BAPYYAa3H_8c/edit?gid=359849260#gid=359849260';
        loadSheet(googleSheetsUrl);
        togglePanelVisibility(); // Sembunyikan panel kiri dan expand panel kanan
    });

    spBtn.addEventListener('click', function () {
        const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/1kD7cBiSIDYNZhaOsDUSaYAdOrZjhFKCx7QK3Y_LHgac/edit?gid=2055181361#gid=2055181361';
        loadSheet(googleSheetsUrl);
        togglePanelVisibility();
    });

    kebulanBtn.addEventListener('click', function () {
        const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/1ThKS2oc2htWAedffEFWSpCIEJZ0k9aUSyEYoWgN-yQo/edit?gid=2086912375#gid=2086912375';
        loadSheet(googleSheetsUrl);
        togglePanelVisibility();
    });

    toggleLeftPanelButton.addEventListener('click', togglePanelVisibility);

    let scrollbarOverlay;

    sheetEditor.addEventListener('mouseenter', () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden'; // Nonaktifkan scroll
        document.body.style.paddingRight = `${scrollbarWidth}px`; // Tambahkan padding untuk mengkompensasi scrollbar

        // Buat overlay hitam untuk menggantikan scrollbar
        if (!scrollbarOverlay) {
            scrollbarOverlay = document.createElement('div');
            scrollbarOverlay.style.position = 'fixed';
            scrollbarOverlay.style.top = '0';
            scrollbarOverlay.style.right = '0';
            scrollbarOverlay.style.width = `${scrollbarWidth}px`;
            scrollbarOverlay.style.height = '100vh';
            scrollbarOverlay.style.backgroundColor = 'black'; // Warna hitam total
            scrollbarOverlay.style.zIndex = '1000';
            document.body.appendChild(scrollbarOverlay);
        }
    });

    sheetEditor.addEventListener('mouseleave', () => {
        document.body.style.overflow = ''; // Aktifkan kembali scroll
        document.body.style.paddingRight = ''; // Hapus padding

        // Hapus overlay hitam jika ada
        if (scrollbarOverlay) {
            document.body.removeChild(scrollbarOverlay);
            scrollbarOverlay = null;
        }
    });
});
