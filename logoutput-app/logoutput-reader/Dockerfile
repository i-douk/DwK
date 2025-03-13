FROM denoland/deno:2.1.7

EXPOSE 4242

WORKDIR /app

# Prefer not to run as root.
USER deno


# Copy application files.
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

# Run the app (fetches the stream from the first app).
CMD ["deno", "run", "--allow-net", "--allow-read", "main.ts"]