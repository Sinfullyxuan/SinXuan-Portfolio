const homeSketch = (p) => {
  let stars = [];
  let shootingStars = [];
  let cursorStars = [];
  let starColors;

  p.setup = () => {
    const homeSection = document.getElementById('home');
    let canvas = p.createCanvas(homeSection.offsetWidth, homeSection.offsetHeight);
    canvas.parent('p5-sketch');
    canvas.position(0, 0);
    canvas.style('z-index', '0');
    canvas.style('position', 'absolute');

    starColors = [
      p.color(255, 255, 255),
      p.color(255, 204, 228),
      p.color(204, 252, 255)
    ];
    generateStars();
  };

  p.draw = () => {
    drawGradient();

    for (let star of stars) {
      star.update();
      star.show();
    }

    if (p.random() < 0.01) {
      shootingStars.push(new ShootingStar());
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      let s = shootingStars[i];
      s.update();
      s.show();
      if (s.isFaded()) shootingStars.splice(i, 1);
    }

    for (let i = cursorStars.length - 1; i >= 0; i--) {
      let cs = cursorStars[i];
      cs.update();
      cs.show();
      if (cs.isFaded()) cursorStars.splice(i, 1);
    }
  };

  function drawGradient() {
    let topColor = p.color(9, 0, 18);
    let bottomColor = p.color(20, 0, 40);
    setGradient(0, 0, p.width, p.height, topColor, bottomColor);
  }

  function setGradient(x, y, w, h, c1, c2) {
    p.noFill();
    for (let i = y; i <= y + h; i++) {
      let inter = p.map(i, y, y + h, 0, 1);
      p.stroke(p.lerpColor(c1, c2, inter));
      p.line(x, i, x + w, i);
    }
  }

  function generateStars() {
    stars = [];
    for (let i = 0; i < 300; i++) {
      stars.push(new Star(p.random(p.width), p.random(p.height)));
    }
  }

  p.windowResized = () => {
    const homeSection = document.getElementById('home');
    let oldWidth = p.width;
    let oldHeight = p.height;
    p.resizeCanvas(homeSection.offsetWidth, homeSection.offsetHeight);

    let widthRatio = p.width / oldWidth;
    let heightRatio = p.height / oldHeight;

    for (let star of stars) {
      star.x *= widthRatio;
      star.y *= heightRatio;
    }
  };

  p.mouseMoved = () => {
    cursorStars.push(new CursorStar(p.mouseX, p.mouseY));
    if (cursorStars.length > 100) {
      cursorStars.splice(0, cursorStars.length - 100);
    }
  };

  // Star Classes
  class Star {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = p.random(1, 3);
      this.isBig = p.random() < 0.2;
      if (this.isBig) this.size = p.random(2, 5);
      this.brightness = p.random(100, 205);
      this.blinkSpeed = p.random(0.02, 0.05);
      this.noiseOffset = p.random(10);
      this.color = p.random(starColors);
    }

    update() {
      let twinkle = p.noise(this.noiseOffset + p.frameCount * 0.1);
      this.brightness = p.map(twinkle, 0, 1, 100, 205);
      if (this.isBig) {
        this.brightness = 100 + p.sin(p.frameCount * this.blinkSpeed) * 100;
      }
    }

    show() {
      p.push(); // isolate glow
      p.noStroke();
      if (this.isBig) {
        p.drawingContext.shadowBlur = this.size;
        p.drawingContext.shadowColor = p.color(
          p.red(this.color),
          p.green(this.color),
          p.blue(this.color),
          this.brightness
        );
      } else {
        p.drawingContext.shadowBlur = 0;
      }
      p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), this.brightness);
      p.ellipse(this.x, this.y, this.size);
      p.pop(); // restore context
    }
  }

  class ShootingStar {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.random(p.height / 2);
      this.speedX = p.random(5, 10);
      this.speedY = p.random(3, 7);
      this.alpha = 255;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 5;
    }

    show() {
      p.stroke(255, this.alpha);
      p.strokeWeight(2);
      p.line(this.x, this.y, this.x - this.speedX * 5, this.y - this.speedY * 5);
    }

    isFaded() {
      return this.alpha <= 0;
    }
  }

  class CursorStar {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = p.random(1, 4);
      this.brightness = p.random(108, 205);
      this.color = p.random(starColors);
      this.velocityX = p.random(-1, 1);
      this.velocityY = p.random(-1, 1);
      this.alpha = 205;
    }

    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.alpha -= 3;
    }

    show() {
      p.noStroke();
      p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), this.alpha);
      p.ellipse(this.x, this.y, this.size);
    }

    isFaded() {
      return this.alpha <= 3;
    }
  }
};

// Initialize the home sketch
new p5(homeSketch);
