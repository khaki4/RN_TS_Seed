let log = '';
const addLog = (message) => {
  log = '\r\n' + message;
};

const getLog = () => {
  return log;
};

const warning = (...message) => {
  if (__DEV__) {
    console.log(...message);
  }
};

export { addLog, getLog, warning };
