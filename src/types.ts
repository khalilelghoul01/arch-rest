import * as http from "http";
import { ParsedUrlQuery } from "querystring";
import { ArchBaseResponse } from "./response";

export interface ArchRequest {
  path: string;
  subPath: string;
  absolutePath: string;
  method: ArchMethod;
  type: ArchRequesType;
  cookies: ArchCookies;
  headers: http.IncomingHttpHeaders;
  body?: ArchBody;
  queryParams?: ParsedUrlQuery;
}

export interface ArchCookies {
  [key: string]: string;
}

export enum ArchMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  CONNECT = "CONNECT",
  ALL = "ALL",
  CRUD = "CRUD",
}

export enum ArchRequesType {
  JSON = "JSON",
  FORM = "FORM",
  TEXT = "TEXT",
  BINARY = "BINARY",
  EMPTY = "EMPTY",
}

export type ArchBody =
  | string
  | ArchJson
  | ArchJson[]
  | Buffer
  | ArrayBuffer
  | null;

export type ArchJson = {
  [key: string]: string | number | boolean | null | ArchJson | ArchJson[];
};

export type ArchResponse = ArchBaseResponse;

export type ArchOptions =
  | {
      port?: number;
      host?: string;
      callback?: (port: number) => void;
      log?: (req: ArchRequest) => void;
      catch?: (err: Error) => void;
    }
  | undefined;
