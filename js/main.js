const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const COLORS = {
        NONE:  0x000000,
        RED:   0xFF0000,
        GREEN: 0x00FF00,
        BLUE:  0x0000FF
};

// arayüz ve ses elementleri tanımlanıyor
const mainMenu = document.getElementById('mainMenu');
const startBtn = document.getElementById('startBtn');
const transitionScreen = document.getElementById('transitionScreen');
const levelText = document.getElementById('levelText');
const victoryScreen = document.getElementById('victoryScreen');
const restartBtn = document.getElementById('restartBtn');
const spriteCache = {};

// Ses Dosyaları
const sfx = new Audio('assets/sounds/plug-in_plug-out.mp3');
const backgroundMusic = new Audio('assets/sounds/background_music_8bit.mp3');
const gameSuccess = new Audio('assets/sounds/dudududududuuu.mp3');

backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

// küresel oyun değişkenleri
let powerStrips = [];       // Ekrandaki tüm prizleri tutar
let cables = [];            // Ekrandaki tüm kabloları tutar
let currentLevel = 0;       // Mevcut bölüm indeksi
let isDragging = false;     // Kullanıcı kablo çekip çekmemesi durumu
let currentDragCable = null;// O an çekilen kablonun referansı
let gameState = 'menu';     // Oyunun durumu: 'menu', 'playing', 'transition', 'gameover'

// Tek bir ses dosyasının belirli saniyelerini çalmak için yardımcı fonksiyon
function playSfx(startTime, durationInSeconds){
        sfx.pause();
        sfx.currentTime = startTime;
        sfx.play();

        setTimeout(() => {
                sfx.pause();
        }, durationInSeconds * 1000);
}

