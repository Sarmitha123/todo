const express = require('express');
const app = express();
const port = 5000;

// ===== Middleware =====
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-data if needed

// ===== Local data (no DB) =====
let todos = [
  { id: 1, task: "Learn Express", done: false },
  { id: 2, task: "Practice Postman", done: false }
];

// ===== Root route =====
app.get('/', (req, res) => {
  res.send('✅ ToDo API is running');
});

// ===== GET all todos =====
app.get('/todos', (req, res) => {
  res.json(todos);
});

// ===== POST new todo or multiple todos =====
app.post('/todos', (req, res) => {
  // Check if body is an array (batch) or a single object
  if (Array.isArray(req.body)) {
    const todosToAdd = req.body;

    // Validate each todo has a task
    for (const todo of todosToAdd) {
      if (!todo.task) {
        return res.status(400).json({ error: "Each todo must have a 'task' property" });
      }
    }

    const startingId = todos.length ? todos[todos.length - 1].id + 1 : 1;

    const newTodos = todosToAdd.map((todo, index) => ({
      id: startingId + index,
      task: todo.task,
      done: false,
    }));

    todos = todos.concat(newTodos);
    return res.status(201).json(newTodos);
  }

  // Single todo case
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    task,
    done: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ===== DELETE todo by ID =====
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(index, 1);
  res.json({ message: `Todo with id ${id} deleted` });
});

// ===== Start server =====
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
