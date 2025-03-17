let count = 0;
const logDir = "/usr/src/app/files";
const filePath = `${logDir}/logs.txt`;
const handler = async (_req: Request): Promise<Response> => {
  const file = await Deno.open(filePath , { read: true });
  try {
    const log = Deno.readFileSync(filePath);
    return new Response(`${log} \n Ping/Pongs : ${count++}`, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error rendering the stream:", error);
    return new Response("Error reading file", { status: 500 });
  } finally {
    file.close();
  }
};

Deno.serve({ port: 4247 }, handler);