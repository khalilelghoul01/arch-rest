import * as Route from "route-parser";
import { ArchEndpoint } from "./endpoint";
import { ArchBaseResponse } from "./response";
import { ArchMethod, ArchRequest, ArchResponse } from "./types";

export class ArchRouter extends ArchEndpoint {
  _catch: ((err: Error, res: ArchResponse) => void) | undefined = undefined;

  catch(catchFn: (err: Error, res: ArchResponse) => void): ArchRouter {
    this._catch = catchFn;
    return this;
  }

  public match(req: ArchRequest): boolean {
    let route = this.route();
    // /*route needs to be in the route
    if (!route.includes("/*route")) {
      const className = this.constructor.name;
      throw new Error(`Router ${className} does not have /*route in route()`);
    }
    if (!route.startsWith("/")) {
      route = `/${route}`;
    }
    if (route.endsWith("/") && route !== "/") {
      route = route.slice(0, -1);
    }
    const routeParser = new Route(route);

    if (!req.path.endsWith("/")) {
      req.path = `${req.path}/`;
    }

    const params = routeParser.match(req.path);
    if (params) {
      this.routeParams = Object.keys(params).length ? params : null;
      return true;
    }
    return false;
  }

  route(): string {
    return "/*route";
  }
  private _routes: ArchEndpoint[] = [];

  addRoute(route: ArchEndpoint): ArchRouter {
    this._routes.push(route);
    return this;
  }

  getRoutes() {
    return this._routes;
  }

  mutateRequestRoute(req: ArchRequest, route: string) {
    if (!route.startsWith("/")) {
      route = `/${route}`;
    }
    if (route.endsWith("/")) {
      route = route.slice(0, -1);
    }
    req.path = route;
  }

  handle(req: ArchRequest, res: ArchBaseResponse): void {
    try {
      const routes = this.getRoutes();
      const matchedRouter = this.match(req);
      // console.log("matchedRouter", matchedRouter);
      // console.log("req.url", req.url);
      // console.log("route", this.route());

      if (matchedRouter) {
        this.mutateRequestRoute(req, (this.routeParams?.route ?? "") as string);
        for (const route of routes) {
          if (
            req.method === route.method() ||
            route.method() === ArchMethod.ALL ||
            (route.method() === ArchMethod.CRUD &&
              (req.method === ArchMethod.GET ||
                req.method === ArchMethod.POST ||
                req.method === ArchMethod.PUT ||
                req.method === ArchMethod.DELETE))
          ) {
            if (route instanceof ArchRouter) {
              const reqCopy = { ...req };
              reqCopy.subPath = req.path;
              if (route.match(reqCopy)) {
                route.handle(reqCopy, res);
                return;
              }
            } else if (route.match(req)) {
              route.handle(req, res);
              return;
            }
          } else {
            // method not allowed
            res.status(405).json({ error: "Method Not Allowed" });
          }
        }
        let baseRoute = this.route().replace(RegExp("\\*route(/)?"), "");
        let restOfRoute = !req.subPath.endsWith("/")
          ? req.subPath + "/"
          : req.subPath;
        if (!baseRoute.startsWith("/")) {
          baseRoute = `/${baseRoute}`;
        }
        if (!restOfRoute.startsWith("/")) {
          restOfRoute = `/${restOfRoute}`;
        }
        const condition = restOfRoute === baseRoute;
        if (condition) {
          this.handleDefault(req, res);
          return;
        }
      }

      res.status(404).json({ error: "Not Found" });
    } catch (error) {
      if (this._catch) {
        this._catch(error as Error, res);
      } else {
        console.error(error);

        res.status(500).json({ error: `${error}` });
      }
    }
  }

  handleDefault(req: ArchRequest, res: ArchBaseResponse): void {
    res.status(404).json({
      error: "This a default handler for the router: Override this method",
    });
  }

  getRoute() {
    // replace *route with the routeParams.route
    return this.route().replace(
      RegExp("\\*route(/)?"),
      (this.routeParams?.route ?? "") as string
    );
  }
}
