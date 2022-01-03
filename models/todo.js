const { model, Schema } = require('mongoose');

const todoSchema = new Schema({
  title: String,
  checked: Boolean,
  id: String,
}, { _id : false });

const TodosSchema = new Schema(
  {
    username: String,
    todos: [todoSchema],
  },
  { timestamps: true },
);

module.exports = model('todo', TodosSchema);
