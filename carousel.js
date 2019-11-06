import {swipe} from "./swipe";

export class carousel {
  constructor(el, col = 1, nav) {
    this.el = el;

    if (!this.setVars(col, nav)) return;
    this.setEvents();
  }

  setVars(col, nav) {
    let _this = this;

    _this.caro = this.el;
    if (!this.caro) return false;

    //_this.nav = nav || el.getElementsByClassName('arrows')[0] || document.body.getElementsByClassName('arrows')[0];
    _this.nav = nav || app.getElementsByClassName('arrows')[0];
    if (!this.nav) return false;

    _this.prev = this.nav.children[0];
    if (!this.prev) return false;

    _this.next = this.nav.children[1];
    if (!this.next) return false;

    this.lock = false;
    this.col = col;

    return true;
  }

  setEvents() {
    this.init();
    this.setNavigation();
    this.setSwipe();

    document.addEventListener('ref', () => {
      this.init();
      this.reset();
    });

    window.addEventListener('resize', () => {
      this.init();
      this.reset();
    })
  }

  setSwipe() {
    let dragev = new swipe(this.caro);

    dragev.left(prevSlide => {
      this.nav.children[1].click();
    });
    dragev.right(nextSlide => {
      this.nav.children[0].click();
    });
    dragev.run();
  }

  init() {
    let rwd = window.innerWidth;

    this.els = this.caro.querySelectorAll('.grid--col:not(.disabled)');
    if (!this.els.length) return false;

    this.i = 0;
    this.max = this.els.length;
    this.per = 5;

    if (rwd <= 1024) {
      this.per = 6;
    }

    if (rwd <= 500) {
      this.per = 4;
    }

    this.newCol = this.col;

    this.col >= 2 && this.max < this.per * this.col ? this.newCol = 1 : '';

    this.relW = this.caro.parentNode.offsetWidth;
    this.elW = this.relW / this.per;
    this.grid_size = this.per * this.newCol;

    this.max < this.grid_size ? this.next.style.display = 'none' : this.next.style.display = '';

    let i = 0, grid = '';
    for (i; i < this.max / this.newCol; i++) {
      grid += ` ${this.elW}px`;
    }

    TweenLite.set(this.caro, {gridTemplateColumns: grid, className: '-=flex flex-wrap'});

    setStyle(this.caro, {
      width: this.elW * this.els.length + 'px'
    });

    TweenLite.set(this.prev, {autoAlpha: 0});

    each(this.els, (key, val) => {
      val.style.width = this.elW + 'px';
    })
  }

  setNavigation() {
    this.prev.addEventListener('click', prev => {
      if (this.i <= 0 || this.lock) return;
      this.lock = true;
      this.i -= this.per;

      TweenLite.to(this.caro, 0.8, {
        x: `+=${this.elW * this.per}`, onComplete: () => {
          this.lock = false;
          if (this.i === 0) this.reset();
        }
      });
    });

    this.next.addEventListener('click', next => {
      if (this.lock) return;
      this.lock = true;
      this.i += this.per;

      if (this.i * this.newCol >= this.max) return this.reset();

      if (!this.prev.classList.contains('act')) TweenLite.to(this.prev, 0.2, {autoAlpha: 1, className: '+=act'});
      TweenLite.to(this.caro, 0.8, {
        x: `-=${this.i * this.col > this.max - this.per ? this.elW * 1 : this.elW * this.per}`, onComplete: () => {
          this.lock = false;
        }
      });
    })
  }

  reset() {
    this.i = 0;
    TweenLite.set(this.prev, {autoAlpha: 0, className: '-=act'});
    this.lock = false;
    TweenLite.set(this.caro, {x: 0});
  }
}
