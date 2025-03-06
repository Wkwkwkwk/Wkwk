const closeAllPopups = () => {
  document.querySelectorAll('.popupContainer').forEach(popup => {
      popup.classList.remove('popupActive');
  });
};

const closeAllChildSubButtons = () => {
  document.querySelectorAll('.child-sub-buttons').forEach(child => {
      child.classList.remove('show');
  });
};

document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function (event) {
      // Close all popups and child sub buttons if a main button is clicked
      if (!this.classList.contains('toggleChild')) {
          closeAllChildSubButtons();
          closeAllPopups();
      }

      // Preventing click on 'btn' sub-buttons to close parent popup
      if (this.classList.contains('toggleChild')) {
          event.stopPropagation();
      }
  });
});

document.querySelectorAll('.close-btn').forEach(button => {
  button.addEventListener('click', function () {
      this.closest('.popupContainer').classList.remove('popupActive');
  });
});

const PDFBtn = document.getElementById("PDF");
const closePopupBtn = document.getElementById("closePopup");
const popup = document.getElementById("popupMenu");

PDFBtn.addEventListener("click", function () {
  closeAllPopups();
  popup.classList.add("popupActive");
});

closePopupBtn.addEventListener("click", function () {
  popup.classList.remove("popupActive");
});

// Event listener untuk button "Kumpulan Link"
const button1 = document.getElementById("Button1");
const closePopup1 = document.getElementById("closePopup1");
const popup1 = document.getElementById("popupMenu1");

button1.addEventListener("click", function () {
  closeAllPopups();
  popup1.classList.add("popupActive");
});

closePopup1.addEventListener("click", function () {
  popup1.classList.remove("popupActive");
});

// Event listener untuk button "Generate QR"
const generateQRBtn = document.getElementById("generateQR");
const closePopupQRBtn = document.getElementById("closePopupQR");
const popupQR = document.getElementById("popupMenuQR");

generateQRBtn.addEventListener("click", function () {
  closeAllPopups();
  popupQR.classList.add("popupActive");
});

closePopupQRBtn.addEventListener("click", function () {
  popupQR.classList.remove("popupActive");
});

// Event listener untuk button "email"
const generateEmailBtn = document.getElementById("email");
const closePopupEmailBtn = document.getElementById("closePopupEmail");
const popupEmail = document.getElementById("popupMenuEmail");

generateEmailBtn.addEventListener("click", function () {
  closeAllPopups();
  popupEmail.classList.add("popupActive");
});

closePopupEmailBtn.addEventListener("click", function () {
  popupEmail.classList.remove("popupActive");
});

// Event listener untuk button "ftp"
const generateFTPBtn = document.getElementById("ftp");
const closePopupFTPBtn = document.getElementById("closePopupFTP");
const popupFTP = document.getElementById("popupMenuFTP");

generateFTPBtn.addEventListener("click", function () {
closeAllPopups();
popupFTP.classList.add("popupActive");
});

closePopupFTPBtn.addEventListener("click", function () {
popupFTP.classList.remove("popupActive");
});


// Event listener untuk button "Informasi"
const infoBtn = document.getElementById("info");
const closePopupInfoBtn = document.getElementById("closePopupInfo");
const popupInfo = document.getElementById("popupMenuInfo");

infoBtn.addEventListener("click", function () {
  closeAllPopups();
  popupInfo.classList.add("popupActive");
});

closePopupInfoBtn.addEventListener("click", function () {
  popupInfo.classList.remove("popupActive");
});

// Event listener untuk button "Template dan Logo"
const ltBtn = document.getElementById("templateLogo");
const closePopupLTBtn = document.getElementById("closePopupLT");
const popupLT = document.getElementById("popupMenuLT");

ltBtn.addEventListener("click", function () {
  closeAllPopups();
  popupLT.classList.add("popupActive");
});

closePopupLTBtn.addEventListener("click", function () {
  popupLT.classList.remove("popupActive");
});

// Event listener untuk button "Manipulasi Gambar"
const gambarBtn = document.getElementById("gambarBtn");
const closePopupGambarBtn = document.getElementById("closePopupGambar");
const popupGambar = document.getElementById("popupMenuGambar");

gambarBtn.addEventListener("click", function () {
  closeAllPopups();
  popupGambar.classList.add("popupActive");
});

