const express = require("express");
const http = require("http");
const bodyparser = require("body-parser");
const dbPool = require("./config/db");
const config = require("./package.json").config;
const port = config.port;
const { open, safeList } = config.cros;

const routes = require("./routes/index");

/*-创建&启动服务-*/
const app = express();
const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    `THE WEB SERVICE SUCCESSFULLY AND LISTENING TO THE PORT：${port}!`
  );
});

/*-中间件-*/
if (open) {
  app.use((req, res, next) => {
    let origin = req.headers.origin || req.headers.referer || "";
    origin = origin.replace(/\/$/g, "");
    origin = !safeList.includes(origin) ? "" : origin;
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,DELETE,HEAD,OPTIONS,PATCH,PUT"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "DNT,authorzation,web-token,app-token,Authorization,Accept,Origin,Keep-Alive,User-Agent,X-Mx-ReqToken,X-Data-Type,X-Auth-Token,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-token"
    );
    res.header("Access-Control-Allow-Credentials", true);
    req.method === "OPTIONS" ? res.send() : next();
  });
}

app.use(bodyparser.urlencoded({ extended: false }));

// 接口路由
for (const key in routes) {
  app.use(`/yq-api/${key}`, routes[key]);
}

function handleShutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);

  server.close(() => {
    console.log("Server closed.");
    // 如果有其他的清理操作，可以在这里进行
    dbPool.end((err) => {
      if (err) {
        console.error("Error closing the pool:", err);
        return;
      }
      console.log("The pool is closed.");
    });

    process.exit(0); // 正常退出
  });

  setTimeout(() => {
    console.error("Forcing server shutdown.");
    process.exit(1);
  }, 5000);
}

/*-服务关闭-*/
process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

/*-静态页面&404-*/
app.use(express.static("./static"));
app.use((_, res) => {
  res.status(404);
  res.send();
});
