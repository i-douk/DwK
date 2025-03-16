import { fetchAndSaveImage } from "./utils-deprecated.ts";
import { Application, Router } from "jsr:@oak/oak";

const app = new Application();
const router = new Router();

// Fetch and save image
let imagePath = await fetchAndSaveImage();
setInterval(async () => {
  imagePath = await fetchAndSaveImage();
}, 3600000);

// Route for the root path to render HTML
router.get("/", (ctx) => {
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Image Service</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        img {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <h1>Todo App</h1>

      <img src="/image" alt="Automatically updated image">

    </body>
    </html>
  `;
});

// Route for serving the image
router.get("/image", async (ctx) => {
  try {
    const image = await Deno.readFile(imagePath);
    ctx.response.body = image;
    ctx.response.headers.set("Content-Type", "image/png");
    ctx.response.headers.set("Cache-Control", "public, max-age=3600, immutable");
    ctx.response.headers.set("ETag", `"${imagePath}"`);
  } catch (error) {
    console.error(error);
    ctx.response.status = 404;
    ctx.response.body = "Image not found";
  }
});
// Handle favicon
router.get("/favicon.ico", (ctx) => {
  ctx.response.status = 204; // No content
});
// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
console.log("Server running on http://localhost:4243");
await app.listen({ port: 4243 });