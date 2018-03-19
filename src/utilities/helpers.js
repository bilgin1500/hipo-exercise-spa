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
