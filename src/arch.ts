import * as http from "http";
import { ArchEndpoint } from "./endpoint";
import { ArchMethod, ArchOptions, ArchRequest, ArchResponse } from "./types";
import { ArchBase } from "./base";
import { ArchBaseResponse } from "./response";
import { ArchRouter } from "./router";
import { Colors } from "./colors";

export class Arch extends ArchBase {
  private _port: number;
  private _log: (req: ArchRequest) => void;
  private _callback: (port: number) => void;
  private _catch: ((err: Error, res: ArchResponse) => void) | undefined;
  private server: http.Server | undefined;
  private _router: ArchEndpoint | undefined;
  private version = "0.0.7";

  constructor(options?: ArchOptions) {
    super();
    this._port = options?.port || 3000;
    this._callback =
      options?.callback ||
      ((port) => {
        console.log(
          Colors.setBlue(`       
██████╗ ██████╗  ██████╗██╗  ██╗
██╔══██╗██╔══██╗██╔════╝██║  ██║
███████║██████╔╝██║     ███████║
██╔══██║██╔══██╗██║     ██╔══██║
██║  ██║██║  ██║╚██████╗██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`)
        );
        console.log(`       
welcome to arch - ${Colors.setLightCyan("v" + this.version)}
arch is a lightweight, fast, and simple Rest framework for node.js


server running on port ${Colors.setLightMagenta(port.toString())}
        `);
      });
    this._log =
      options?.log ||
      ((req) => {
        // fromat: [date:time](blue) - [method](orange) - [path]
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const method = req.method;
        const path = req.path;

        const lightBlue = "\x1b[36m";
        const lightOrange = "\x1b[33m";
        const reset = "\x1b[0m";
        const reqLog = `${lightBlue}[${time}]${reset} - ${lightOrange}${method}${reset} - ${path}`;
        console.log(reqLog);
        console.log("-".repeat(50));
      });
    this._catch = options?.catch;
  }

  port(port: number): Arch {
    this._port = port;
    return this;
  }

  callback(log: (port: number) => void): Arch {
    this._callback = log;
    return this;
  }

  log(log: (req: ArchRequest) => void): Arch {
    this._log = log;
    return this;
  }

  router(router: ArchEndpoint): Arch {
    this._router = router;
    return this;
  }

  catch(catchFn: (err: Error, res: ArchResponse) => void): Arch {
    this._catch = catchFn;
    return this;
  }

  async parseRequest(req: http.IncomingMessage): Promise<ArchRequest> {
    const method = this.parseMethod(req.method || "");
    const type = this.extractType(req, method);
    const cookies = this.extractCookies(req);
    const headers = this.cleanHeaders(req.headers);
    const body = await this.extractBody(req, type);
    const params = this.extractParams(req.url || "");
    return {
      path: req.url || "",
      subPath: req.url || "",
      absolutePath: req.url || "",
      method,
      type,
      cookies,
      headers,
      body,
      queryParams: params as Record<string, string>,
    };
  }

  start(): Arch {
    try {
      this.server = http.createServer(async (req, res) => {
        const request = await this.parseRequest(req);
        const response = new ArchBaseResponse();
        if (this._router instanceof ArchRouter) {
          this._router.catch(this._catch || (() => {}));
        }
        this._log?.(request);
        if (
          this._router?.method() === ArchMethod.ALL ||
          this._router?.method() === request.method ||
          (this._router?.method() === ArchMethod.CRUD &&
            (request.method === ArchMethod.GET ||
              request.method === ArchMethod.POST ||
              request.method === ArchMethod.PUT ||
              request.method === ArchMethod.DELETE))
        ) {
          this._router?.handle(request, response);
        } else {
          response.status(405).json({ message: "Method not allowed" });
        }
        const { status, headers, body } = response.export();
        res.writeHead(status, headers);
        res.end(body);
      });
      this.server.listen(this._port, () => {
        this._callback(this._port);
      });
    } catch (err) {
      if (this._catch) {
        this._catch(err as Error, new ArchBaseResponse());
      } else {
        throw err;
      }
    }
    return this;
  }
}
