const canvas = document.getElementById('canvas1');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let ravens = [];
const boomGroups = [];
const canvasPosition = canvas.getBoundingClientRect();
class Raven {
	constructor() {		
		this.directionX = Math.random() * 5 + 1;
		this.directionY = Math.random() * 5  - 2.5;
		this.spriteWidth = 271;
		this.spriteHeight = 194;
		this.sizeModifier = Math.random() * 0.6 + 0.4;
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeight * this.sizeModifier;
		this.x = canvas.width;
		this.y = Math.random() * (canvas.height - this.height);
		this.markedForDeletion = false;
		this.image = new Image();
		this.image.src = 'raven.png';
		this.frame = 0;
		this.maxFrame = 4;
		this.timeSineFlap = 0;
		this.flapInterval = Math.random() * 50 + 50;
	}
	update(deltatime) {
		this.timer++;
		if(this.y < 0 || this.y > canvas.height - this.height ) {
			this.directionY = this.directionY * (-1)
		}
		this.x -= this.directionX;
		this.y -= this.directionY
		//this.angle += this.speedAngle;
		if(this.x < - this.width) {
			this.markedForDeletion = true;
		}
		this.timeSineFlap += deltatime;
		if(this.timeSineFlap > this.flapInterval) {
			if(this.frame > this.maxFrame) this.frame = 0;
			else this.frame++;
			this.timeSineFlap = 0;
		}
		
	}
	draw() {
		c.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
	}
}
class Boom {
	constructor(x, y) {
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.width = this.spriteWidth / 2;
		this.height = this.spriteHeight /2;
		this.x = x - this.width/2 ;
		this.y = y - this.width/2;
		this.frame = 0;
		this.timer = 0;
		this.image = new Image();
		this.image.src = 'boom.png';
	}
	update() {
		this.timer++;
		if(this.timer% 15 === 0) {
			this.frame++;
		}
		//this.frame++;
	}
	draw() {
		c.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
	}
}
window.addEventListener('click', function(e) {
	let positionX = e.x - canvasPosition.x;
	let positionY = e.y - canvasPosition.y;
	boomGroups.push(new Boom(positionX, positionY));
})
function animate(timestamp) {
	c.clearRect(0, 0, canvas.width, canvas.height);
	let deltatime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRaven += deltatime;
	if(timeToNextRaven > ravenInterval) {
		ravens.push(new Raven());
		timeToNextRaven = 0;
	}
	[...ravens].forEach(objects => objects.update(deltatime));
	[...ravens].forEach(objects => objects.draw());
	
	for(let i = 0; i < boomGroups.length; i++) {
		boomGroups[i].update();
		boomGroups[i].draw();
		ravens.forEach(objects =>  {
			if((boomGroups[i].x >= objects.x && boomGroups[i].x <= objects.x + objects.width) &&
				(boomGroups[i].y >= objects.y && boomGroups[i].y <= objects.y + objects.height)) {
				objects.markedForDeletion = true;
			}
		})
		if(boomGroups[i].frame > 5) {
			boomGroups.splice(i, 1);
			i--;
		}
	}
	ravens = ravens.filter(objects => !objects.markedForDeletion);
	requestAnimationFrame(animate);
}
animate(0);