const handler = async (_req : Request):Promise<Response> => {
  return new Response("Server running on port 4243");
}
 
Deno.serve({port: 4243},  handler);