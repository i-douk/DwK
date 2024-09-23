
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.get('/hellokube', (_req, res) => {
  res.send('DevOps with Kubernetes Todo App!')
})

app.listen(port, () => {
  console.log(`Server started in port  ${port}`)
})
