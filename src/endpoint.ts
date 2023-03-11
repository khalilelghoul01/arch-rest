import * as Route from "route-parser";
import { ArchJson, ArchMethod, ArchRequest, ArchResponse } from "./types";

export class ArchEndpoint {
  routeParams: ArchJson | null = null;

  public match(req: ArchRequest): boolean {
    let route = this.route();
    if (!route.startsWith("/")) {
      route = `/${route}`;
    }
    if (route.endsWith("/")) {
      route = route.slice(0, -1);
    }
    const routeParser = new Route(route);
    if (req.path.endsWith("/")) {
      req.path = req.path.slice(0, -1);
    }
    const params = routeParser.match(req.path);
    if (params) {
      this.routeParams = Object.keys(params).length ? params : null;
      return true;
    }
    return false;
  }

  route(): string {
    return "/";
  }
  method() {
    return ArchMethod.ALL;
  }
  handle(req: ArchRequest, res: ArchResponse) {
    // get class name
    const name = this.constructor.name;
    res.status(200).json({ message: `Hello from ${name}` });
  }
}
