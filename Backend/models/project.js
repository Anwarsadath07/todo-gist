
const mongoose = require('mongoose');
const Todo = require('./todo');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_date: { type: Date, default: Date.now },
  todos: { type: [Todo.schema],}, 
});

module.exports = mongoose.model('Project', ProjectSchema);
