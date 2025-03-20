import { sql } from "./libs.ts";

//fetch log to save and print
let log: ArrayBufferLike;
try {
   log = await fetch(`http://logoutput-svc.log-pingpong-ns.svc.cluster.local:2346/logs`).then(res => res.arrayBuffer());
   sql.connect
} catch (error) {
  console.error("Failed to fetch logs:", error);
  log = new TextEncoder().encode("Logs unavailable").buffer;
}

//connect to db and save
async function saveLog(level: string) {
  await sql.connect()
  try {
    await sql.queryObject`
      INSERT INTO logs (level)
      VALUES (${level})
    `;
    console.log("Log saved successfully");
  } catch (error) {
    console.error("Failed to save log:", error);
  } finally {
    await sql.end();
  }
}


let count = 0;
const handler =  async (_req: Request): Promise<Response> => {
  const decoder = new TextDecoder();
  saveLog(decoder.decode(new Uint8Array(await log)))

  try {
    return new Response(`
      file content : ${Deno.env.get('FILE_CONTENT')} \n
      env variable : ${Deno.env.get('MESSAGE')} \n
      ${decoder.decode(new Uint8Array(await log))} \n
      Ping/Pongs : ${count++} \n
      `, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error rendering the stream:", error);
    return new Response("Error fetching logs", { status: 500 });
  } 
};

Deno.serve({ port: 4247 }, handler);