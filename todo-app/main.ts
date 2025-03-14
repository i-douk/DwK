import { fetchAndSaveImage } from "./utils.ts";

// Fetch and save image
let imagePath = await fetchAndSaveImage();
setInterval(async () => {
  imagePath = await fetchAndSaveImage();
}, 3600);

const page = `

  <div class="container center">
    <img src="/image.png" alt="image" />
  </div>
`;


// Handler for serving the image with caching
const handler = async (_req: Request) => {
  try {
    const image = await Deno.readFile(imagePath);

    return new Response(image, { 
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600, immutable", 
        "ETag": `"${imagePath}"`,
      },
    });
  } catch (error) {
    return new Response("Image not found", { status: 404 });
  }
};

// Start the server
Deno.serve({ port: 4243 }, handler);
