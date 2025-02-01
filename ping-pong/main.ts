let count = 0;
const handler = async (_req : Request):Promise<Response> => {
  return new Response(`ping ${count++}`);
}
 
Deno.serve({port: 4245},  handler);