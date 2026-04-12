const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const music = document.getElementById('music');
const typingEl = document.getElementById('typing-text');
const loginLayer = document.getElementById('login-layer');
const giftLayer = document.getElementById('gift-layer');
const mainLayer = document.getElementById('main-layer');
const feedback = document.getElementById('feedback-msg');
const waContainer = document.getElementById('wa-container');
const giftSection = document.getElementById('gift-question');
const gameTrigger = document.getElementById('game-trigger');
const btnLogin = document.getElementById('btn-login'); 

let selectedGift = "";
let particles = [];
let fireworks = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const selTgl = document.getElementById('sel-tgl');
const selBln = document.getElementById('sel-bln');
const selThn = document.getElementById('sel-thn');
const bulanNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

for(let i=1; i<=31; i++) selTgl.innerHTML += `<option value="${i<10?'0'+i:i}">${i}</option>`;
bulanNames.forEach((b, idx) => {
    let val = (idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1);
    selBln.innerHTML += `<option value="${val}">${b}</option>`;
});
for(let i=2015; i>=2000; i--) selThn.innerHTML += `<option value="${i}">${i}</option>`;

// Cek apakah baru saja menang game
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'win') {
        loginLayer.classList.add('hidden');
        mainLayer.classList.remove('hidden');
        typingEl.innerHTML = message; // Langsung tampilkan teks
        giftSection.classList.remove('hidden'); // Langsung buka menu hadiah
        music.play();
    }
};

function checkBirthday() {
    const fullDate = `${selTgl.value}/${selBln.value}/${selThn.value}`;
    if (["22/04/2008", "14/02/2007"].includes(fullDate)) {
        feedback.innerHTML = `<span class="happy">Akhirnya Ayang datang! Ayang memang milikku selamanya. Kalo Ayang mau hadiah dari aku silahkan klik lanjutkan....!</span>`;
        
        btnLogin.innerHTML = "Klik untuk Melanjutkan ✨";
        btnLogin.onclick = function() {
            music.play();
            loginLayer.classList.add('hidden');
            giftLayer.classList.remove('hidden');
        };
    } else {
        feedback.innerHTML = `<span class="sad">Maaf, sepertinya kamu bukan orang yang aku tunggu. 😭</span>`;
    }
}

class Particle {
    constructor(x, y, color, speedX, speedY) {
        this.x = x; this.y = y; this.color = color;
        this.speedX = speedX || Math.random() * 2 - 1;
        this.speedY = speedY || Math.random() * -0.5 - 0.2;
        this.size = Math.random() * 2 + 1;
        this.opacity = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.opacity > 0.01) this.opacity -= 0.01;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2);
    const colors = ['#ff477e', '#ff85a1', '#ffffff', '#ffd1dc'];
    for (let i = 0; i < 35; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const speedX = Math.random() * 6 - 3;
        const speedY = Math.random() * 6 - 3;
        fireworks.push(new Particle(x, y, color, speedX, speedY));
    }
}

function init() {
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, 'rgba(255, 133, 161, 0.6)'));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { 
        p.y += p.speedY;
        if (p.y < -10) p.y = canvas.height;
        p.draw(); 
    });
    fireworks.forEach((f, i) => { 
        f.update(); 
        f.draw(); 
        if (f.opacity <= 0.02) fireworks.splice(i, 1); 
    });
    requestAnimationFrame(animate);
}

const message = `💖 Barakallah fii umrik, Susi Aprilia 💖
Barakallah fii umrik ya, sayang 🤍

Hari ini hari spesial Ayang, dan aku cuma mau Ayang tahu kalau aku bener-bener bersyukur banget punya Ayang di hidupku.
Terima kasih sudah datang dan bertahan sejauh ini. Terima kasih buat semua perhatian kecil, semua cerita, semua tawa, dan bahkan semua ngambek Ayang yang kadang bikin aku geleng-geleng kepala tapi tetap kangen 😆. Ayang itu bukan cuma pacarku, tapi juga teman ngobrolku, tempat ceritaku, dan orang yang sering bikin mood aku balik lagi.
Di umur Ayang yang baru ini, aku harap Ayang makin bahagia, makin sehat, makin lancar semua urusannya, dan semua yang Ayang pengin bisa satu-satu tercapai. Kalau Ayang lagi capek, lagi sedih, atau lagi ngerasa sendirian, inget ya… Ayang selalu punya aku buat cerita, ngeluh, atau cuma buat ditemenin.
Aku mungkin belum sempurna dan kadang masih banyak kurangnya, tapi perasaanku ke Ayang serius. Aku sayang Ayang, aku peduli sama Ayang, dan aku pengin terus ada di samping Ayang, bukan cuma pas senang, tapi juga pas Ayang lagi butuh.
Pokoknya di hari spesial Ayang ini, aku doain yang terbaik buat Ayang.

Jangan lupa bahagia hari ini, jangan lupa senyum, dan jangan lupa juga… Ayang punya pacar yang siap bawel, perhatian, dan cemburu dikit kalau Ayang makin cantik 😌😆
Barakallah fii umrik, sayang 🤍

Semoga hari ini penuh senyum dan hal baik.
— @ekarmdni027 💫`;

window.openGift = function() {
    for(let i=0; i<8; i++) setTimeout(createFirework, i * 250);
    giftLayer.classList.add('hidden');
    setTimeout(() => {
        mainLayer.classList.remove('hidden');
        startTyping();
    }, 1500); 
};

function startTyping() {
    let idx = 0;
    function type() {
        if (idx < message.length) {
            typingEl.innerHTML += message.charAt(idx);
            idx++;
            const sc = document.querySelector('.scrollable-body');
            if(sc) sc.scrollTop = sc.scrollHeight;
            setTimeout(type, 35);
        } else {
            // Setelah teks selesai, tampilkan tombol game
            gameTrigger.classList.remove('hidden');
        }
    }
    type();
}

window.playGame = function() {
    window.location.href = "game.html";
};

window.selectGift = function(choice) {
    selectedGift = choice;
    document.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    waContainer.classList.remove('hidden');
    const scrollContainer = document.querySelector('.scrollable-body');
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
};

window.sendWhatsApp = function() {
    const text = `Haii Sayang, makasih ya buat ucapannya! Aku juga sayang banget sama Ayang ❤️. Untuk hadiahnya, aku pilih mau ke *${selectedGift}* aja deh! ✨`;
    window.open("https://wa.me/6283142479937?text=" + encodeURIComponent(text), '_blank');
};

init(); animate();