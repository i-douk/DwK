import { sql } from "./libs.ts";
console.log(sql)
console.log('connection established')
let count = 0;
let log: ArrayBufferLike;
try {
   log = await fetch(`http://logoutput-svc.log-pingpong-ns.svc.cluster.local:2346/logs`).then(res => res.arrayBuffer());
} catch (error) {
  console.error("Failed to fetch logs:", error);
  log = new TextEncoder().encode("Logs unavailable").buffer;

}
const handler =  async (_req: Request): Promise<Response> => {
  const decoder = new TextDecoder();

  try {
    return new Response(`
      file content : ${Deno.env.get('FILE_CONTENT')} \n
      env variable : ${Deno.env.get('MESSAGE')} \n
      ${decoder.decode(new Uint8Array(await log))} \n
      Ping/Pongs : ${count++}`, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error rendering the stream:", error);
    return new Response("Error fetching logs", { status: 500 });
  } 
};

Deno.serve({ port: 4247 }, handler);