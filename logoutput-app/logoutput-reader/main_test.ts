import { assertEquals } from "@std/assert";

Deno.test(async function outputTest() {
  const file = await Deno.create("test.txt");
  await file.write(new TextEncoder().encode("Hello, world!"));
  const text = await Deno.readTextFile("test.txt");
  assertEquals(text, "Hello, world!");
  file.close();
});
