/**
 * @hidden
 */
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

/**
 * @hidden
 */
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

/**
 * To workaround the weird default way of handling errors in UrlFetchApp.fetch
 * @hidden
 */
export const errorHandlingFetch = (
  url: string,
  params?: URLFetchRequestOptions
): HTTPResponse => {
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const responseCode = response.getResponseCode();
  if (
    responseCode !== 200 &&
    !(responseCode === 302 && params.followRedirects)
  ) {
    throw new UrlFetchAppFetchException(url, response);
  }
  return response;
};

/**
 * @hidden
 */
export class UrlFetchAppFetchException extends Error {
  public name: string;
  public url: string;
  public response: HTTPResponse;
  constructor(url?: string, response?: HTTPResponse) {
    const responseCode = response.getResponseCode();
    const message = `Request failed for "${url}". Returned code: ${responseCode}.`;
    super(message);
    this.name = "UrlFetchAppFetchException";
    this.url = url;
    this.response = response;
  }
}
