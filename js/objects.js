class PowerStrip{
	constructor(x, y, width, height, type, sockets, expectedColor, currentColor, isSelfSustaining){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.sockets = sockets;
		this.expectedColor = expectedColor;
		this.currentColor = currentColor;
		this.isSelfSustaining = isSelfSustaining;
	}
}

class Socket{
	constructor(parentStrip, x, y, radius, connection, type){
		this.parentStrip = parentStrip;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.connection = connection;
		this.type = type;
	}
}

class Cable{
	constructor(startSocket, endSocket, color, lenghtLimit){
		this.startSocket = startSocket;
		this.endSocket = endSocket;
		this.color = color;
		this.lenghtLimit = lenghtLimit;

		this.dragX = startSocket.x;
		this.dragY = startSocket.y;
	}
}
