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

let powerStrips = [];
let cables = [];
let currentLevel = 0;
let isDragging = false;
let currentDragCable = null;



function update(){
	powerStrips.forEach(strip => {
		if(strip.type !== 'source'){
			strip.currentColor = COLORS.NONE;
			strip.incomingColors = [];
		}
	});

	cables.forEach(cable => {
		cable.color = 'none';
	});

	let queue = powerStrips.filter(strip => strip.type === 'source'); 
	
	while(queue.length > 0){
		let currentStrip = queue.shift();

		for(let socket of currentStrip.sockets){
			if(socket.connection && socket.connection.startSocket === socket && socket.connection.endSocket){
				let cable = socket.connection;
				let targetStrip = cable.endSocket.parentStrip;
				let powerColor = currentStrip.currentColor;

				cable.color = powerColor;

				if(targetStrip.type !== 'source'){
					let previousColor = targetStrip.currentColor;
					targetStrip.currentColor |= powerColor;

					if(previousColor !== targetStrip.currentColor){
						queue.push(targetStrip);
					}
				}
			}
		}
	}
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(){
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousedown', (e) => {

});

canvas.addEventListener('mouseup', (e) => {
	if(isDragging && currentDragCable){
		const pos = getMousePos(e);
		const droppedSocket = getClickedSocket(pos.x, pos.y);

		if(droppedSocket && droppedSocket !== currentDragCable.startSocket){
			currentDragCable.endSocket = droppedSocket;

			currentDragCable.startSocket.connection = currentDragCable;
			droppedSocket.connection = currentDragCable;
		}
		else{
			cables = cables.filter(cable => cable !== currentDragCable);
		}
		isDragging = false;
		currentDragCable = null;
	}
});

canvas.addEventListener('mousemove', (e) => {

});

function getMousePos(e) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: (e.clientX - rect.left) * (canvas.width / rect.width),
		y: (e.clientY - rect.top) * (canvas.height / rect.height) 
	};
}

function getClickedSocket(mouseX, mouseY){
	for(let strip of powerStrips){
		for(let socket of strip.sockets){
			const dx = mouseX - socket.x;
			const dy = mouseY - socket.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if(distance <= socket.radius){
				return socket;
			}
		}
	}
	return null;
}

gameLoop();
