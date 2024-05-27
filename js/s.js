// script.js

// Select the button and audio elements
const playButton = document.getElementById('playButton');
const music = document.getElementById('music');

// Add click event listener to the button
playButton.addEventListener('click', () => {
    // Play the audio
    music.play();
});