closePopupGambarBtn.addEventListener("click", function () {
  popupGambar.classList.remove("popupActive");
});

// // Event listener untuk button "AI"
// const AIBtn = document.getElementById("AIBtn");
// const closePopupAIBtn = document.getElementById("closePopupAI");
// const popupAI = document.getElementById("popupMenuAI");

// AIBtn.addEventListener("click", function () {
//   closeAllPopups();
//   popupAI.classList.add("popupActive");
// });

// closePopupAIBtn.addEventListener("click", function () {
//   popupAI.classList.remove("popupActive");
// });

// Event listener untuk button "calculator"
const calcBtn = document.getElementById("calcBtn");
const closePopupCalcBtn = document.getElementById("closePopupCalc");
const popupCalc = document.getElementById("popupMenuCalc");

calcBtn.addEventListener("click", function () {
  closeAllPopups();
  popupCalc.classList.add("popupActive");
});

closePopupCalcBtn.addEventListener("click", function () {
  popupCalc.classList.remove("popupActive");
});

// Event listener untuk button "alokasi"
const alokasiBtn = document.getElementById("alokasiBtn");
const closePopupAlokasiBtn = document.getElementById("closePopupAlokasi");
const popupAlokasi = document.getElementById("popupMenuAlokasi");

alokasiBtn.addEventListener("click", function () {
  closeAllPopups();
  popupAlokasi.classList.add("popupActive");
});

closePopupAlokasiBtn.addEventListener("click", function () {
  popupAlokasi.classList.remove("popupActive");
});

// Event listener untuk button "youtube"
const youtubeBtn = document.getElementById("youtubeBtn");
const closePopupYtbBtn = document.getElementById("closePopupYtb");
const popupYtb = document.getElementById("popupMenuYtb");

youtubeBtn.addEventListener("click", function () {
  closeAllPopups();
  popupYtb.classList.add("popupActive");
});

closePopupAlokasiBtn.addEventListener("click", function () {
  popupYtb.classList.remove("popupActive");
});

// Toggle child sub buttons
document.querySelectorAll('.toggleChild').forEach(button => {
  button.addEventListener('click', function (event) {
      const childSubButtons = this.nextElementSibling;
      if (childSubButtons.classList.contains('show')) {
          childSubButtons.classList.remove('show');
      } else {
          closeAllChildSubButtons();
          childSubButtons.classList.add('show');
      }
      event.stopPropagation(); // Prevent triggering parent's click event
  });
});

// Copy to clipboard function
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.querySelector('p').innerText;
  navigator.clipboard.writeText(text).then(() => {
      alert("Berhasil Dicopy");
  }).catch(err => {
      console.error('Failed to copy text: ', err);
  });
}

let typedText = ''; // Variabel untuk menyimpan teks yang diketik pengguna

document.addEventListener('keydown', function (event) {
    // Cek apakah fokus berada di dalam search bar
    const activeElement = document.activeElement;
    if (activeElement && activeElement.id === 'searchBar') {
        return; // Jika sedang mengetik di search bar, abaikan logika berikutnya
    }

    // Tambahkan karakter yang diketik ke typedText
    typedText += event.key.toLowerCase();

    // Batasi panjang teks hanya sebesar kata terpanjang ("planetes" - 8 karakter)
    if (typedText.length > 8) {
        typedText = typedText.slice(-8);
    }

    // Periksa apakah teks yang diketik cocok dengan "monster"
    if (typedText === 'monster') {
        window.location.href = 'monster.html'; // Redirect ke monster.html
    }

    // Periksa apakah teks yang diketik cocok dengan "planetes"
    else if (typedText === 'planetes') {
        window.location.href = 'solar_system.html'; // Redirect ke solar_system.html
    }

    // Periksa apakah teks yang diketik cocok dengan "2048"
    else if (typedText === '2048') {
        window.location.href = 'games/2048/index.html'; // Redirect ke index.html
    }
});

