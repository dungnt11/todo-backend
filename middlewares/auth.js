const { jwt } = require('../helper/jwt');
const JWTModel = require('../models/jwt');

async function authMiddleware(ctx, next) {
  const jwtHeader = ctx.headers.jwt;
  if (!jwtHeader) ctx.throw(401);
  try {
    const jwtDecode = jwt.decode(jwtHeader);
    const expired = Number(jwtDecode.expired);
    const username = jwtDecode.username;
    if (expired < new Date().getTime()) {
      const userDB = await JWTModel.findOne({ username });
      if (!userDB) ctx.throw(404);
      const jwtLong = jwt.decode(userDB.longJWT);
      if (jwtLong.expired < new Date().getTime()) {
        // Loutout lại
        ctx.throw(401);
      } else {
        // Get new jwt
        const dataEncode = jwt.encode({ username });
        ctx.body = {
          isRefreshToken: true,
          token: dataEncode.shortJWT,
        }
        return;
      }
    }
    ctx.state.username = username;
    return next();
  } catch (error) {
    ctx.throw(401);
  }
}

module.exports = { authMiddleware };