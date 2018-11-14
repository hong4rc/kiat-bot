'use strict';

const apiai = require('apiai');
const app = apiai(process.env.TOKEN_AI);

module.exports = (msg, id) => new Promise((resolve, reject) => {
    const request = app.textRequest(msg, {sessionId: id});
    request.on('response', response => {
        resolve(response.result.fulfillment.speech);
    });

    request.on('error', error => {
        reject(error);
    });

    request.end();

});
