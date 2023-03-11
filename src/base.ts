import { ParsedUrlQuery } from "querystring";
import { ArchBody, ArchCookies, ArchMethod, ArchRequesType } from "./types";
import * as http from "http";
import * as url from "url";

export class ArchBase {
  parseCookies(cookies?: string): ArchCookies {
    return (
      cookies
        ?.split(";")
        .map((cookie) => cookie.split("="))
        .reduce(
          (acc, [key, value]) => {
            acc[key.trim()] = value;
            return acc;
          },
          {} as {
            [key: string]: string;
          }
        ) || {}
    );
  }

  extractCookies(request: http.IncomingMessage): ArchCookies {
    return this.parseCookies(request.headers.cookie);
  }

  parseType(type: string, metod: ArchMethod): ArchRequesType {
    if (metod === ArchMethod.GET) {
      return ArchRequesType.EMPTY;
    }
    if (type.includes("application/json")) {
      return ArchRequesType.JSON;
    }
    if (type.includes("application/x-www-form-urlencoded")) {
      return ArchRequesType.FORM;
    }
    if (type.includes("text/plain")) {
      return ArchRequesType.TEXT;
    }
    if (type.includes("application/octet-stream")) {
      return ArchRequesType.BINARY;
    }
    return ArchRequesType.EMPTY;
  }

  extractType(
    request: http.IncomingMessage,
    method: ArchMethod
  ): ArchRequesType {
    return this.parseType(request.headers["content-type"] || "", method);
  }

  cleanHeaders(headers: http.IncomingHttpHeaders): http.IncomingHttpHeaders {
    // remove cookies from headers
    delete headers.cookie;
    return headers;
  }

  parseMethod(method: string): ArchMethod {
    switch (method) {
      case "GET":
        return ArchMethod.GET;
      case "POST":
        return ArchMethod.POST;
      case "PUT":
        return ArchMethod.PUT;
      case "DELETE":
        return ArchMethod.DELETE;
      case "PATCH":
        return ArchMethod.PATCH;
      case "HEAD":
        return ArchMethod.HEAD;
      case "OPTIONS":
        return ArchMethod.OPTIONS;
      case "TRACE":
        return ArchMethod.TRACE;
      case "CONNECT":
        return ArchMethod.CONNECT;
      default:
        return ArchMethod.ALL;
    }
  }

  async extractBody(
    request: http.IncomingMessage,
    type: ArchRequesType
  ): Promise<ArchBody> {
    const body = new Promise<string>((resolve, reject) => {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        resolve(body);
      });
      request.on("error", (error) => {
        reject(error);
      });
    });

    return this.parseBody(await body, type);
  }

  parseBody(body: string, type: ArchRequesType): ArchBody {
    switch (type) {
      case ArchRequesType.JSON:
        return JSON.parse(body);
      case ArchRequesType.FORM:
        return this.parseForm(body);
      case ArchRequesType.TEXT:
        return body;
      case ArchRequesType.BINARY:
        return body;
      default:
        return null;
    }
  }

  parseForm(form: string): ArchBody | null {
    const body = form
      .split("&")
      .map((field) => field.split("="))
      .reduce((acc, [key, value]) => {
        if (key.trim() === "" || value.trim() === "") return acc;
        acc[key.trim()] = value;
        return acc;
      }, {} as { [key: string]: string });
    if (Object.keys(body).length === 0) {
      return null;
    }
    return body;
  }

  extractParams(urlPath: string): ParsedUrlQuery | null {
    const urlObject = url.parse(urlPath, true);
    const query = urlObject.query;
    const parsedQuery = {} as {
      [key: string]: string | string[];
    };

    for (const key in query) {
      const value = query[key];

      if (Array.isArray(value)) {
        parsedQuery[key] = value;
      } else {
        if (value) {
          parsedQuery[key] = value?.toString();
        }
      }
    }

    if (Object.keys(parsedQuery).length === 0) {
      return null;
    }

    return parsedQuery;
  }
}
