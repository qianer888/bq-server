const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // 是否等待连接
  connectionLimit: 20, // 连接池的最大连接数
  queueLimit: 500, // 队列的最大数量（0表示不限制）
});

console.log("Connected to the MySQL server.");

module.exports = pool;
