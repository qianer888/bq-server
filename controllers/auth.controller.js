const db = require("../models");
const redis = require("../config/redis");
const logger = require("../config/logger");
const responsePublic = require("../config/responsePublic");
const captcha = require("../config/verifyCode");
const { generateAccessToken } = require("../config/jwtToken");
const { validPasswd } = require("../utils");
const User = db.user;

/**
 * 登录
 * @param {varchar} account 账号
 * @param {varchar} password 密码
 * @param {varchar} verificationCode 验证码
 * @param {varchar} verificationId 验证码id
 */
async function login(req, res) {
  let { account, password, verificationCode, verificationId } = req.body;

  try {
    const user = await User.findOne({ where: { account } });
    if (user === null) throw Error("账号不存在");

    if (!user.password === password) throw Error("用户名密码错误");

    const code = await redis.get(verificationId);

    logger.info(code, "code");

    if (code !== verificationCode) throw Error("验证码错误");

    const token = await generateAccessToken({ account });

    responsePublic.success(res, { data: { access_token: token } });
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

/**
 * 注册
 * @param {varchar} account 账号
 * @param {varchar} password 密码
 * @param {varchar} phone 手机号
 * @param {varchar} userName 用户名
 */
async function register(req, res) {
  let { account, password, phone, userName } = req.body;

  try {
    // has account
    const user = await User.findOne({ where: { account } });
    if (user) throw Error("账号已存在！");

    // valid password
    if (!validPasswd(password)) throw Error("密码强度弱，请重新输入！");

    let now = new Date();
    let body = {
      account,
      password,
      phone,
      userName,
      role: 0,
      createTime: now.getTime(),
      updateTime: null,
    };

    await User.create(body);

    responsePublic.success(res);
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

/**
 * 更新密码
 * @param {*} password 原密码
 * @param {*} newPassword 新密码
 */
async function updatePasswd(req, res) {
  let { account } = req.user;
  let { password, newPassword } = req.body;
  let now = new Date();

  try {
    const user = await User.findOne({ where: { account } });

    if (user.password !== password) throw Error("原密码不正确！");

    const num = await Task.update(
      { password: newPassword, updateTime: now.getTime() },
      { where: { account } }
    );

    if (num !== 1) throw Error(`Cannot update password with ${account}`);

    responsePublic.success(res);
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

async function resetPasswd(req, res) {}

/**
 * 获取验证码
 */
async function verifyCode(req, res) {
  let { text, data } = captcha();
  const timestamp = new Date().getTime();
  // await redis.set('mykey', 'some value', 'EX', 60);
  await redis.set(timestamp, text, "EX", 120);
  responsePublic.success(res, { data: { id: timestamp, data, text } });
}

module.exports = {
  login,
  register,
  updatePasswd,
  resetPasswd,
  verifyCode,
};
