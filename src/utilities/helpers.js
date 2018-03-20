import config from 'utilities/config';

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
 * Make a string's first letter uppercase
 * @param {string} string - The string to be capitalized
 * @return {string} The string after transformation
 */
export const capitalize = string => {
  return string.replace(string.charAt(0), string.charAt(0).toUpperCase());
};

/**
 * Date converter. Converts js date object to a simple sql format
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

/**
 * Relative time parser
 * @param  {date} date - The date object from the db. Must be js date()
 * @return {string} a user friendly sentence
 */
export const timeAgo = date => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = new Date() - new Date(date);

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' second(s) ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minute(s) ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hour(s) ago';
  } else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed / msPerDay) + ' day(s) ago';
  } else if (elapsed < msPerYear) {
    return (
      'approximately ' + Math.round(elapsed / msPerMonth) + ' month(s) ago'
    );
  } else {
    return 'approximately ' + Math.round(elapsed / msPerYear) + ' year(s) ago';
  }
};

/**
 * Document title changer
 * @param  {string} title - The subtitle before the '- Foursquared'
 */
export const changeTitle = title => {
  if (title) {
    document.title = title + config.titleSep + config.title;
  } else {
    document.title = config.title;
  }
};
