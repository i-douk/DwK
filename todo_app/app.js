
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('DevOps with Kubernetes!')
})

app.listen(port, () => {
  console.log(`Server started in port  ${port}`)
})
