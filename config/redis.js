const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1", // Redis 服务器地址
  port: 6379, // Redis 服务器端口
  password: "", // 如果有设置密码，请在此处填写
  db: 0, // 选择 Redis 数据库
});

module.exports = redis;
