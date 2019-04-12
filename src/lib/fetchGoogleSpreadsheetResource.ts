/**
 * Works around a peculiar Google Spreadsheet response convention, namely returning
 * a 302 redirect to a HTML-based login page when requesting a JSON resource
 * that is not publicly accessible.
 * @hidden
 */
export function fetchGoogleSpreadsheetResource(url) {
  const response = UrlFetchApp.fetch(url, {
    followRedirects: false
  });
  if (response.getResponseCode() === 302) {
    const toLowerCaseKeys = obj => {
      return Object.keys(obj).reduce((accum, key) => {
        accum[key.toLowerCase()] = obj[key];
        return accum;
      }, {});
    };
    const responseHeaders = toLowerCaseKeys(response.getHeaders()) as any;
    if (
      responseHeaders.location.indexOf(
        "https://accounts.google.com/ServiceLogin?"
      ) === 0
    ) {
      throw new Error(
        `Not allowed to access the requested Google Spreadsheet resource at "${url}". Double-check that the spreadsheet is published.`
      );
    }
  }
  return JSON.parse(response.getContentText());
}
