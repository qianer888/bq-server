const taskModel = require("../models/taskModel");
const { responsePublic, nowTimeFn } = require("../utils");

/**
 * TODO: 获取任务列表
 * @param {int} pageSize 每页大小
 * @param {int} pageNo 当前页数
 * @param {int} state 任务状态 1未完成 2已完成
 */
async function getTaskList(req, res) {
  let tasks = await taskModel.queryTask();
  let { pageSize = 20, pageNo = 1, state = 0 } = req.query;
  tasks.reverse();
  if (+state !== 0)
    tasks = tasks.filter((item) => +item["task_state"] === +state);

  let total = tasks.length,
    pageNum = Math.ceil(total / pageSize),
    list = [];

  if (pageNo <= pageNum) {
    for (let i = (pageNo - 1) * pageSize; i <= pageNo * pageSize - 1; i++) {
      let item = tasks[i];
      if (!item) break;
      list.push({
        id: +item["id"],
        taskName: item["task_name"],
        taskState: item["task_state"],
        createTime: item["create_time"],
        completeTime: item["complete_time"],
        actualCompleteTime: item["actual_complete_time"] || "",
      });
    }
  }
  responsePublic(res, true, {
    pageNo,
    pageSize,
    total,
    list,
  });
}

/**
 * 新增任务
 * @param {varchar} taskName 任务描述
 * @param {datetime} complateTime 预计完成时间
 */
async function addTask(req, res) {
  let { taskName, complateTime } = req.body;
  let nowTime = nowTimeFn();
  let body = [taskName, 1, complateTime, null, null, nowTime];
  try {
    await taskModel.insertTask(...body);
    responsePublic(res, true);
  } catch (error) {
    console.error("Error create task:", error);
    responsePublic(res, false, { message: error });
  }
}

/**
 * 删除任务
 * @param {int} id 任务id
 */
async function removeTask(req, res) {
  let { id } = req.query;
  try {
    await taskModel.deleteTask(id);
    responsePublic(res, true);
  } catch (error) {
    responsePublic(res, false, { message: error });
  }
}

/**
 * 完成任务
 * @param {int} id 任务id
 */
async function completeTask(req, res) {
  let { id } = req.query;
  let nowTime = nowTimeFn();
  let params = [id, 2, nowTime, nowTime];
  try {
    await taskModel.updateTaskTime(...params);
    responsePublic(res, true);
  } catch (error) {
    responsePublic(res, false, { message: error });
  }
}

module.exports = {
  getTaskList,
  addTask,
  removeTask,
  completeTask,
};
