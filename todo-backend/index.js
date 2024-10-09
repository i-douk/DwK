const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Array to hold todos
let todos = [];

// API endpoint to fetch all todos
app.get('/todos', (_req, res) => {
  res.json(todos);
});

// API endpoint to add a new todo
app.post('/addtodo', (req, res) => {
  const newTodo = req.body.todo;
  if (newTodo) {
    todos.push(newTodo);
  }
  res.status(201).json({ message: 'Todo added successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Todo app API started on port ${port}`);
});
