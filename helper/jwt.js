const dotenv = require('dotenv');
const jwtSimple = require('jwt-simple');

dotenv.config();

const { SECRET_KEY, TIME_EXPRIED_JWT_SHORT, TIME_EXPRIED_JWT_LONG } = process.env;

/**
 * Tạo ra 2 jwt token
 * 1 jwt ngắn 5p
 * 1 jwt dài 30 days
 */
class JWT {
  encode(data) {
    const dataWithTime = (timeExpried) => Object.assign(data, { expired: new Date().getTime() + Number(timeExpried) });
    const shortJWT = jwtSimple.encode(dataWithTime(TIME_EXPRIED_JWT_SHORT), SECRET_KEY, 'HS256');
    const longJWT = jwtSimple.encode(dataWithTime(TIME_EXPRIED_JWT_LONG), SECRET_KEY, 'HS256');

    return {
      shortJWT,
      longJWT
    }
  }

  decode(token) {
    const jwtDecode = jwtSimple.decode(token, SECRET_KEY, false, 'HS256');
    return jwtDecode;
  }
}

const jwt = new JWT();

module.exports = { jwt };