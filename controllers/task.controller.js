const db = require("../models");
const logger = require("../config/logger");
const responsePublic = require("../config/responsePublic");
const sequelize = db.sequelize;
const Task = db.task;

/**
 * 获取任务列表
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

    responsePublic.success(res, {
      data: {
        pageNo,
        pageSize,
        total: list.length,
        list,
      },
    });
  } catch (error) {
    responsePublic.error(res, { message: error.message });
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

  try {
    let body = {
      taskName,
      taskState: 1,
      completeTime,
      actualCompleteTime: null,
      createTime: now.getTime(),
      updateTime: null,
    };

    const data = await Task.create(body);

    responsePublic.success(res, { data: data.id });
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

/**
 * 删除任务
 * @param {int} id 任务id
 */
async function removeTask(req, res) {
  let { id } = req.query;
  try {
    const num = await Task.destroy({
      where: { id: id },
    });

    if (num !== 1)
      throw Error(
        `Cannot delete Task with id=${id}. Maybe Task was not found!`
      );

    responsePublic.success(res);
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

/**
 * 完成任务
 * @param {int} id 任务id
 */
async function completeTask(req, res) {
  let { id } = req.query;
  let now = new Date();

  try {
    const num = await Task.update(
      {
        taskState: 2,
        actualCompleteTime: now.getTime(),
        updateTime: now.getTime(),
      },
      {
        where: { id: id },
      }
    );
    if (num !== 1) throw Error(`Cannot update Task with id=${id}.`);

    responsePublic.success(res);
  } catch (error) {
    responsePublic.error(res, { message: error.message });
  }
}

module.exports = {
  getTaskList,
  addTask,
  removeTask,
  completeTask,
};
