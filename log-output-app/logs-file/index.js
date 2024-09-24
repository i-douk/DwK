const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3001;

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'logs.txt');


const getFile = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return console.log('FAILED TO READ FILE', '----------------', err);
    const jsonString = buffer.toString('utf-8');
    res(jsonString)
  })
})

app.get('/', async (_req, res) => {
     let readingOfFile = await getFile()
    res.status(200).send(readingOfFile)
  })
  
  app.listen(port, () => {
      console.log(`Server started in port  ${port}`)
  })

