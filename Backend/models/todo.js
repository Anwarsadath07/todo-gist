const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending',
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  updated_date: {
    type: Date,
  },
});


const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

module.exports = Todo;
