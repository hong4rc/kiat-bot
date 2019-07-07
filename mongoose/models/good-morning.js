const { Schema, model } = require('mongoose');

module.exports = model('GoodMorning', new Schema({
  quote: String,
}));
