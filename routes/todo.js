const Router = require('koa-router');
const TodoModel = require('../models/todo');

const { authMiddleware } = require('../middlewares/auth');

const router = new Router();

router.get('/api/todos', authMiddleware, async (ctx) => {
  const username = ctx.state.username;
  if (!username) ctx.throw(404);
  const todosDB = await TodoModel.find({ username });
  ctx.body = todosDB;
});

router.post('/api/todo', authMiddleware, async (ctx) => {
  const username = ctx.state.username;
  if (!username) ctx.throw(404);
  const { todos } = ctx.request.body;

  const todosModelOld = await TodoModel.findOne({ username }).select(['todos']).lean();
  if (!todosModelOld) {
    const todoDB = new TodoModel({
      username,
      todos,
    });

    const todoDBSaved = await todoDB.save();
    ctx.body = todoDBSaved;
  } else {
    const todoDB = await TodoModel.findOneAndUpdate({ username }, {
      todos: todosModelOld.todos.concat(todos),
    }, { upsert: true });
  
    ctx.body = todoDB;
  }
});

module.exports = router;