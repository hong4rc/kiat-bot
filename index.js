'use strict';
const fs = require('fs');
const log = require('kiat-log');
const login = require('node-facebook');

// let user = {email: 'your username/id', pass: 'your pass'};

let user = process.env.user;

if (user) {
    user = JSON.parse(user);
    if (!user.email || !user.pass) {

        // login with cookie from .env
        user = {appState: user};
    }
} else {

    // login with  cookie file
    user = {appState: JSON.parse(fs.readFileSync('state.json', 'utf8'))};
}

// const TIME_OUT_MSG = 30000;
// const MY_TIME_ZONE = 7;
// const HOUR_IN_DAY = 24;
// const MIN_SEND_SLEEP = 3600000;

// const timeSleep = {
//     start: 1,
//     end: 5
// };

// const getHour = () => (new Date().getUTCHours() + MY_TIME_ZONE) % HOUR_IN_DAY;
login(user)
    .then(api => {
        log.setApi(api);

        // const listSent = {};

        // fs.writeFileSync('state.json', JSON.stringify(api.getAppState()));
        api.listen((err, msg) => {
            if (err) {
                log.error(err);
            }
            switch (msg.type) {
                case 'presence':
                    log.info(msg.userId, msg.statUser ? 'online' : 'idle');

                    // if (msg.statUser && !listSent[msg.userId]) {
                    //     const nowHour = getHour();
                    //     if (nowHour >= timeSleep.start && nowHour <= timeSleep.end) {
                    //         api.sendMessage('good night', msg.userId)
                    //             .then(msgId => {
                    //                 setTimeout(() => api.deleteMessage([msgId]), TIME_OUT_MSG);
                    //                 listSent[msg.userId] = true;
                    //                 setTimeout(() => delete listSent[msg.userId], MIN_SEND_SLEEP);
                    //             });
                    //     }
                    // }
                    break;
                case 'typ':
                    api.sendTyping(msg.from, msg.isTyping);
                    log.info(`${msg.from} is ${msg.isTyping ? '' : 'not'} typing.`);
                    break;
                case 'message':
                    api.markAsRead(msg.threadId);
                    break;
                default:

                // log.info(msg);

            }
        });
    });
