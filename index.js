'use strict';
const log = require('kiat-log');
const Facebook = require('node-facebook');
const chat = require('./chat');

const timer = require('./timer');
const milis = 1000;
const delta = 5;

// let user = {email: 'your username/id', pass: 'your pass'};

const state = JSON.parse(process.env.user);

const me = new Facebook({state});
(async user => {
    const api = await user.login();
    api.listen();

    let nextSeconds;
    const timerBio = () => {
        timer.tick();
        nextSeconds = timer.getNext();
        api.changeBio(`${timer.getTime()}\nNước sông chảy cạn,\ncá tự bơi đi chỗ khác.....,`, nextSeconds + delta)
            .then(() => setTimeout(timerBio, nextSeconds * milis));
    };
    timerBio();

    api.on('presence', msg => {
        log.info(msg.userId, msg.statUser ? 'online' : 'idle');
    });
    api.on('typ', msg => {
        api.sendTyping(msg.from, msg.isTyping);
        log.info(`${msg.from} is ${msg.isTyping ? '' : 'not'} typing.`);
    });
    api.on('msg', async msg => {
        api.markAsRead(msg.threadId);
        if (msg.threadId === msg.senderId) {
            const data = await chat(msg.body, msg.threadId);
            api.sendMsg({body: data}, msg.threadId);
        }
    });
})(me);
