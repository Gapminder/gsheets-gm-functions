/* tslint:disable:max-classes-per-file */
/* tslint:disable:no-implicit-dependencies */
import request from "sync-request";
import { Response } from "then-request";

// Implement a minimal UrlFetchApp to be able to test outside of the google apps script environment

/**
 * @hidden
 */
class MinimalHttpResponse {
  private res: Response;
  constructor(res) {
    this.res = res;
  }
  public getContentText() {
    return this.res.body.toString("utf-8");
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
  public static fetch(url, params: { followRedirects?: boolean } = {}) {
    const options = {
      followRedirects: params.followRedirects
    };
    const res = request("GET", url, options);
    return new MinimalHttpResponse(res);
  }
}
