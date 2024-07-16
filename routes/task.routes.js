const express = require("express");
const router = express.Router();
const task = require("../controllers/task.controller");

// 获取任务列表（分页）
router.get("/getTaskList", task.getTaskList);

// 新增任务
router.post("/addTask", task.addTask);

// 移除任务
router.get("/removeTask", task.removeTask);

// 完成任务
router.get("/completeTask", task.completeTask);

module.exports = router;
