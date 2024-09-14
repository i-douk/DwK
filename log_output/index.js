const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');

const getHashNow = () => {
    const randomString = uuidv4();
    setInterval(() => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}: ${randomString}`);
      }, 5000);
  }

  let consoleOutput = [];
  const originalLog = console.log;
  console.log = function(message) {
    consoleOutput.push(message);
    originalLog.apply(console, arguments); 
  };

app.get('/', (_req, res) => {
    const currentOutputIndex = consoleOutput.length
    res.send(consoleOutput[currentOutputIndex-1])
  })
  
  app.listen(port, () => {
      console.log(`Server started in port  ${port}`)
      getHashNow()
  })