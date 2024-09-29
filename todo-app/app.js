const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000; 

// Serve static files from the 'files' folder under the '/files' route
app.use('/todos/files', express.static('files'));


// Example URL for accessing an image (through the load balancer)
const baseStaticUrl = `http://localhost:8081/files/image.jpg`;

const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'image.jpg');

// Check if the file already exists
const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false);
    return res(true);
  });
});

const saveAPicture = async () => {
  if (await fileAlreadyExists()) return;
  await new Promise(res => fs.mkdir(directory, { recursive: true }, (_err) => res()));
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' });
  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Array to hold todos
let todos = [];

// Serve HTML form and display todos
app.get('/todos', async (_req, res) => {
  const todosList = todos?.map(todo => `<li>${todo}</li>`).join('');
  try {
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
  } catch (error) {
    res.send(error);
  }
});

// Handle form submission to add a todo
app.post('/addtodo', (req, res) => {
  const newTodo = req.body.todo;
  if (newTodo) {
    todos.push(newTodo);
  }
  res.redirect('/todos'); // Corrected the redirection to '/todos'
});

// Start the server and save the image every hour
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  setInterval(async () => {
    await saveAPicture();
  }, 60 * 60 * 1000); // Save a picture every hour
});
