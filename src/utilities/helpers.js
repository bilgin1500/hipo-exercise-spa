import uniqueBy from 'lodash.uniqby';
import config from 'utilities/config';

/*
 * Is the given variable undefined?
 */
export const isUndefined = obj => {
  return obj === void 0;
};

/*
 * Is the given variable null?
 */
export const isNull = obj => {
  return obj === null;
};

/*
 * Is this a function?
 * @see https://stackoverflow.com/a/7356528/4707530
 */
export const isFunction = func => {
  return func && {}.toString.call(func) === '[object Function]';
};

/*
 * Is this an empty object?
 * @see https://stackoverflow.com/a/32108184/4707530
 */
export const isEmptyObj = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
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
 * Checks an id against a list
 * @param  {string} id - The unique identifier to check
 * @param  {object} list - The object to check against
 * @return {boolean}
 */
export const checkList = (id, list) => {
  if (isUndefined(id) || isUndefined(list[id])) {
    return false;
  }

  return true;
};

/**
 * Builds the title
 * @param  {string} title - The string to prepend
 * @return {string} The parameter prepended to the core page title
 */
export const buildTitle = title => {
  if (isUndefined(title)) {
    return config.app.title;
  } else {
    return title + config.app.title_sep + config.app.title;
  }
};

/**
 * The ultimate full name builder!!!
 * @param  {string} name
 * @param  {string} surname
 * @return {string} Full name!
 */
export const buildName = (name, surname) => {
  return (
    (isUndefined(name) ? '' : name) +
    (isUndefined(surname) ? '' : ' ' + surname)
  );
};

/**
 * Customizer function for mergeWith
 *
 * Lodash.Merge doesn't concat arrays so we're using mergeWith
 * combined with uniqueBy. uniqueBy's iiteratee id 'id'.
 *
 * For more:
 * https://lodash.com/docs/4.17.5#mergeWith
 * https://lodash.com/docs/4.17.5#uniqBy
 *
 * @param  {object} objValue - Object to be added
 * @param  {object} srcValue - Source
 * @return {array} Two arrays together
 */
export const uniqueConcat = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return uniqueBy(objValue.concat(srcValue), 'id');
  }
};
