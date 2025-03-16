const port = 8081;
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { render } from "./client.js";


// fetch and save image every hour
import { fetchAndSaveImage } from "./utils-deprecated.ts";
const basePath = "./images";
const imageSource = "https://picsum.photos/1200";
const imageFilePath = `${basePath}/image.png`;
fetchAndSaveImage(imageFilePath, imageSource);
setInterval(fetchAndSaveImage, 1000 * 60 * 60);

// read html content
const html = await Deno.readTextFile("./client.html");
const todos = ['Todo 1', 'Todo 2', 'Todo 3'];
const router = new Router();

// serve client.js
router.get("/client.js", async (context) => {
  context.response.type = "application/javascript";
  await context.send({
    root: Deno.cwd(),
    index: "client.js",
  });
});

router.get("/", (context) => {
  const document = new DOMParser().parseFromString(
    "<!DOCTYPE html>",
    "text/html",
  );
  render(document, { todos });
  context.response.type = "text/html";
  if(document) {
    context.response.body = `${document.body.innerHTML}${html}`;
  }else{
    context.response.body = html;
  }
});

// serve todos
router.get("/data", (context) => {
  context.response.body = todos;
});

// serve image
router.get("/image", async (context) => {
  const imageBuf = await Deno.readFile(imageFilePath);
  context.response.body = imageBuf;
  context.response.headers.set('Content-Type', 'image/png');
});

// add todo
router.post("/add", async (context) => {
  const { value } = await context.request.body({ type: "json" });
  const { item } = await value;
  todos.push(item);
  context.response.status = 200;
});

// create application
const app = new Application();

app.use(oakCors({
  origin: `http://localhost:${port}`,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// use router
app.use(router.routes());
app.use(router.allowedMethods());


// listen on port 4243
await app.listen({ port : 8000 });