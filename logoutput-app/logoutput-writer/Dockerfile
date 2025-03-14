FROM denoland/deno:2.1.7

WORKDIR /app

# Intended to fix the permission issue.
RUN mkdir -p /usr/src/app/files && chmod -R 777 /usr/src/app/files

USER root

COPY . .

RUN deno cache main.ts

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "main.ts"]