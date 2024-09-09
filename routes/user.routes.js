const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

// 获取用户信息
router.get("/getUserInfo", user.getUserInfo);

// 修改用户信息
router.get("/updateUserInfo", user.updateUserInfo);

module.exports = router;
