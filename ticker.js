module.exports = (action, getNext) => {
  const runner = () => action().then(() => {
    setTimeout(runner, getNext());
  });

  runner();
};
