const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001; 

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Array to hold todos
let todos = [];

// Serve HTML form and display todos
app.get('/api/todos', async (_req, res) => {
  try {
    res.status(200).json(
        todos.map(todo => ({
          todo: todo
        })))
  } catch (error) {
    res.send(error);
  }
});

// Handle form submission to add a todo
app.post('/api/addtodo', (req, res) => {
  const newTodo = req.body.todo;
  if (newTodo) {
    todos.push(newTodo);
  }
  res.status(200);
});

// Start the server and save the image every hour
app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
});
