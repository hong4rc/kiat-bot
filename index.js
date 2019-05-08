
const log = require('kiat-log');
const Facebook = require('node-facebook');
const chat = require('./chat');

const timer = require('./timer');

const milis = 1000;
const delta = 5;

// let user = {email: 'your username/id', pass: 'your pass'};

const state = JSON.parse(process.env.user);

const me = new Facebook({ state });
(async (user) => {
  const api = await user.login();
  api.listen();

  let nextSeconds;
  const timerBio = () => {
    timer.tick();
    nextSeconds = timer.getNext();
    api.changeBio(`${timer.getTime()}\nNước sông chảy cạn,\ncá tự bơi đi chỗ khác :)`, nextSeconds + delta)
      .then(() => setTimeout(timerBio, nextSeconds * milis));
  };
  timerBio();

  api.on('presence', (message) => {
    log.info(message.userId, message.statUser ? 'online' : 'idle');
  });
  api.on('typ', (message) => {
    api.sendTyping(message.from, message.isTyping);
    log.info(`${message.from} is ${message.isTyping ? '' : 'not'} typing.`);
  });
  api.on('msg', async (message) => {
    api.markAsRead(message.threadId);
    if (message.threadId === message.senderId) {
      const data = await chat(message.body, message.threadId);
      api.sendMsg({ body: data }, message.threadId);
    }
  });
})(me);
