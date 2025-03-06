// Fungsi untuk mendapatkan nilai cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fungsi untuk menyimpan skor ke Firebase
function saveScore(score) {
    const username = getCookie('username');
    console.log("Attempting to save score", score, "for user", username);
    if (username) {
        console.log("Username found:", username);
        db.collection("gameScores").add({
            score: score,
            username: username,
            timestamp: new Date()
        }).then(function(docRef) {
            console.log("Score recorded with ID:", docRef.id);
        }).catch(function(error) {
            console.error("Error adding document:", error);
        });
    } else {
        console.log("No username found in cookies.");
    }
}
