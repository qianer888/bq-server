require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyparser = require("body-parser");

const { sequelize } = require("./models");
const routes = require("./routes/index");

const PORT = process.env.SERVER_PORT || 3000;

// 创建&启动服务
const app = express();
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    `✨✨ THE WEB SERVICE SUCCESSFULLY AND LISTENING TO THE PORT：${PORT}!`
  );
});

// 同步数据库
sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// 中间件
// if (open) {
//   app.use((req, res, next) => {
//     let origin = req.headers.origin || req.headers.referer || "";
//     origin = origin.replace(/\/$/g, "");
//     origin = !safeList.includes(origin) ? "" : origin;
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET,POST,DELETE,HEAD,OPTIONS,PATCH,PUT"
//     );
//     res.header(
//       "Access-Control-Allow-Headers",
//       "DNT,authorzation,web-token,app-token,Authorization,Accept,Origin,Keep-Alive,User-Agent,X-Mx-ReqToken,X-Data-Type,X-Auth-Token,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-token"
//     );
//     res.header("Access-Control-Allow-Credentials", true);
//     req.method === "OPTIONS" ? res.send() : next();
//   });
// }

// simple route
app.get("/", (req, res) => {
  res.json("Welcome to 🍳 server application.");
});

app.use(bodyparser.urlencoded({ extended: false }));

// routes
for (const key in routes) {
  app.use(`/yq-api/${key}`, routes[key]);
}

function handleShutdown(signal) {
  console.log(`🔌🔌 Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("🔌🔌 Server closed.");
    // 关闭数据库
    sequelize
      .close()
      .then(() => {
        console.log("🔌🔌 closed db..");
        process.exit(0); // 正常退出
      })
      .catch((err) => {
        console.log("🔌🔌 Failed to close db: " + err.message);
        process.exit(1);
      });
  });

  // 超时未关闭，进行强制关闭
  setTimeout(() => {
    console.error("🔌🔌 Forcing server shutdown.");
    process.exit(1);
  }, 5000);
}

// 服务关闭
process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

// 静态页面&404
app.use(express.static("./static"));
app.use((_, res) => {
  res.status(404);
  res.send();
});
