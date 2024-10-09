const express = require('express');
const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
const app = express();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000; 
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'image.jpg');
app.use('/todos', express.static('files'));
app.use(bodyParser.urlencoded({ extended: true }));

baseStaticUrl = `http://localhost:8081/todos/image.jpg`;

// Check if the file already exists//
const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false);
    return res(true);
  });
});

// Save a file and Delete the file if it already exists to force overwriting//
const saveAPicture = async () => {
   if (await fileAlreadyExists()) {
    await new Promise((res, rej) => {
      fs.unlink(filePath, (err) => {
        if (err) return rej(err);
        res();
      });
    });
  }
  // Ensure directory exists
  await new Promise(res => fs.mkdir(directory, { recursive: true }, (_err) => res()));
  // Fetch the image
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' });
  // Pipe the response stream to the file
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  // Return a promise that resolves when the file writing is complete
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Start the server and save the image every hour
app.listen(port, async () => {
  await saveAPicture()
  console.log(`Server started on port ${port}`);
  setInterval(async () => {
    await saveAPicture();
  }, 60*60*1000); 
});



// Serve HTML form and display todos
app.get('/todoapp', async (_req, res) => {
  try {
    // Fetch todos from the backend using fetch API
    let todosResponse = await fetch('http://todo-backend-svc:2345/todos');
    
    if (!todosResponse.ok) throw new Error('Failed to fetch todos');

    let todos = await todosResponse.json();
    const todosList = todos?.map(todo => `<li>${todo}</li>`).join('');

    res.send(`
      <html>
      <body>
      <h1>DevOps with Kubernetes Todo App!</h1>
      <img src=${baseStaticUrl} alt="random todo" width="500" height="600"> 
      <form action="http://todo-backend-svc:2345/addtodo" method="POST">
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
    res.send(`Error: ${error.message}`);
  }
});