const { DataTypes } = require("sequelize");

module.exports = (sequelize, _) => {
  const User = sequelize.define(
    "User",
    {
      // 主键
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // 账号
      account: {
        type: DataTypes.CHAR,
        field: "account",
      },
      // 姓名
      userName: {
        type: DataTypes.CHAR,
        field: "user_name",
      },
      // 密码
      password: {
        type: DataTypes.CHAR,
        field: "password",
      },
      // 角色 1-admin 0-user
      role: {
        type: DataTypes.CHAR,
        field: "role",
      },
      // 手机号
      phone: {
        type: DataTypes.CHAR,
        field: "phone",
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
      tableName: "user_table", // 指定表名
      timestamps: false, // 禁用默认的时间戳管理（createdAt 和 updatedAt）
      freezeTableName: true, // 禁用表名自动复数化
    }
  );

  return User;
};
