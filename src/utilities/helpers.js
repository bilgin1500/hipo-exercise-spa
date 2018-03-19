/*
  Is a given variable undefined?
 */
export const isUndefined = obj => {
  return obj === void 0;
};

/*
  Is a given variable null?
 */
export const isNull = obj => {
  return obj === null;
};

/*
  Is this a function?
  @see https://stackoverflow.com/a/7356528/4707530
 */
export const isFunction = func => {
  return func && {}.toString.call(func) === '[object Function]';
};

/**
 * A basic date converter. Converts js date object to a simple sql format
 * @param {object} date - Js date object
 * @return {string} YYYY-MM-DD HH:MM
 */
export const convertDate = date => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();

  function addZero(num) {
    if (num < 10) {
      num = '0' + num;
    }
    return num;
  }

  return (
    year +
    '-' +
    addZero(month) +
    '-' +
    addZero(day) +
    ' ' +
    addZero(hour) +
    ':' +
    addZero(min)
  );
};
