const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
app.use('/static', express.static(path.join(__dirname, 'files')));

const port = process.env.PORT || 3000;
const baseStaticUrl = 'http://localhost:/'+port+'/static';

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'image.jpg');

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const saveAPicture = async () => {
  if (await fileAlreadyExists()) return
  await new Promise(res => fs.mkdir(directory, (err) => res()));
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' });
  response.data.pipe(fs.createWriteStream(filePath));
}


// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
// Array to hold todos
let todos = [];
// Serve HTML form and display todos
app.get('/todos',  (_req, res) => {
  const todosList = todos?.map(todo => `<li>${todo}</li>`).join('');
  res.send(`
    <html>
    <body>
    <h1>DevOps with Kubernetes Todo App!</h1>
    <img src=${baseStaticUrl} alt="random todo" width="500" height="600"> 
    <form action="/addtodo" method="POST">
    <input type="text" name="todo" placeholder="Enter a new todo" required />
    <button type="submit">Add Todo</button>
    </form>
    <h2>Your Todos:</h2>
    <ul>
    ${todosList}
    </ul>
    </body>
    </html>
    `);
  });
  
  // Handle form submission to add a todo
  app.post('/addtodo', (req, res) => {
    const newTodo = req.body.todo;
    if (newTodo) {
      todos.push(newTodo);
    }
    res.redirect('/todoapp');
  });
  
  
  app.listen(port,  () => {
    console.log(`Server started in port  ${port}`)
    setInterval(async () => {await saveAPicture()}, 1000*60*60)
    console.log()
  })
  