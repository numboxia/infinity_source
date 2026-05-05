const canvas = document.getELementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let powerStrips = [];
let cables = [];
let currentLEvel = 0;
let isDragging = false;



function update(){
	
}

function draw(){

}

function gameLoop(){

}

canvas.addEventListener('mousedown', (e) => {
	const x = (e.clientX - rect.left) * (canvas.width / rect.width);
	const y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('mouseup', (e) => {
	const x = (e.clientX - rect.left) * (canvas.width / rect.width);
	const y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('mousemove' (e) => {
	const x = (e.clientX - rect.left) * (canvas.width / rect.width);
	const y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
