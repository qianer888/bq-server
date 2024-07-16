module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  pool: {
    max: 20, // 最大连接数
    min: 0, // 最小连接数
    acquire: 30000,
    idle: 10000, // 连接在释放之前的最长空闲时间（毫秒）
  },
};
