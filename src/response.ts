import { ArchCookies, ArchJson } from "./types";
import * as http from "http";

export class ArchBaseResponse {
  private _status: number;
  private _headers: http.OutgoingHttpHeaders;
  private _body?: string;

  constructor() {
    this._status = 501;
    this._headers = {};
    this._body = undefined;
  }

  status(status: number): ArchBaseResponse {
    this._status = status;
    return this;
  }

  headers(headers: http.OutgoingHttpHeaders): ArchBaseResponse {
    this._headers = headers;
    return this;
  }

  body(body: string): ArchBaseResponse {
    this._body = body;
    return this;
  }

  json(body: ArchJson): ArchBaseResponse {
    this._headers["Content-Type"] = "application/json";
    this._body = JSON.stringify(body);
    return this;
  }

  html(body: string): ArchBaseResponse {
    this._headers["Content-Type"] = "text/html";
    this._body = body;
    return this;
  }

  raw(body: string): ArchBaseResponse {
    this._body = body;
    this._headers["Content-Type"] = "text/plain";
    return this;
  }

  addHeader(key: string, value: string): ArchBaseResponse {
    this._headers[key] = value;
    return this;
  }

  cookies(cookies: ArchCookies): ArchBaseResponse {
    this._headers["Set-Cookie"] = Object.keys(cookies).map(
      (key) => `${key}=${cookies[key]}`
    );
    return this;
  }

  export() {
    return {
      status: this._status,
      headers: this._headers,
      body: this._status === 501 ? "Not Implemented" : this._body,
    };
  }
}
