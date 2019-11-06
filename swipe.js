export class swipe {
  constructor(el) {
    this.xDown = null;
    this.yDown = null;
    this.element = typeof(el) === 'string' ? document.body.getElementsByClassName(el)[0] : el;
    if (!this.element || !'ontouchstart' in document.documentElement) return;

    this.element.addEventListener('touchstart', (e) => {
      this.xDown = e.touches[0].clientX;
      this.yDown = e.touches[0].clientY;
    }, false);
  }

  left(cb) {
    if (!cb) return;
    this.left = cb;

    return this;
  }

  right(cb) {
    if (!cb) return;
    this.right = cb;

    return this;
  }

  up(cb) {
    if (!cb) return;
    this.up = cb;

    return this;
  }

  down(cb) {
    if (!cb) return;
    this.down = cb;

    return this;
  }

  handleTouchMove(e) {
    if (!this.xDown || !this.yDown) return;

    let xUp = e.touches[0].clientX,
      yUp = e.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        this.left();
      } else {
        this.right();
      }
    } else {
      if (this.yDiff > 0) {
        this.up();
      } else {
        this.down();
      }
    }

    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }

  run() {
    this.element.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, false);
  }
}
