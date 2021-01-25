/* tslint:disable:max-classes-per-file */
/* tslint:disable:no-implicit-dependencies */
import request from "sync-request";
import { Options } from "sync-request/lib/Options";
import { Response } from "then-request";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

// Implement a minimal UrlFetchApp to be able to test outside of the google apps script environment

/**
 * @hidden
 */
class MinimalHttpResponse {
  private res: Response;
  private options: URLFetchRequestOptions;
  constructor(res, options: URLFetchRequestOptions = {}) {
    this.res = res;
    this.options = options;
  }
  public getContentText() {
    const contentText = this.res.body.toString("utf-8");
    if (this.getResponseCode() !== 200 && !this.options.muteHttpExceptions) {
      throw new Error(
        `Request failed for ${
          this.res.url
        } returned code ${this.getResponseCode()}. Truncated server response: ${contentText} (use muteHttpExceptions option to examine full response)`
      );
    }
    return contentText;
  }
  public getResponseCode() {
    return this.res.statusCode;
  }
  public getHeaders() {
    return this.res.headers;
  }
}
/**
 * @hidden
 */
export class MinimalUrlFetchApp {
  public static fetch(
    url,
    params: URLFetchRequestOptions = {}
  ): MinimalHttpResponse {
    if (params.muteHttpExceptions === undefined) {
      params.muteHttpExceptions = false;
    }
    const now = Date.now();
    const fetchOptions: Options = {
      followRedirects: params.followRedirects
    };
    const res = request("GET", url, fetchOptions);
    console.debug(
      `     * (Tests-only progress info) - Request of ${url} took ${Date.now() -
        now}ms`
    );
    return new MinimalHttpResponse(res, params);
  }
}
