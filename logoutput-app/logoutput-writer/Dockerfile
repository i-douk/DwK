FROM denoland/deno:2.1.7

WORKDIR /app

USER deno

COPY . .

RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]
