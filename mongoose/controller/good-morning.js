const GoodMorning = require('../models/good-morning');

const get = () => GoodMorning.aggregate([
  { $sample: { size: 1 } },
]).then(list => list[0].quote);

module.exports = {
  get,
};
