import * as uuid from "jsr:@std/uuid";

const logDir = '/usr/src/app/files';
const logFilePath = `${logDir}/stream.log`;
const openFile = await Deno.open(logFilePath, { write: true, create: true, append: true });
const randomString = uuid.v1.generate();
const encoder = new TextEncoder();

let timer: number;

const generateLogs = () => {
  timer = setInterval(async () => {
    const logEntry = new Date().toISOString() + ": " + randomString + "\n";
    const writer = openFile.writable.getWriter();
    try {
      await writer.write(encoder.encode(logEntry));
      await writer.close();
      openFile.close();
    } catch (error) {
      console.error("Failed to write log entry:", error);
    }
  }, 5000);
};
generateLogs();
