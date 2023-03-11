import { ArchEndpoint } from "./endpoint";
import { ArchRouter } from "./router";
import { ArchMethod, ArchRequest, ArchResponse } from "./types";

export class Router extends ArchRouter {
  private acceptedMethods: ArchMethod;
  private acceptedPath: string;
  private acceptedHandle: (req: ArchRequest, res: ArchResponse) => void;

  constructor(
    method: ArchMethod,
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    super();
    this.acceptedMethods = method;
    if (!path.endsWith("/*route")) {
      path = path.endsWith("/") ? path + "*route" : path + "/*route";
    }
    this.acceptedPath = path;
    this.acceptedHandle = handle;
  }

  static get(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Router(ArchMethod.GET, path, handle);
  }

  static post(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Router(ArchMethod.POST, path, handle);
  }

  static put(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Router(ArchMethod.PUT, path, handle);
  }

  static delete(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Router(ArchMethod.DELETE, path, handle);
  }

  static crud(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Router(ArchMethod.CRUD, path, handle);
  }

  static all(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Router(ArchMethod.ALL, path, handle);
  }

  route(): string {
    return this.acceptedPath;
  }

  method(): ArchMethod {
    return this.acceptedMethods;
  }

  handleDefault(req: ArchRequest, res: ArchResponse): void {
    this.acceptedHandle(req, res);
  }
}

export class Route extends ArchEndpoint {
  private acceptedMethods: ArchMethod;
  private acceptedPath: string;
  private acceptedHandle: (req: ArchRequest, res: ArchResponse) => void;

  constructor(
    method: ArchMethod,
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    super();
    this.acceptedMethods = method;
    this.acceptedPath = path;
    this.acceptedHandle = handle;
  }

  static get(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Route(ArchMethod.GET, path, handle);
  }

  static post(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Route(ArchMethod.POST, path, handle);
  }

  static put(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Route(ArchMethod.PUT, path, handle);
  }

  static delete(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Route(ArchMethod.DELETE, path, handle);
  }

  static crud(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Route(ArchMethod.CRUD, path, handle);
  }

  static all(
    path: string,
    handle: (req: ArchRequest, res: ArchResponse) => void
  ) {
    return new Route(ArchMethod.ALL, path, handle);
  }

  route(): string {
    return this.acceptedPath;
  }

  method(): ArchMethod {
    return this.acceptedMethods;
  }

  handle(req: ArchRequest, res: ArchResponse): void {
    this.acceptedHandle(req, res);
  }
}
