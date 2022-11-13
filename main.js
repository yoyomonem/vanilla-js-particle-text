const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 0;
let adjustY = -10;
// Handle the mouse's movement
const cursor = {
  x: null,
  y: null,
  radius: 50
};
window.addEventListener("mousemove", e => {
  cursor.x = e.x;
  cursor.y = e.y;
});
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("JS", 0, 40);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);
/**
 * This class creates a particle using circles from the 2D context (constant variable "ctx") of the "canvas" HTML element when you use the Particle.draw() method.
 * @param x A numeric expression.
 * @param y A numeric expression.
*/
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 150) + 1;
  }
  /**
   * This method creates a particle using the ctx.arc([X value goes here], [Y value goes here], [radius (mostly known as size) goes here], [starting angle goes here], [ending angle goes here]) method (these 4 parameters are required for the ctx.arc method).
   */
  draw() {
    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  /**
   * This method makes the particles go away from the cursor once the distance is more than the cursor's radius; otherwise, the particles go back to their original position.
   */
  update() {
    let dx = cursor.x - this.x;
    let dy = cursor.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = cursor.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < cursor.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}
/**
 * This method initializes the particles, empties the particle array (array "particleArray") and creates particles.
 * @deprecated
 * Marked as deprecated because cannot find a longer description.
 */
function init() {
  particleArray = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 20, positionY * 20));
      }
    }
  }
}
init();
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();
/**
 * This method connects the particles using lines that fade in once they are CLOSE ENOUGH to the particle; otherwise, the lines get disconnected from the particles and fade away.
 */
function connect() {
  let opacity = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      opacity = 1 - (distance / 50);
      ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
      if (distance < 150) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
      if (distance < cursor.radius) {
        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
      }
    }
  }
}
