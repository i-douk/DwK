import * as uuid from "jsr:@std/uuid";

const handler = (_req: Request): Response => {
  let timer: number;
  const randomString = uuid.v1.generate() 
  const body = new ReadableStream({
    async start(controller) {
      timer = setInterval(() => {
        controller.enqueue(new Date().toISOString() + ": " + randomString + '\n')
        console.log(new Date().toISOString() + ": " + randomString)
      }, 4000);
    },
    cancel() {
      clearInterval(timer);
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream() ), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
};

Deno.serve({ port: 4242}, handler);
