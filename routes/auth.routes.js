const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

// 获取图形验证码
router.get("/p/verifyCode", auth.verifyCode);

// 注册
router.post("/register", auth.register);

// 登录
router.post("/login", auth.login);

// 修改密码
router.post("/updatePasswd", auth.updatePasswd);

module.exports = router;