document.addEventListener("DOMContentLoaded", function () {
  function showRandomEasterEggInfo() {
      const easterEggInfo = document.getElementById("easterEggInfo");

      // Pastikan elemen ditemukan sebelum mencoba mengaksesnya
      if (!easterEggInfo) {
          console.error("Element with ID 'easterEggInfo' not found.");
          return; // Keluar dari fungsi jika elemen tidak ditemukan
      }

      const messages = [
          "Easter egg, ketik 'planetes' di sembarang tempat",
          "Easter egg, ketik 'monster' di sembarang tempat",
          "Easter egg, ketik '2048' di sembarang tempat",
          ""
      ];

      // Pilih pesan secara acak
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      easterEggInfo.textContent = randomMessage;

      // Jadwalkan pesan untuk berubah setiap 10 detik
      setTimeout(showRandomEasterEggInfo, 40000);
  }

  // Jalankan fungsi saat halaman dimuat
  showRandomEasterEggInfo();
});

// Tutup popup jika user klik di luar box popup
document.addEventListener('click', function(event) {
  // Mencari elemen popup container terdekat dari target klik
  // (closest akan bernilai null jika tidak menemukan .popupContainer di atasnya)
  const isClickInsidePopup = event.target.closest('.popupContainer');
  const isClickOnButton = event.target.closest('.btn');
  
  // Jika tidak ada elemen popup container di atas target klik
  // dan bukan klik di tombol (agar tidak langsung menutup popup saat tombol diklik),
  // maka tutup semua popup dan child-sub-buttons
  if (!isClickInsidePopup && !isClickOnButton) {
      closeAllPopups();
      closeAllChildSubButtons();
  }
});

// Event listener untuk tombol logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', function() {
  // Hapus cookie 'username'
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Hapus cookie 'loggedIn'
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Arahkan ke halaman login.html
  window.location.href = 'login.html';
});

// Fungsi pencarian dengan mendukung easter egg
const searchBar = document.getElementById('searchBar');
const easterEggContainer = document.createElement('div');
easterEggContainer.classList.add('buttonContainer1');
easterEggContainer.style.display = 'none'; // Default tidak ditampilkan
easterEggContainer.innerHTML = `
        <a href="games/2048/index.html" class="btn" target="_blank" onclick="recordFeatureUsage('Game 2048')">2048</a>
        <a href="monster.html" class="btn" target="_blank" onclick="recordFeatureUsage('Monster')">Monster</a>
        <a href="solar_system.html" class="btn" target="_blank" onclick="recordFeatureUsage('Planetes')">Planetes</a>
`;
// Tambahkan ke DOM di akhir .mainContainer
document.querySelector('.mainContainer').appendChild(easterEggContainer);

searchBar.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const buttonContainers = document.querySelectorAll('.buttonContainer:not(.easterEggContainer)');
    let hasResult = false;

    // Sembunyikan semua button container kecuali easter egg
    buttonContainers.forEach(container => {
        container.style.display = 'none';
    });

    // Cari button dan sub-button yang sesuai dengan query
    const buttons = document.querySelectorAll('.btn, .sub-buttons .btn');
    buttons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes(query)) {
            hasResult = true;
            const container = button.closest('.buttonContainer');
            if (container) {
                container.style.display = 'block';
            }
        }
    });

    // Tampilkan sub-button khusus jika query adalah easter egg
    if (['2048', 'monster', 'planetes'].includes(query)) {
        easterEggContainer.style.display = 'block';
        hasResult = true;
    } else {
        easterEggContainer.style.display = 'none';
    }

    // Jika tidak ada hasil, tampilkan semua kembali
    if (!hasResult && query === '') {
        buttonContainers.forEach(container => {
            container.style.display = 'block';
        });
        easterEggContainer.style.display = 'none'; // Pastikan disembunyikan jika kosong
    }
});

// Deteksi klik di luar search bar dan buttonContainer
document.addEventListener('click', function (event) {
  const isClickInsideSearchBar = event.target.closest('#searchBar');
  const isClickInsideButtonContainer = event.target.closest('.buttonContainer');

  // Jika tidak klik di dalam search bar atau buttonContainer
  if (!isClickInsideSearchBar && !isClickInsideButtonContainer) {
      // Hapus teks di search bar
      searchBar.value = '';

      // Tampilkan semua buttonContainer kembali
      const buttonContainers = document.querySelectorAll('.buttonContainer');
      buttonContainers.forEach(container => {
          container.style.display = 'block';
      });

      // Sembunyikan easterEggContainer
      easterEggContainer.style.display = 'none';
  }
});
