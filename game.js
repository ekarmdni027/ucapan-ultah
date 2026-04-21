const container = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const uiLayer = document.getElementById('ui-layer');
const livesEl = document.getElementById('lives-container');
const welcomeOverlay = document.getElementById('welcome-overlay');
const rulesOverlay = document.getElementById('rules-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const statusText = document.getElementById('status-text');
const prizeText = document.getElementById('prize-text');
const actionButtons = document.getElementById('action-buttons');

const gameMusic = document.getElementById('game-music');

let score = 0;
let lives = 3;
let gameActive = false;
let isPaused = false;
let targetWinScore = 1427; 
let spawnInterval;
let heartRainInterval;

// Daftar foto di folder img
const photoList = ["April 1.jpeg", "April 2.jpeg", "April 3.jpeg", "April 4.jpeg"];

function createHeartRain() {
    if (welcomeOverlay.style.display === 'none' && rulesOverlay.style.display === 'none') return;
    const heart = document.createElement('div');
    heart.classList.add('heart-drop');
    const hearts = ['❤️', '💖', '💗', '💓', '💕'];
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + 's';
    (welcomeOverlay.style.display !== 'none' ? welcomeOverlay : rulesOverlay).appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}
heartRainInterval = setInterval(createHeartRain, 300);

function showRules() {
    welcomeOverlay.style.display = 'none';
    rulesOverlay.style.display = 'flex';
}

function movePlayer(clientX) {
    if (!gameActive || isPaused) return;
    const containerRect = container.getBoundingClientRect();
    let relativeX = clientX - containerRect.left;
    const playerHalfWidth = player.offsetWidth / 2;
    if (relativeX < playerHalfWidth) relativeX = playerHalfWidth;
    if (relativeX > containerRect.width - playerHalfWidth) relativeX = containerRect.width - playerHalfWidth;
    player.style.left = relativeX + 'px';
}

container.addEventListener('mousemove', (e) => movePlayer(e.clientX));
container.addEventListener('touchmove', (e) => movePlayer(e.touches[0].clientX), { passive: true });

function triggerBombEffect() {
    isPaused = true;
    if ("vibrate" in navigator) navigator.vibrate(300); 
    container.style.animation = 'shake 0.4s';
    setTimeout(() => container.style.animation = '', 400);
    const heart = document.createElement('div');
    heart.className = 'broken-heart';
    heart.innerHTML = '💔';
    heart.style.top = '40%'; heart.style.left = '40%';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
    setTimeout(() => { if (lives > 0) isPaused = false; }, 1000);
}

function spawnObject() {
    if (!gameActive || isPaused) return;
    const obj = document.createElement('div');
    obj.classList.add('object');
    
    const rand = Math.random();
    let chosen;
    
    // Probabilitas kemunculan
    if (rand < 0.4) {
        chosen = { symbol: '⭐', type: 'star', points: 20 };
    } else if (rand < 0.65) {
        chosen = { symbol: '💖', type: 'love', points: 30 };
    } else if (rand < 0.75) {
        // Mengambil foto acak dari folder img
        const randomPhoto = photoList[Math.floor(Math.random() * photoList.length)];
        chosen = { symbol: `img/${randomPhoto}`, type: 'image', points: 40 };
    } else {
        chosen = { symbol: '💣', type: 'bomb', points: 0 };
    }

    if (chosen.type === 'image') {
        const img = document.createElement('img');
        img.src = chosen.symbol;
        img.onerror = () => { obj.innerHTML = '📸'; }; 
        obj.appendChild(img);
    } else { 
        obj.innerHTML = chosen.symbol; 
    }

    obj.style.left = Math.random() * (container.offsetWidth - 50) + 'px';
    obj.style.top = '-60px';
    container.appendChild(obj);

    let fallSpeed = 3 + (score / 120); 
    let fallInterval = setInterval(() => {
        if (!gameActive) { clearInterval(fallInterval); obj.remove(); return; }
        if (isPaused) return;
        let top = parseFloat(obj.style.top);
        obj.style.top = (top + fallSpeed) + 'px';

        const playerRect = player.getBoundingClientRect();
        const objRect = obj.getBoundingClientRect();
        const isInsideHorizontally = (objRect.left >= playerRect.left - 5 && objRect.right <= playerRect.right + 5);
        const isTouchingTop = (objRect.bottom >= playerRect.top && objRect.top <= playerRect.top + 25);

        if (isTouchingTop && isInsideHorizontally) {
            if (chosen.type === 'bomb') {
                lives--; updateLives(); triggerBombEffect();
                if (lives <= 0) setTimeout(endGame, 500);
            } else {
                score += chosen.points;
                scoreEl.innerText = `Skor: ${score}`;
                if (score >= targetWinScore) endGame();
            }
            clearInterval(fallInterval); obj.remove();
        }
        if (top > container.offsetHeight) { clearInterval(fallInterval); obj.remove(); }
    }, 20);
}

function updateLives() { livesEl.innerText = '❤️'.repeat(lives); }

function startGame() {
    clearInterval(heartRainInterval); 
    welcomeOverlay.style.display = 'none';
    rulesOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    player.style.display = 'flex';
    uiLayer.style.display = 'flex';
    score = 0; lives = 3; gameActive = true; isPaused = false;
    scoreEl.innerText = `Skor: ${score}`;
    updateLives();

    gameMusic.currentTime = 0;
    gameMusic.play().catch(error => {
        console.log("Autoplay dicegah oleh browser, musik akan diputar setelah interaksi.");
    });

    if (spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnObject, 1000);
}

function endGame() {
    gameActive = false;
    isPaused = false;
    clearInterval(spawnInterval);
    gameOverOverlay.style.display = 'flex';
    actionButtons.innerHTML = ''; 

    gameMusic.pause();

    if (score >= targetWinScore) {
        statusText.innerText = "YEY! AYANG MENANG 🎉";
        statusText.style.color = "#2ecc71";
        prizeText.innerHTML = `Selamat sayang! Ayang berhasil mencapai target skor "1427" yang di tetapkan .<br>Silakan klik tombol di bawah untuk kembali dan memilih hadiah!`;
        
        const homeBtn = document.createElement('button');
        homeBtn.innerText = "Kembali ke Halaman Utama";
        homeBtn.className = "btn-home";
        homeBtn.onclick = () => {
            // REVISI: Mengirimkan parameter status=win agar index.html mendeteksi kemenangan
            window.location.href = "index.html?status=win";
        };
        actionButtons.appendChild(homeBtn);
    } else {
        statusText.innerText = "YAAH, KAMU GAGAL 😢";
        statusText.style.color = "#ff6b6b";
        prizeText.innerText = `Skor kamu belum cukup untuk mendapatkan hadiah. Jangan menyerah, ayo coba lagi sampai berhasil!`;
        
        const retryBtn = document.createElement('button');
        retryBtn.innerText = "Coba Lagi";
        retryBtn.onclick = resetGame;
        actionButtons.appendChild(retryBtn);
    }
}

function resetGame() { startGame(); }

function init() {}
function animate() {}

init(); animate();
