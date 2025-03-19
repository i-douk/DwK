import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

export const sql = new Client({
    user: "postgres",
    database: "postgres",
    hostname: "postgres-svc.log-pingpong-ns.svc.cluster.local:5432",
    port: 5432,
  });

await sql.connect();