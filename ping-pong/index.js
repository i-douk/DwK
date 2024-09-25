const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3001;

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'logs-persistent.txt');
let count = 0;
const counter = () => {
    return ++count;
}

// Save output logs to file
const saveToFile = async () => {
  
    fs.appendFile(filePath, `Ping / Pong : ${counter}` , (err) => {
        if (err) throw err;
        console.log('Output from second pod appended to the log file!');
    });
  }

app.get('/pingpong', async (_req, res) => {
    await saveToFile()
    res.status(200).send(`pong ${counter()}`);
});
  
  app.listen(port, () => {
      console.log(`Server started in port  ${port}`)
      console.log(`Ping/Pong : ${counter()}`)
  })