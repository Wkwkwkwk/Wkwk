document.addEventListener('DOMContentLoaded', async function () {
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const infoUsername = document.getElementById('infoUsername');
    const infoPassword = document.getElementById('infoPassword');

    // Fetch all users from Firestore
    const usersSnapshot = await db.collection("users").get();
    usersSnapshot.forEach(doc => {
        const user = doc.data();
        const row = userTable.insertRow();
        row.insertCell(0).textContent = user.username;
        row.addEventListener('click', () => {
            infoUsername.textContent = user.username;
            infoPassword.textContent = user.password;
        });
    });
});

function changePassword() {
    const username = document.getElementById('infoUsername').textContent;
    const newPassword = prompt("Masukkan password baru:");
    if (newPassword) {
        db.collection("users").doc(username).update({ password: newPassword })
            .then(() => alert("Password berhasil diubah!"))
            .catch(error => console.error("Error updating password: ", error));
    }
}

function deleteUser() {
    const username = document.getElementById('infoUsername').textContent;
    if (confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
        db.collection("users").doc(username).delete()
            .then(() => {
                alert("User berhasil dihapus!");
                window.location.reload();
            })
            .catch(error => console.error("Error deleting user: ", error));
    }
}

function registerNewUser() {
    window.location.href = 'registrasi.html';
}