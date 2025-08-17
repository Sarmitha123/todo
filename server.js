const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sarmisarmitha265:Sarmi%40123@cluster0.dfvq4vc.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Todo Model
const Todo = mongoose.model("Todo", todoSchema);

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = new Todo({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
