import * as uuid from "jsr:@std/uuid";

const logDir = "/usr/src/app/files";
const logFilePath = `${logDir}/logs.txt`;
const encoder = new TextEncoder();
const randomString = uuid.v1.generate();

const generateLogs = () => {
  setInterval(async () => {
    const logEntry = new Date().toISOString() + ": " + randomString + "\n";
    try {
      const file = await Deno.open(logFilePath, { write: true, truncate: true, create: true });
      const writer = file.writable.getWriter();
      await writer.write(encoder.encode(logEntry));
      await writer.close();
    } catch (error) {
      console.error("Failed to write log entry:", error);
    }
  }, 5000);
};

generateLogs();