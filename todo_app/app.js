
const express = require('express')
const app = express()
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('DevOps with Kubernetes!')
})

app.listen(port, () => {
  console.log(`Server started in port  ${port}`)
})
