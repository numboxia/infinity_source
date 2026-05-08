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
		strip.previousColor = strip.currentColor;
		if(strip.type !== 'source'){
			strip.currentColor = COLORS.NONE;
			strip.incomingColors = [];
			strip.isSelfSustaining = false;
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

	let potentialLoopStrips = powerStrips.filter(strip =>
		strip.type !== 'source' &&
		strip.currentColor === COLORS.NONE &&
		strip.previousColor !== COLORS.NONE
	);

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

	for(let strip of potentialLoopStrips){
		if(!strip.isSelfSustaining && findCycle(strip, strip, [])){
			strip.currentColor = strip.previousColor;
			strip.isSelfSustaining = true;




		}
	}
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 5;
	cables.forEach(cable => {
		ctx.strokeStyle = cable.color === COLORS.NONE ? '#555555' : '#' + cable.color.toString(16).padStart(6, '0');

		ctx.beginPath();
		ctx.moveTo(cable.startSocket.x, cable.startSocket.y);

		if(cable.endSocket){
			ctx.lineTo(cable.endSocket.x, cable.endSocket.y);
		}
		else{
			ctx.lineTo(cable.dragX, cable.dragY);
		}
		ctx.stroke();
	});

	powerStrips.forEach(strip => {
		ctx.fillStyle = strip.type === 'source' ? '#333333' : '#8B5A2B'; // renk ayarlama kısımlarını sonra kontrol et
		ctx.fillRect(strip.x, strip.y, strip.width, strip.height);

		ctx.fillStyle = strip.currentColor === COLORS.NONE ? '#999999' : '#' + strip.currentColor.toString(16).padStart(6, '0');
		ctx.fillRect(strip.x + strip.width - 40, strip.y + 10, 30, strip.height - 20);

		strip.sockets.forEach(socket => {
			ctx.fillStyle = '#FFFFFF';
			ctx.beginPath();
			ctx.arc(socket.x, socket.y, socket.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = 2;
			ctx.stroke();
		});
		
	});
}

function gameLoop(){
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousedown', (e) => {
	const pos = getMousePos(e);
	const clickedSocket = getClickedSocket(pos.x, pos.y);

	if(clickedSocket){
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

		if(droppedSocket && droppedSocket !== currentDragCable.startSocket){
			const dx = droppedSocket.x - currentDragCable.startSocket.x;
			const dy = droppedSocket.y - currentDragCable.startSocket.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			const isTargetSource = droppedSocket.parentStrip.type ==='source';

			if(distance <= currentDragCable.lengthLimit && !isTargetSource){
				currentDragCable.endSocket = droppedSocket;
				currentDragCable.startSocket.connection = currentDragCable;
				droppedSocket.connection = currentDragCable;
			}
			else{
				cables = cables.filter(cable => cable !== currentDragCable);
			}
		}
		else{
			cables = cables.filter(cable => cable !== currentDragCable);
		}
		isDragging = false;
		currentDragCable = null;
	}
});

canvas.addEventListener('mousemove', (e) => {
	if(isDragging && currentDragCable){
		const pos = getMousePos(e);
		currentDragCable.dragX = pos.x;
		currentDragCable.dragY = pos.y;
	}
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
