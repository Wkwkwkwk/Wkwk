document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        window.location.href = 'main.html'; // Redirect to the main page after loading
    }, 3000); // Adjust the timeout duration as needed
});

document.addEventListener('DOMContentLoaded', function() {
    const letters = document.querySelectorAll('.loading-text span');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.1}s`;
    });
});
