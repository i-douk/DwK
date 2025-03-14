const basePath = "/usr/src/app/images";
import { copy, readerFromStreamReader } from "./deps.ts";

export const fetchAndSaveImage = async () => {

  const response = await fetch("https://picsum.photos/1200");
  
  if (!response.body) {
    throw new Error("Failed to fetch image.");
  }
  const reader = readerFromStreamReader(response.body.getReader());
    
  const savedImage = await Deno.create(`${basePath}/image.png`);
  
  await copy(reader, savedImage);
  savedImage.close();
  console.log("Image saved successfully.");
  return `${basePath}/image.png`;
}