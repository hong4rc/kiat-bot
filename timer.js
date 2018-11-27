'use strict';

const min2Sec = 60;
const myTimezoneOffset = -420;
const lDisplay = 2;

let now;
let nextSeconds;

const getTime = () => `${now.getHours().toString().padStart(lDisplay, '0')}:${now.getMinutes().toString().padStart(lDisplay, '0')}`;
const getNext = () => nextSeconds;
const tick = () => {
    now = new Date();
    nextSeconds = min2Sec - now.getSeconds();
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset() - myTimezoneOffset);
};

module.exports = {
    getTime,
    getNext,
    tick,
};
