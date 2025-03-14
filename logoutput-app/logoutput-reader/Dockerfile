FROM denoland/deno:2.1.7

EXPOSE 4242

WORKDIR /app

# Intended to fix the permission issue.
RUN mkdir -p /usr/src/app/files && chmod -R 777 /usr/src/app/files

# Prefer not to run as root.
USER root


# Copy application files.
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

# Run the app (fetches the stream from the first app).
CMD ["deno", "run", "--allow-net", "--allow-read", "main.ts"]