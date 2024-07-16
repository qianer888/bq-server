const { DataTypes } = require("sequelize");

module.exports = (sequelize, _) => {
  const Task = sequelize.define(
    "Task",
    {
      // 主键
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // 任务名称
      taskName: {
        type: DataTypes.CHAR,
        field: "task_name",
      },
      // 任务状态 1未完成 2已完成
      taskState: {
        type: DataTypes.INTEGER,
        field: "task_state",
      },
      // 预计完成时间
      completeTime: {
        type: DataTypes.DATE,
        field: "complete_time",
      },
      // 实际完成时间
      actualCompleteTime: {
        type: DataTypes.DATE,
        field: "actual_complete_time",
      },
      // 创建时间
      createTime: {
        type: DataTypes.DATE,
        field: "create_time",
      },
      // 修改时间
      updateTime: {
        type: DataTypes.DATE,
        field: "update_time",
      },
    },
    {
      tableName: "task_table", // 指定表名
      timestamps: false, // 禁用默认的时间戳管理（createdAt 和 updatedAt）
      freezeTableName: true, // 禁用表名自动复数化
    }
  );

  return Task;
};
