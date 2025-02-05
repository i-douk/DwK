const bytes = new Uint8Array([72, 101, 108, 108, 111]);
await Deno.writeFile("hello.txt", bytes, { mode: 0o644 });

await Deno.writeTextFile("hello.txt", "Hello World");

await Deno.writeTextFile("server.log", "Request: ...", { append: true });

Deno.writeFileSync("hello.txt", bytes);
Deno.writeTextFileSync("hello.txt", "Hello World");

const file = await Deno.create("hello.txt");

const written = await file.write(bytes);
console.log(`${written} bytes written.`);

const writer = file.writable.getWriter();
await writer.write(new TextEncoder().encode("World!"));

await writer.close();