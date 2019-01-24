/* tslint:disable:max-classes-per-file */
import request from "sync-request";

// Implement a minimal UrlFetchApp to be able to test outside of the google apps script environment

/**
 * @hidden
 */
class MinimalHttpResponse {
  private res;
  constructor(res) {
    this.res = res;
  }
  public getContentText() {
    return this.res.getBody();
  }
}
/**
 * @hidden
 */
export class MinimalUrlFetchApp {
  public static fetch(url, params = {}) {
    const res = request("GET", url);
    return new MinimalHttpResponse(res);
  }
}
