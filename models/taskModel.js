const { executeQuery } = require("./index");

// 查询任务
async function queryTask() {
  const query = "SELECT * FROM task_table";
  return executeQuery(query);
}

// 新增任务
async function insertTask(
  task_name,
  task_state,
  complete_time,
  actual_complete_time,
  update_time,
  create_time
) {
  const query =
    "INSERT INTO task_table (task_name, task_state, complete_time, actual_complete_time, update_time, create_time) VALUES (?,?,?,?,?,?)";
  const params = [
    task_name,
    task_state,
    complete_time,
    actual_complete_time,
    update_time,
    create_time,
  ];
  console.log(params, ">> insertTask - params");
  return executeQuery(query, params);
}

// 删除任务
async function deleteTask(id) {
  const query = "DELETE FROM task_table WHERE id = ?";
  const values = [id];

  return executeQuery(query, values);
}

// 更新任务完成时间
async function updateTaskTime(
  id,
  task_state,
  actual_complete_time,
  update_time
) {
  const query =
    "UPDATE task_table SET task_state = ?, actual_complete_time = ?, update_time = ? WHERE id = ?";
  const values = [task_state, actual_complete_time, update_time, id];

  return executeQuery(query, values);
}

module.exports = {
  queryTask,
  insertTask,
  deleteTask,
  updateTaskTime,
};