// Ana oyun döngüsü
function update(){
        // Her karenin (frame) başında prizlerin anlık enerjilerini sıfırla
        // Geçmiş rengi (previousColor) hafızada tutuyoruz ki sonsuz enerji kuralını işletebilelim
        powerStrips.forEach(strip => {
                strip.previousColor = strip.currentColor;
                if(strip.type !== 'source'){
                        strip.currentColor = COLORS.NONE;
                        strip.incomingColors = [];
                        strip.isSelfSustaining = false;
                }
        });

        cables.forEach(cable => {
                cable.color = COLORS.NONE;
        });

        // Sabit kaynak prizlerinin enerjisini ağa yayıyoruz (BFS - Breadth First Seach)
        let queue = powerStrips.filter(strip => strip.type === 'source'); 
        
        while(queue.length > 0){
                let currentStrip = queue.shift();

                for(let socket of currentStrip.sockets){
                        // Sadece kablonun başladığı soketten çıkan gücü ilet
                        if(socket.connection && socket.connection.startSocket === socket && socket.connection.endSocket){
                                let cable = socket.connection;
                                let targetStrip = cable.endSocket.parentStrip;
                                let powerColor = currentStrip.currentColor;

                                // Kabloya anlık akımın rengini ver
                                cable.color |= powerColor;

                                if(targetStrip.type !== 'source'){
                                        let previousColor = targetStrip.currentColor;
                                        // Gelen enerjiyi hedef prizin mevcut enerjisiyle harmanla (Bitwise OR)
                                        targetStrip.currentColor |= powerColor;

                                        // Eğer prize yeni bir renk eklendiyse, o da bu gücü yaymak için kuyruğa girer
                                        if(previousColor !== targetStrip.currentColor){
                                                queue.push(targetStrip);
                                        }
                                }
                        }
                }
        }

        // Sonsuz döngü tespiti
        // Bir prizin döngü kontrolüne girmesi için geçen frame'de enerjiye sahip olması yeterlidir.
        let potentialLoopStrips = powerStrips.filter(strip =>
                strip.type !== 'source' &&
                strip.previousColor !== COLORS.NONE
        );

        // Derinlik Öncelikli Arama (DFS - Depth First Search) ile kablolar takip edilerek kapalı bir devre (döngü) aranır
        function findCycle(startStrip, currentStrip, visited){
                if(visited.includes(currentStrip)){
                        return currentStrip === startStrip;
                }

                visited.push(currentStrip);

                for(let socket of currentStrip.sockets){
                        if(socket.connection && socket.connection.startSocket === socket && socket.connection.endSocket){
                                let nextStrip = socket.connection.endSocket.parentStrip;

                                if(findCycle(startStrip, nextStrip, [...visited])){
                                        return true;
                                }
                        }
                }
                return false;
        }

        let loopQueue = [];

        for(let strip of potentialLoopStrips){
                if(!strip.isSelfSustaining && findCycle(strip, strip, [])){
                        // DÖngü bulunursa prizin geçmişteki rengi ile dışarıdan gelen anlık rengini birleştir.
                        // (Misal kırmızı sonsuz döngüye dışarıdan mavi bağlanırsa, o döngü artık sonsuza kadar mor kalır).
                        strip.currentColor |= strip.previousColor;
                        
                        strip.isSelfSustaining = true;
                        loopQueue.push(strip);
                }
        }

        // Döngülerde oluşan bu kalıcı enerjiyi sisteme geri yay
        while(loopQueue.length > 0){
                let currentStrip = loopQueue.shift();

                for(let socket of currentStrip.sockets){
                        if(socket.connection && socket.connection.startSocket === socket && socket.connection.endSocket){
                                let cable = socket.connection;
                                let targetStrip = cable.endSocket.parentStrip;
                                let powerColor = currentStrip.currentColor;

                                cable.color |= powerColor;

                                if(targetStrip.type !== 'source'){
                                        let previousColor = targetStrip.currentColor;
                                        targetStrip.currentColor |= powerColor;
                                        targetStrip.isSelfSustaining = true;

                                        if(previousColor !== targetStrip.currentColor){
                                                loopQueue.push(targetStrip);
                                        }
                                }
                        }
                }
        }

        // Kazanma ve bölüm geçiş kontrolü
        if(gameState === 'playing' && powerStrips.length > 0 && checkWinCondition()){
                gameState = 'transition'; // Arka plandaki etkileşimleri dondur
                    
                let nextLevelIndex = currentLevel + 1;
                backgroundMusic.volume = 0.1; 

                if(!GAME_LEVELS[nextLevelIndex]){
                        // Oyun tamamen bittiyse
                        setTimeout(() => {
                                gameState = 'gameover';
                                victoryScreen.classList.remove('hidden');
                                backgroundMusic.pause();
                                backgroundMusic.currentTime = 0;
                                gameSuccess.play();
                        }, 500);
                }
                else{
                        // Sıradaki bölüm varsa geçiş ekranını (Fade In/Out) başlat
                        currentLevel++;
                        levelText.innerText = 'Part ' + (currentLevel + 1);
                        transitionScreen.classList.remove('hidden');

                        setTimeout(() => {
                                loadLevel(currentLevel);
                                transitionScreen.classList.add('hidden');

                                setTimeout(() => {
                                        gameState = 'playing';
                                        backgroundMusic.volume = 0.5;
                                }, 500);
                        }, 1000);
                }
        }
}

// Oyunun kazanılıp kazanılmadığını denetler
function checkWinCondition(){
        // Ana kaynakların tüm yuvaları boş olmalıdır (Fişler çekilmiş olmalı)
        const sources = powerStrips.filter(strip => strip.type ==='source');
        for(let source of sources){
                for(let socket of source.sockets){
                        if(socket.connection !== null){
                                return false; // Eğer kaynakta dolu bir priz varsa kazanmayı engelle
                        }
                }
        }

        // Normal prizlerin tamamı istenen enerjiyle dolmuş olmalı
        const strips = powerStrips.filter(strip => strip.type !== 'source');
        for(let strip of strips){
                if(strip.currentColor === COLORS.NONE){
                        return false; // Enerjisiz priz kaldıysa oyun bitmez
                }
                if(strip.expectedColor !== COLORS.NONE && strip.currentColor !== strip.expectedColor){
                        return false; // Beklenen renk ile prize gelen renk uyuşmazsa oyun bitmez
                }
        }
        return true; // Tüm testler geçildiyse bölüm kazanılmıştır!
}

