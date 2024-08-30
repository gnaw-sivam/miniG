// let gameBoard, timerDisplay, resetButton;
let gameBoard, timerDisplay, resetButton, winModal, finalTimeSpan, closeModal;

let flippedCards = [];
let matchedCards = 0;
let startTime;
let timerInterval;
let lockBoard = false;

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null; // Clear the timerInterval reference
    const elapsed = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time
    return elapsed; // Return the elapsed time
}

function generateRandomImageUrl() {
    const randomNum = Math.floor(Math.random() * 1000) + 1; // Generate a random number between 1 and 1000
    return `https://picsum.photos/200/300?random=${randomNum}`;
}

function createBoard() {
    const imageUrls = [];
    const totalCards = 16; // Total number of cards

    // Generate pairs of random images
    for (let i = 0; i < totalCards / 2; i++) {
        const url = generateRandomImageUrl();
        imageUrls.push(url, url); // Add the same URL twice to create a pair
    }

    // Shuffle the image URLs
    const shuffledImageUrls = imageUrls.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = ''; // Clear the board

    shuffledImageUrls.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        const cardImage = document.createElement('img');
        cardImage.src = value;
        card.dataset.value = value; // Store the value
        card.appendChild(cardImage);

        card.addEventListener('click', () => {
            if (lockBoard || card.classList.contains('flipped') || flippedCards.length === 2) return;

            if (!timerInterval) {
                startTimer(); // Start the timer on the first card flip
            }

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                lockBoard = true;
                setTimeout(() => {
                    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                        flippedCards[0].classList.add('matched');
                        flippedCards[1].classList.add('matched');
                        matchedCards += 2;

                        if (matchedCards === shuffledImageUrls.length) {
                            const finalTime = stopTimer(); // Capture the final time
                            finalTimeSpan.textContent = `Time: ${finalTime}s`; // Update the final time in the modal
                            winModal.style.display = "block"; // Show the modal
                        }

                    } else {
                        flippedCards[0].classList.remove('flipped');
                        flippedCards[1].classList.remove('flipped');
                    }
                    flippedCards = [];
                    lockBoard = false;
                }, 200); // Shortened flipping time
            }
        });

        gameBoard.appendChild(card);
    });
}

function resetGame() {
    stopTimer();
    timerDisplay.textContent = 'Time: 0s'; // Ensure timer display is reset
    matchedCards = 0;
    flippedCards = [];
    lockBoard = false;
    createBoard();
}

document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.getElementById('gameBoard');
    timerDisplay = document.getElementById('timer');
    resetButton = document.getElementById('resetButton');
    winModal = document.getElementById('winModal');
    finalTimeSpan = document.getElementById('finalTime');
    closeModal = document.querySelector('.close');

    createBoard();

    resetButton.addEventListener('click', resetGame);

    closeModal.addEventListener('click', () => {
        winModal.style.display = "none"; // Hide the modal when the close button is clicked
    });

    window.addEventListener('click', (event) => {
        if (event.target === winModal) {
            winModal.style.display = "none"; // Hide the modal when clicking outside of it
        }
    });
});
