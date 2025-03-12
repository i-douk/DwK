import * as uuid from "jsr:@std/uuid";

const logDir = `${Deno.cwd()}/logs`;
const logFilePath = `${logDir}/stream.log`;

await Deno.mkdir(logDir, { recursive: true });

const randomString = uuid.v1.generate();
const encoder = new TextEncoder();

const logFile = await Deno.open(logFilePath, { write: true, create: true, append: true });

let timer: number;

const generateLogs = () => {
  timer = setInterval(async () => {
    const logEntry = new Date().toISOString() + ": " + randomString + "\n";

    console.log(logEntry);

    await logFile.write(encoder.encode(logEntry));
  }, 5000);
};
generateLogs();

setTimeout(() => {
  clearInterval(timer);
  logFile.close();
  console.log("Logging stopped and file closed.");
}, 60000); 
