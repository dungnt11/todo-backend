const { model, Schema } = require('mongoose');

const JwtSchema = new Schema(
  {
    longJWT: String,
    username: String,
  },
  { timestamps: true },
);

module.exports = model('jwt', JwtSchema);
