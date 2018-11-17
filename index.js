'use strict';
const fs = require('fs');
const log = require('kiat-log');
const login = require('node-facebook');
const chat = require('./chat');

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

login(user)
    .then(api => {
        log.setApi(api);

        // fs.writeFileSync('state.json', JSON.stringify(api.getAppState()));
        api.listen((err, msg) => {
            if (err) {
                log.error(err);
            }
            const source = msg.senderId || msg.from;
            if (source === api.getCurrentUserId()) {

                // use some command
                return;
            }
            switch (msg.type) {
                case 'presence':
                    log.info(msg.userId, msg.statUser ? 'online' : 'idle');

                    break;
                case 'typ':
                    api.sendTyping(msg.from, msg.isTyping);
                    log.info(`${msg.from} is ${msg.isTyping ? '' : 'not'} typing.`);
                    break;
                case 'message':
                    api.markAsRead(msg.threadId);
                    if (msg.threadId === msg.senderId) {
                        chat(msg.body, msg.threadId)
                            .then(res => res && api.sendMessage(res, msg.threadId), log.error);
                    }
                    break;
                default:

                // log.info(msg);

            }
        });
    });
