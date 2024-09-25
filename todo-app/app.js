
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
// Array to hold todos
let todos = [];
// Serve HTML form and display todos
app.get('/hellokube', (_req, res) => {
  const todosList = todos?.map(todo => `<li>${todo}</li>`).join('');
  res.send(`
    <html>
      <body>
        <h1>DevOps with Kubernetes Todo App!</h1>
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
  res.redirect('/hellokube');
});

app.listen(port, () => {
  console.log(`Server started in port  ${port}`)
})
