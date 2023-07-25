const setIntervalImmediately = (func, interval) => {
  func();
  return setInterval(func, interval);
};

export default setIntervalImmediately;
