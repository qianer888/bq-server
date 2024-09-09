require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyparser = require("body-parser");

/** logger **/
const logger = require("./config/logger");
/** db **/
const { sequelize } = require("./models");
/** route **/
const routes = require("./routes/index");
/** auth middleware **/
const { authenticateToken } = require("./middleware/auth");

const PORT = process.env.SERVER_PORT || 3000;

/** create & start up server **/
const app = express();
const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(
    `✨✨ THE WEB SERVICE SUCCESSFULLY AND LISTENING TO THE PORT：${PORT}!`
  );
});

/** sync db **/
sequelize
  .sync()
  .then(() => {
    logger.info("Synced db.");
  })
  .catch((err) => {
    logger.error("Failed to sync db: " + err.message);
  });

/** middleware **/
app.use(bodyparser.urlencoded({ extended: false }));
app.use(authenticateToken);

/** routes **/
for (const key in routes) {
  app.use(`/yq-api/${key}`, routes[key]);
}

/** simple route **/
app.get("/", (req, res) => {
  res.json("Welcome to 🍳 server application.");
});

function handleShutdown(signal) {
  logger.info(`📍 Received ${signal}. Closing server...`);
  server.close(() => {
    logger.info("📍 Server closed.");
    // 关闭数据库
    sequelize
      .close()
      .then(() => {
        logger.info("📍 DB closed.");
        process.exit(0); // 正常退出
      })
      .catch((err) => {
        logger.error("📍 Failed to close db: " + err.message);
        process.exit(1);
      });
  });

  // 超时未关闭，进行强制关闭
  setTimeout(() => {
    logger.error("📍 Forcing server shutdown.");
    process.exit(1);
  }, 5000);
}

/** server close **/
process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

/** static page & 404 **/
app.use(express.static("./static"));
app.use((_, res) => {
  res.status(404);
  res.send();
});
