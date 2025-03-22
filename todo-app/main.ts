const port = 8081;
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { render } from "./client.js";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

// db connection
const sql = new Client({
    user: Deno.env.get('USER'),
    database: Deno.env.get('DB'),
    hostname: Deno.env.get('HOST'),
    port: Number(Deno.env.get('DB_PORT')),
    password: Deno.env.get('POSTGRES_PASSWORD'),
});

// fetch todos from db
async function fetchTodos() {
  await sql.connect();
  try {
    const result = await sql.queryObject`
     SELECT * FROM todos
    `
    return result.rows
  } catch(error){
    console.log(error)
  } finally {
    sql.end()
  }
}

//save todo to db
async function saveTodo(task: string) {
  await sql.connect()
  try {
    await sql.queryObject`
      INSERT INTO todos (task)
      VALUES (${task})
    `;
    console.log("todo saved successfully");
  } catch (error) {
    console.error("Failed to save todo:", error);
  } finally {
    await sql.end();
  }
}

// fetch and save image every hour
import { fetchAndSaveImage } from "./utils.ts";
const basePath = "./images";
const imageSource = "https://picsum.photos/1200";
const imageFilePath = `${basePath}/image.png`;
fetchAndSaveImage(imageFilePath, imageSource);
setInterval(fetchAndSaveImage, 1000 * 60 * 60);

// read html content
const html = await Deno.readTextFile("./client.html");
const todos = await fetchTodos() || [{ task : 'Enter your todos here'}];
const router = new Router();

// serve client.js
router.get("/client.js", async (context) => {
  context.response.type = "application/javascript";
  await context.send({
    root: "./",
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
    context.response.body = `${document?.body.innerHTML}${html}`;

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

// serve css
router.get("/index.css", async (context) => {
  try {
      const file = await Deno.readFile("./index.css");
      context.response.body = file;
      context.response.headers.set("Content-Type", "text/css");
  } catch (error) {
      console.error("Failed to read CSS file:", error);
      context.response.status = 500;
      context.response.body = "Internal Server Error";
  }
});

// add todo
router.post("/add", async (context) => {
  const { value } = await context.request.body({ type: "json" });
  const { item } = await value;
  try {
    await saveTodo(item)
    console.log('todo saved to db')
  } catch (error) {
      console.log(error)
  }
  todos.push({ task : item});
  context.response.status = 200;
});

// create application
const app = new Application();

app.use(oakCors({
  origin: [`http://localhost:${port}`],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// use router
app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port });