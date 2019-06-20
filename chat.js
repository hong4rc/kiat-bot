const apiai = require('apiai');

const app = apiai(process.env.TOKEN_AI);

module.exports = (message, id) => new Promise((resolve, reject) => {
  const request = app.textRequest(message, { sessionId: id });
  request.on('response', (response) => {
    resolve(response.result.fulfillment.speech);
  });

  request.on('error', (error) => {
    reject(error);
  });

  request.end();
});
