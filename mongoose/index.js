const mongoose = require('mongoose');

const connect = () => new Promise((resolve, reject) => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.connection.on('error', (error) => {
    reject(error);
  }).on('open', () => {
    resolve(true);
  });
});

module.exports = {
  connect,
};
