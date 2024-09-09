const { verifyAccessToken } = require("../config/jwtToken");
const apis = require("../config/whiteList");

/**
 * 统一token验证
 */
function authenticateToken(req, res, next) {
  // 有/p/ 或者 在白名单通过不验证
  if (req.url.indexOf("/p/") !== -1 || apis.indexOf(req.url) !== -1)
    return next();

  // 验证token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  verifyAccessToken(token, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

module.exports = {
  authenticateToken,
};
