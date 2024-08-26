let gameBoard, timerDisplay, resetButton;
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
}

function createBoard() {
    const cardValues = [
        'https://picsum.photos/200/300?random=1',
        'https://picsum.photos/200/300?random=1',
        'https://picsum.photos/200/300?random=2',
        'https://picsum.photos/200/300?random=2',
        'https://picsum.photos/200/300?random=3',
        'https://picsum.photos/200/300?random=3',
        'https://picsum.photos/200/300?random=4',
        'https://picsum.photos/200/300?random=4',
        'https://picsum.photos/200/300?random=5',
        'https://picsum.photos/200/300?random=5',
        'https://picsum.photos/200/300?random=6',
        'https://picsum.photos/200/300?random=6',
        'https://picsum.photos/200/300?random=7',
        'https://picsum.photos/200/300?random=7',
        'https://picsum.photos/200/300?random=8',
        'https://picsum.photos/200/300?random=8'
    ];

    // Shuffle the card values
    const shuffledCardValues = cardValues.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = ''; // Clear the board

    shuffledCardValues.forEach(value => {
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

                        if (matchedCards === shuffledCardValues.length) {
                            stopTimer();
                            setTimeout(() => alert('You won!'), 300);
                        }
                    } else {
                        flippedCards[0].classList.remove('flipped');
                        flippedCards[1].classList.remove('flipped');
                    }
                    flippedCards = [];
                    lockBoard = false;
                }, 1000); // Shortened flipping time
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

    createBoard();

    resetButton.addEventListener('click', resetGame);
});
