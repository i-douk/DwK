const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'logs.txt');

//Generate Hash and output it every 5s with timestamp
const getHashNow = () => {
    const randomString = uuidv4();
    setInterval(() => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}: ${randomString}`);
      }, 5000);
  }

// Capture logs of the output from the console
  let consoleOutput = [];
  const originalLog = console.log;
  console.log = function(message) {
    consoleOutput.push(message);
    originalLog.apply(console, arguments);
  };


//Check if the file already exists
  const fileAlreadyExists = async () => new Promise(res => {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats) return res(false)
      return res(true)
    })
  })

// Save output logs to file
const saveAFile = async () => {
  try {
      if (!(await fileAlreadyExists())) {
          await new Promise((res, rej) => {
              fs.mkdir(directory, { recursive: true }, (err) => {
                  if (err) rej(err);
                  else res();
              });
          });
      }

      fs.writeFile(filePath, JSON.stringify(consoleOutput), (err) => {
          if (err) {
              console.error("Error writing to file", err);
          } else {
              console.log("File written successfully\n");
          }
      });
  } catch (error) {
      console.error("Error in saveAFile", error);
  }
}

// Periodically save logs to the file every 10 seconds
const saveLogsPeriodically = () => {
  setInterval(async () => {
      await saveAFile();
  }, 10000); 
}

  
  app.listen(port, async() => {
      
      console.log(`Server started in port  ${port}`)
      getHashNow()
      saveLogsPeriodically(); 
  })

