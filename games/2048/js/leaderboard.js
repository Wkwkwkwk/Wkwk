document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();
    const scoresList = document.getElementById('scoresList'); // Menggunakan id yang telah diatur

    function updateLeaderboard() {
    db.collection("gameScores")
        .orderBy("score", "desc")
        .limit(9)
        .get()
        .then(function(querySnapshot) {
        scoresList.innerHTML = ''; // Clear previous entries in tbody only
        let rank = 1; // Inisiasi ranking di awal
        querySnapshot.forEach(function(doc) {
            const data = doc.data();
            const row = scoresList.insertRow();
            const cellRank = row.insertCell(0);
            const cellUsername = row.insertCell(1);
            const cellScore = row.insertCell(2);
            cellRank.textContent = rank++; // Set rank dan increment
            cellUsername.textContent = data.username;
            cellScore.textContent = data.score;
        });
        })
        .catch(function(error) {
        console.error("Error fetching scores: ", error);
        });
    }

    // Call the update function periodically if you want to auto-refresh the scores
    updateLeaderboard();
    setInterval(updateLeaderboard, 30000); // Refresh every 30 seconds
});
