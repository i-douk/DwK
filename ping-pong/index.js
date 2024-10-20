const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
// const path = require('path');
// const fs = require('fs');

// const directory = path.join('/', 'usr', 'src', 'app', 'files');
// const filePath = path.join(directory, 'logs-persistent.txt');

// Save output logs to file
// const saveToFile = async () => {
    
    //     fs.appendFile(filePath, `Ping / Pong : ${count} ` , (err) => {
        //         if (err) throw err;
        //         console.log('Output from second pod appended to the log file!');
        //     });
        //   }
let count = 0;

const counter = () => {
      return ++count;
    }
     
app.get('/pingpong',  (_req, res) => {
    counter();
    // await saveToFile();
    res.status(200).send(`Ping / Pong ${count}`);
});
app.get('/pingponglog',  (_req, res) => {
    res.status(200).send(`Ping / Pong ${count}`);
});
  
  app.listen(port, () => {
      console.log(`Server started in port  ${port}`)
  })