// levels.js'den gelen verilerle sahneyi oluşturur
function loadLevel(levelIndex){
        powerStrips = [];
        cables = [];
        currentDragCable = null;
        isDragging = false;

        const levelData = GAME_LEVELS[levelIndex];

        if(!levelData){
                console.log("Tebrikler! Oyunu bitirdiniz!");
                return;
        }
        
        levelData.strips.forEach(stripData => {
                let startColor = stripData.type === 'source' ? stripData.color : COLORS.NONE;
                let newStrip = new PowerStrip(
                        stripData.x,
                        stripData.y,
                        stripData.width,
                        stripData.height,
                        stripData.type,
                        [], 
                        stripData.expectedColor,
                        startColor,
                        false
                );

                // Prizin soketlerini koordinatlarına göre oluştur
                stripData.sockets.forEach(sockData => {
                        let socketX = newStrip.x + sockData.offsetX;
                        let socketY = newStrip.y + sockData.offsetY;
                        let newSocket = new Socket(newStrip, socketX, socketY, 15, null, 'bidirectional');

                        newStrip.sockets.push(newSocket);
                });

                powerStrips.push(newStrip);
        });
}

// Ekrana nesneleri çizer 
function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        powerStrips.forEach(strip => {
                let colorKey = strip.type === 'source' ? strip.currentColor : strip.expectedColor;
                let colorStr = 'gray'; 
                
                if(colorKey === COLORS.RED) colorStr = 'red';
                else if(colorKey === COLORS.GREEN) colorStr = 'green';
                else if(colorKey === COLORS.BLUE) colorStr = 'blue';
                else if(colorKey === 0xFF00FF) colorStr = 'purple';
                else if(colorKey === 0xFFFFFF) colorStr = 'white'; 

                let spriteName = '';
                let isHorizontal = strip.width > strip.height;

                if(strip.type === 'source'){
                        spriteName = colorStr + '_source'; 
                }
                else{
                        let count = strip.sockets.length;
                        
                        if(count === 1){
                                spriteName = colorStr + '_solo';
                        }
                        else if(count === 2){
                                spriteName = colorStr + '_double_' + (isHorizontal ? 'horizontal' : 'vertical');
                        }
                        else{
                                // 3'lü (veya fazlası) priz için
                                spriteName = colorStr + '_triple_' + (isHorizontal ? 'horizontal' : 'vertical');
                        }
                }

                let img = getSprite(spriteName);

                // Normal prizler için LED arka planını çiz
                // (Kaynak prizlerinin rengi kendi üstlerinde çizili olduğu için onlara es geçiyoruz)
                if(strip.type !== 'source') {
                        ctx.fillStyle = strip.currentColor === COLORS.NONE ? '#444444' : '#' + strip.currentColor.toString(16).padStart(6, '0');
                        
                        if(isHorizontal){
                                // Yatay prizlerin en sağ tarafındaki LED boşluğu
                                ctx.fillRect(strip.x + strip.width - 80, strip.y + 10, 70, strip.height - 20);
                        }
                        else{
                                // Dikey prizlerin en alt tarafındaki LED boşluğu
                                ctx.fillRect(strip.x + 10, strip.y + strip.height - 80, strip.width - 20, 70);
                        }
                }

                // 3. Sprite'ı çiz
                if(img.complete && img.naturalWidth !== 0){
                        ctx.drawImage(img, strip.x, strip.y, strip.width, strip.height);
                }
        });

        // Kabloları çiz
        ctx.lineWidth = 5;
        cables.forEach(cable => {
                ctx.strokeStyle = cable.color === COLORS.NONE ? '#555555' : '#' + cable.color.toString(16).padStart(6, '0');

                ctx.beginPath();
                ctx.moveTo(cable.startSocket.x, cable.startSocket.y);

                if(cable.endSocket){
                        ctx.lineTo(cable.endSocket.x, cable.endSocket.y); // Bağlı kablo
                }
                else{
                        ctx.lineTo(cable.dragX, cable.dragY); // Sürüklenen (havadaki) kablo
                }
                ctx.stroke();
        });
}

// 60 fps çalışan ana oyun döngüsü
function gameLoop(){
        update();
        draw();
        requestAnimationFrame(gameLoop);
}

// Fare olayları

canvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(e);
        const clickedSocket = getClickedSocket(pos.x, pos.y);

        if(clickedSocket){
                // Eğer tıklanan yuvada zaten bir kablo varsa o kabloyu sil (Unplug)
                if(clickedSocket.connection){
                        playSfx(3.45, 1.0); // Fişten çekme efekti

                        let oldCable = clickedSocket.connection;
                        cables = cables.filter(cable => cable !== oldCable);
                        if(oldCable.startSocket){
                                oldCable.startSocket.connection = null;
                        }
                        if(oldCable.endSocket){
                                oldCable.endSocket.connection = null;
                        }
                        return; // Yeni kablo oluşturmamak için işlemi burada kes
                }

                // Yuvada kablo yoksa yeni kablo sürüklemeyi başlat
                isDragging = true;
                currentDragCable = new Cable(clickedSocket);
                currentDragCable.dragX = pos.x;
                currentDragCable.dragY = pos.y;
                cables.push(currentDragCable);
        }
});

canvas.addEventListener('mouseup', (e) => {
        if(isDragging && currentDragCable){
                const pos = getMousePos(e);
                const droppedSocket = getClickedSocket(pos.x, pos.y);

                // Eğer kablo geçerli ve boş bir yuvaya bırakıldıysa
                if(droppedSocket && droppedSocket !== currentDragCable.startSocket){
                        const dx = droppedSocket.x - currentDragCable.startSocket.x;
                        const dy = droppedSocket.y - currentDragCable.startSocket.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        const isTargetSource = droppedSocket.parentStrip.type ==='source';

                        // Kablo uzunluğu yetiyorsa ve hedef priz bir kaynak değilse bağla
                        if(distance <= currentDragCable.lengthLimit && !isTargetSource){
                                currentDragCable.endSocket = droppedSocket;
                                currentDragCable.startSocket.connection = currentDragCable;
                                droppedSocket.connection = currentDragCable;

                                playSfx(2.4, 0.1); // Başarılı takılma efekti
                        }
                        else{
                                // Kural dışıysa kabloyu yok et
                                cables = cables.filter(cable => cable !== currentDragCable);
                        }
                }
                else{
                        // Boşluğa bırakıldıysa kabloyu yok et
                        cables = cables.filter(cable => cable !== currentDragCable);
                }
                isDragging = false;
                currentDragCable = null;
        }
});

canvas.addEventListener('mousemove', (e) => {
        // Fare hareket ettikçe sürüklenen kablonun ucunu fareye bağla
        if(isDragging && currentDragCable){
                const pos = getMousePos(e);
                currentDragCable.dragX = pos.x;
                currentDragCable.dragY = pos.y;
        }
});

// Menü ve buton etkileşimleri
startBtn.addEventListener('click', () =>{
        mainMenu.classList.add('hidden');
        gameState = 'playing';
        backgroundMusic.play();
});

transitionScreen.classList.add('hidden'); // Sayfa ilk yüklendiğinde geçiş ekranını sakla

restartBtn.addEventListener('click', () => {
        victoryScreen.classList.add('hidden'); 
        currentLevel = 0; 
        loadLevel(currentLevel); 
        gameState = 'playing'; 
        
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
});

// Yardımcı fonksiyonlar

// Tuval boyutlarına göre gerçek fare koordinatlarını hesaplar
function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height) 
        };
}

// Tıklanan koordinatların herhangi bir yuvanın (soket) içine denk gelip gelmediğini bulur
function getClickedSocket(mouseX, mouseY){
        for(let strip of powerStrips){
                for(let socket of strip.sockets){
                        const dx = mouseX - socket.x;
                        const dy = mouseY - socket.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // Farenin tıklandığı yer ile yuva merkezi arasındaki mesafe yarıçaptan küçükse isabettir
                        if(distance <= socket.radius){
                                return socket;
                        }
                }
        }
        return null;
}

function getSprite(name) {
        if(!spriteCache[name]){
                spriteCache[name] = new Image();
                spriteCache[name].src = 'assets/sprites/' + name + '.png'; 
        }
        return spriteCache[name];
}

// Oyunu ayağa kaldır
loadLevel(currentLevel);
gameLoop();
