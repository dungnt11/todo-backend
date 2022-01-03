const Router = require('koa-router');
const { jwt } = require('../helper/jwt');
const JWTModel = require('../models/jwt');
const UserModel = require('../models/user');

const router = new Router();

router.post('/api/register', async (ctx) => {
  const { username, password } = ctx.request.body;
  const dataEncode = jwt.encode({ username });
  const userDB = new UserModel({
    username,
    password,
  });
  await userDB.save();

  const jwtOld = await JWTModel.findOne({ username });
  if (jwtOld) {
    await JWTModel.findOneAndUpdate({ username }, { longJWT: dataEncode.longJWT });
  } else {
    const newJWTData = new JWTModel({
      longJWT: dataEncode.longJWT,
      username,
    });
    await newJWTData.save();
  }

  ctx.set('jwt', dataEncode.shortJWT);
  ctx.body = { msg: 1 };
});

router.post('/api/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  const userDB = await UserModel.findOne({ username });
  const isMatch = await (async () => {
    return new Promise((resolve, reject) => {
      userDB.comparePassword(password, function(err, isMatch) {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
  })();

  if (isMatch) {
    const dataEncode = jwt.encode({ username });
    ctx.set('jwt', dataEncode.shortJWT);
    ctx.body = { msg: 1 };
  } else {
    ctx.throw(404);
  }
});

module.exports = router;