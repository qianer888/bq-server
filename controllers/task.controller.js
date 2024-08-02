const db = require("../models");
const { logger } = require("../config/logger");
const sequelize = db.sequelize;
const Task = db.task;
const { responsePublic } = require("../utils");

/**
 * TODO: 获取任务列表
 * @param {int} pageSize 每页大小
 * @param {int} pageNo 当前页数
 * @param {int} state 任务状态 1未完成 2已完成
 */
async function getTaskList(req, res) {
  let { state = 0 } = req.query;
  let pageNo = parseInt(req.query.pageNo) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  // 计算 offset
  const offset = (pageNo - 1) * pageSize;
  try {
    // 查询总记录数
    // const total = await Task.count();
    let list = [];
    let where = {};
    if (state) where.taskState = state;

    list = await Task.findAll({
      attributes: [
        "id",
        "taskName",
        [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("complete_time"),
            "%Y-%m-%d %H:%i:%s"
          ),
          "completeTime",
        ],
        [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("actual_complete_time"),
            "%Y-%m-%d %H:%i:%s"
          ),
          "actualCompleteTime",
        ],
      ],
      limit: pageSize,
      offset: offset,
      where: where,
    });

    responsePublic(res, true, {
      pageNo,
      pageSize,
      total: list.length,
      list,
    });
  } catch (err) {
    responsePublic(res, false, null, err.message);
  }
}

/**
 * 新增任务
 * @param {varchar} taskName 任务描述
 * @param {timestamp} completeTime 预计完成时间
 */
async function addTask(req, res) {
  let { taskName, completeTime } = req.body;
  let now = new Date();

  let body = {
    taskName,
    taskState: 1,
    completeTime,
    actualCompleteTime: null,
    createTime: now.getTime(),
    updateTime: null,
  };

  Task.create(body)
    .then((data) => {
      logger.info(data, ": addTask - data");
      responsePublic(res, true, data.id);
    })
    .catch((err) => {
      responsePublic(res, false, null, err.message);
    });
}

/**
 * 删除任务
 * @param {int} id 任务id
 */
async function removeTask(req, res) {
  let { id } = req.query;
  Task.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        responsePublic(res, true);
      } else {
        responsePublic(
          res,
          false,
          null,
          `Cannot delete Task with id=${id}. Maybe Task was not found!`
        );
      }
    })
    .catch((err) => {
      responsePublic(res, false, null, err.message);
    });
}

/**
 * 完成任务
 * @param {int} id 任务id
 */
async function completeTask(req, res) {
  let { id } = req.query;
  let now = new Date();

  Task.update(
    {
      taskState: 2,
      actualCompleteTime: now.getTime(),
      updateTime: now.getTime(),
    },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        responsePublic(res, true);
      } else {
        responsePublic(res, false, null, `Cannot update Task with id=${id}.`);
      }
    })
    .catch((err) => {
      responsePublic(res, false, null, err.message);
    });
}

module.exports = {
  getTaskList,
  addTask,
  removeTask,
  completeTask,
};
