const db = require("../models");
const logger = require("../config/logger");
const responsePublic = require("../config/responsePublic");
const User = db.user;

/**
 * 获取用户
 */
async function getUserInfo(req, res) {
  const { account } = req.user;
  try {
    const { userName, role, phone, createTime, updateTime } =
      await User.findOne({ where: { account } });

    responsePublic.success(res, {
      data: { account, userName, role, phone, createTime, updateTime },
    });
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

/**
 * 修改用户基本信息
 * @param {varchar} userName 用户名
 * @param {varchar} phone 手机号
 */
async function updateUserInfo(req, res) {
  const { userName, phone } = req.body;
  const { account } = req.user;
  try {
    const num = await User.update(
      { userName, phone, updateTime: now.getTime() },
      { where: { account } }
    );

    if (num !== 1) throw Error(`Cannot update info with ${account}`);

    responsePublic.success(res);
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

module.exports = {
  getUserInfo,
  updateUserInfo,
};
