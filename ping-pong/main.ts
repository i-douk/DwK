let count = 0;
const log = await fetch(`http://logoutput-svc:2346/logs`).then(res => res.arrayBuffer());
const handler =  async (_req: Request): Promise<Response> => {
  const decoder = new TextDecoder();
  try {
    return new Response(`${decoder.decode(new Uint8Array(await log))} \n Ping/Pongs : ${count++}`, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error rendering the stream:", error);
    return new Response("Error fetching logs", { status: 500 });
  } 
};

Deno.serve({ port: 4247 }, handler);