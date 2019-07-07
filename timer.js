const min2Sec = 60;
const lDisplay = 2;

module.exports = class Timer {
  constructor(tick) {
    this.tick = tick;
  }

  next() {
    const now = new Date();
    const n = Number(now);
    this.tick(now);
    return now - n;
  }

  static offset(timezone = 7) {
    const now = new Date();
    const newDate = new Date(now);
    newDate.setMinutes(now.getTimezoneOffset() + min2Sec * timezone);
    return `${now.getHours().toString().padStart(lDisplay, '0')}:${now.getMinutes().toString().padStart(lDisplay, '0')}`;
  }
};
