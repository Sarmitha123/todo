const { Schema, model } = require('mongoose');

const todoSchema = new Schema({
  task: {
    type: String,
    required: [true, 'Task is required'],
  },
  done: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Todo = model('Todo', todoSchema);

module.exports = Todo;
