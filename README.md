# Arch-Rest

Arch-Rest is a lightweight and flexible RESTful API framework built with TypeScript. It allows developers to create endpoints and routers easily using classes and methods, and it provides a simple and intuitive API for handling HTTP requests and responses.

### Getting Started

To get started with Arch-Rest, simply install it using npm:
```bash
npm install arch-rest
```
Then, import the `Arch` class and create a new instance of it:
```typescript
import { Arch } from 'arch-rest';
```

Then, you can start building your RESTful API by creating an instance of the `Arch` class and adding routers and endpoints to it. Here's an example:

```typescript
import { Arch } from "arch-rest";

const app = new Arch();

app.router(myRouter);

app.port(3000).start();
```

In this example, we created an instance of the `Arch` class, added a router named `myRouter`, set the port to `3000`, and started the server.*

### Creating Endpoints

To create an endpoint in Arch-Rest, you can extend the `ArchEndpoint` class and implement the `handle` method. Here's an example:

```typescript

import { ArchEndpoint, ArchMethod, ArchRequest, ArchResponse } from "arch-rest";

class MyEndpoint extends ArchEndpoint {
  method() {
    return ArchMethod.GET;
  }

  route() {
    return "/my-endpoint";
  }

  handle(req, res) {
    res.status(200).json({
      message: "Hello, world!",
    });
  }
}

```

In this example, we created an endpoint named `MyEndpoint` that handles GET requests to the `/my-endpoint` route. When a request is made to this route, the handle method is executed and a JSON response with a message is returned.

### Creating Routers

To create a router in Arch-Rest, you can use the `Router` class and add endpoints to it. Here's an example:
    
```typescript
import { ArchEndpoint, ArchMethod, ArchRequest, ArchResponse, Router } from "arch-rest";

const myRouter = Router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, world!",
  });
});

myRouter.addRoute(new MyEndpoint());

```

In this example, we created a router named `myRouter` that handles GET requests to the root route `/` and added the `MyEndpoint` endpoint to it. When a request is made to the root route or the `/my-endpoint` route, the appropriate response is returned.

### Conclusion

Arch-Rest is a flexible and easy-to-use framework for building RESTful APIs with TypeScript. With its simple API for handling requests and responses and its support for routers and endpoints, you can quickly and easily create powerful and simple APIs.