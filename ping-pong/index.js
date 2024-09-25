const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

let count = 0;
const counter = () => {
    return ++count;
}

app.get('/pingpong', (_req, res) => {
    res.status(200).send(`pong ${counter()}`);
});
  
  app.listen(port, () => {
      console.log(`Server started in port  ${port}`)
      console.log(`Ping/Pong : ${counter()}`)
  })