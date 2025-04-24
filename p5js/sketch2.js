let stars = [];
let shootingStars = [];
let cursorStars = []; // New: Stores stars that follow the cursor
let starColors;

function setup() {
  // Get the about section dimensions and create canvas
  const aboutSection = document.getElementById('about');
  let canvas = createCanvas(aboutSection.offsetWidth, aboutSection.offsetHeight);
  canvas.parent('about-sketch'); // Place canvas in the container
  canvas.position(0, 0);
  canvas.style('z-index', '0'); // Position behind content
  
  // Define star colors (white, pink, cyan)
  starColors = [
    color(255, 255, 255),   // White
    color(255, 204, 228),   // Light Pink
    color(204, 252, 255)    // Soft Cyan
  ];
  generateStars();
}

function draw() {
  drawGradient();
  
  for (let star of stars) {
    star.update();
    star.show();
  }

  // Handle shooting stars
  if (random() < 0.01) {
    shootingStars.push(new ShootingStar());
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    s.update();
    s.show();
    if (s.isFaded()) {
      shootingStars.splice(i, 1);
    }
  }

  // Draw cursor stars
  for (let i = cursorStars.length - 1; i >= 0; i--) {
    let cs = cursorStars[i];
    cs.update();
    cs.show();
    if (cs.isFaded()) {
      cursorStars.splice(i, 1);
    }
  }
}

// Faster gradient using rect()
function drawGradient() {
  let topColor = color(20, 0, 40);
  let bottomColor = color(80, 0, 120);
  setGradient(0, 0, width, height, topColor, bottomColor);
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    stroke(lerpColor(c1, c2, inter));
    line(x, i, x + w, i);
  }
}

// Generate stars without excessive object recreation
function generateStars() {
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push(new Star(random(width), random(height)));
  }
}

// Adjust stars' positions on resize instead of regenerating them
function windowResized() {
  let oldWidth = width;
  let oldHeight = height;
  
  resizeCanvas(windowWidth, windowHeight);
  
  let widthRatio = windowWidth / oldWidth;
  let heightRatio = windowHeight / oldHeight;

  // Scale existing stars to maintain relative positions
  for (let star of stars) {
    star.x *= widthRatio;
    star.y *= heightRatio;
  }
}

// Mouse creates stars that fade out
function mouseMoved() {
  cursorStars.push(new CursorStar(mouseX, mouseY));

  // Limit to 100 cursor stars to prevent lag
  if (cursorStars.length > 100) {
    cursorStars.splice(0, cursorStars.length - 100);
  }
}

// Star class with smooth twinkling
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.isBig = random() < 0.2;
    if (this.isBig) this.size = random(2, 5);
    this.brightness = random(100, 205);
    this.blinkSpeed = random(0.02, 0.05);
    this.noiseOffset = random(10);
    this.color = random(starColors);
  }

  update() {
    let twinkle = noise(this.noiseOffset + frameCount * 0.1);
    this.brightness = map(twinkle, 0, 1, 100, 205);
    if (this.isBig) {
      this.brightness = 100 + sin(frameCount * this.blinkSpeed) * 100;
    }
  }

  show() {
    noStroke();
    if (this.isBig) {
      drawingContext.shadowBlur = this.size;
      drawingContext.shadowColor = color(red(this.color), green(this.color), blue(this.color), this.brightness);
    } else {
      drawingContext.shadowBlur = 0;
    }
    fill(red(this.color), green(this.color), blue(this.color), this.brightness);
    ellipse(this.x, this.y, this.size);
  }
}

// Shooting Star class with fade-out effect
class ShootingStar {
  constructor() {
    this.x = random(width);
    this.y = random(height / 2);
    this.speedX = random(5, 10);
    this.speedY = random(3, 7);
    this.alpha = 255;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 5;
  }

  show() {
    stroke(255, this.alpha);
    strokeWeight(2);
    line(this.x, this.y, this.x - this.speedX * 5, this.y - this.speedY * 5);
  }

  isFaded() {
    return this.alpha <= 0;
  }
}

// Cursor Star class (new)
class CursorStar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 4);
    this.brightness = random(108, 205);
    this.color = random(starColors);
    this.velocityX = random(-1, 1); // Adds subtle movement
    this.velocityY = random(-1, 1);
    this.alpha = 205; // For fade-out effect
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.alpha -= 3; // Slowly fade out
  }

  show() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isFaded() {
    return this.alpha <= 3;
  }
}


