const jwt = require("jsonwebtoken");

/** 生成 access token */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

/** 验证 access token */
function verifyAccessToken(token, fn) {
  return jwt.verify(token, process.env.TOKEN_SECRET, fn);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
