const Koa = require('koa');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
// Routes
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');

const app = new Koa();
dotenv.config();

const { PORT, MONGO_CONNECTSTRING } = process.env;

app.use(bodyParser());
app.use(userRouter.routes());
app.use(todoRouter.routes());

app.listen(PORT, () => {
  mongoose.connect(MONGO_CONNECTSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Server running on http://localhost:${PORT}`);
})