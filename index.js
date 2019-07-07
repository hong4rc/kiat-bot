const log = require('kiat-log');
const Facebook = require('node-facebook');
const ticker = require('./ticker');
const chat = require('./chat');
const { connect } = require('./mongoose');
const { get } = require('./mongoose/controller/good-morning');

const Timer = require('./timer');

// let user = {email: 'your username/id', pass: 'your pass'};

const state = JSON.parse(process.env.user);

Promise.all([
  new Facebook({ state }).login(),
  connect(),
]).then(async ([api]) => {
  api.listen();

  const bioTimer = new Timer((now) => {
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(now.getMinutes() + 1);
  });
  const changeBio = () => api.changeBio(`${Timer.offset()}\nNước sông chảy cạn,\ncá tự bơi đi chỗ khác :)`, 60);
  ticker(changeBio, () => bioTimer.next());

  const hiTimer = new Timer((now) => {
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);
    if (now.getHours() >= 6) {
      now.setDate(now.getDate() + 1);
    }
    now.setHours(6);
  });
  const hiMorning = () => {
    // todo: load from db
    const users = JSON.parse(process.env.FRIENDS) || [];
    const send = (id) => {
      setTimeout(async () => {
        api.sendMessage({ body: await get() }, id);
      }, Math.random() * 180000);
    };
    users.forEach(send);
    return Promise.resolve();
  };
  ticker(hiMorning, () => hiTimer.next());

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
      if (data) {
        api.sendMessage({ body: data }, message.threadId);
      }
    }
  });
});
