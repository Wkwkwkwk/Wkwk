document.addEventListener('DOMContentLoaded', () => {
    const lihatPasswordBtn = document.getElementById('lihatPasswordBtn');
    const tutupHalamanBtn = document.getElementById('tutupHalamanBtn');
    const cekLagiBtn = document.getElementById('cekLagiBtn');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const usernameInput = document.getElementById('username');

    if (lihatPasswordBtn && usernameInput && passwordDisplay) {
        lihatPasswordBtn.addEventListener('click', async function (event) {
            event.preventDefault();
            const username = usernameInput.value.trim();

            if (!username) {
                passwordDisplay.textContent = 'Mohon masukkan username.';
                passwordDisplay.style.color = 'red';
                passwordDisplay.style.fontWeight = 'bold';
                passwordDisplay.style.textAlign = 'center';
                return;
            }

            try {
                const querySnapshot = await db.collection("users").get();
                let foundPassword = null;

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.username === username) {
                        foundPassword = userData.password;
                    }
                });

                if (foundPassword) {
                    passwordDisplay.textContent = `${foundPassword}`;
                    passwordDisplay.style.color = 'black';
                    passwordDisplay.style.fontSize = '24px';
                    passwordDisplay.style.textAlign = 'center';
                    passwordDisplay.style.fontWeight = 'bold';
                    lihatPasswordBtn.classList.add('hidden');
                    tutupHalamanBtn.classList.remove('hidden');
                    cekLagiBtn.classList.remove('hidden');
                } else {
                    passwordDisplay.textContent = 'Username tidak ditemukan.';
                    passwordDisplay.style.color = 'red';
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                passwordDisplay.textContent = 'Terjadi kesalahan. Mohon coba lagi.';
                passwordDisplay.style.color = 'red';
            }
        });
    }

    if (cekLagiBtn) {
        cekLagiBtn.addEventListener('click', function () {
            if (passwordDisplay) passwordDisplay.textContent = '';
            if (lihatPasswordBtn) lihatPasswordBtn.classList.remove('hidden');
            if (tutupHalamanBtn) tutupHalamanBtn.classList.add('hidden');
            if (cekLagiBtn) cekLagiBtn.classList.add('hidden');
        });
    }

    if (tutupHalamanBtn) {
        tutupHalamanBtn.addEventListener('click', function () {
            console.log('Tombol Tutup diklik');
            window.location.href = 'gantiPassword.html';// Redirect ke halaman admin
        });
    } else {
        console.log('tutupHalamanBtn tidak ditemukan');
    }
    

    // Animasi gambar motor
    const motorAnimation = document.querySelector('.motor-animation');
    const motorBaruteks = document.querySelector('.motor-baruteks');

    if (motorAnimation && motorBaruteks) {
        motorAnimation.addEventListener('mouseover', () => {
            motorAnimation.style.display = 'none';
            motorBaruteks.style.display = 'block';
        });

        motorBaruteks.addEventListener('mouseout', () => {
            motorBaruteks.style.display = 'none';
            motorAnimation.style.display = 'block';
        });
    } else {
        console.warn('Elemen animasi motor tidak ditemukan.');
    }
});
