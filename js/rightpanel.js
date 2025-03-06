document.addEventListener('DOMContentLoaded', () => {
    const rightPanel = document.querySelector('.right-panel'); 
    const motorContainer = document.querySelector('.motor-container');

    // Klik di luar untuk menyembunyikan panel kanan
    // Klik di luar untuk menyembunyikan panel kanan dan tampilkan GIF motor
    document.addEventListener('click', (e) => {
        if (!rightPanel.contains(e.target) && !nameListContainer.contains(e.target)) {
            rightPanel.classList.remove('active');
            motorContainer.classList.remove('hidden');
        }
    });

    // rightPanel.classList.remove('hidden'); // Reset animasi sebelum diaktifkan kembali
    // motorContainer.classList.add('active'); // Sembunyikan GIF motor

    // if (!user.ftp || user.ftp.length === 0) {
    //     // Jika user tidak memiliki FTP, sembunyikan panel kanan dan tampilkan GIF motor
    //     rightPanel.classList.remove('active');
    //     motorContainer.classList.remove('hidden');
    //     return;
    // }

    // Tampilkan panel kanan dengan animasi
    // setTimeout(() => {
    //     rightPanel.classList.add('active');
    // }, 10); // Delay untuk memastikan transisi terlihat

});