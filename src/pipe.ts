/**
 * From https://www.sitepoint.com/lodash-features-replace-es6/
 * @hidden
 */
export const pipe = functions => data => {
  return functions.reduce((value, func) => func(value), data);
};
