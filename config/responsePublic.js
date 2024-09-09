const logger = require("./logger");

const responseType = ["error", "success"];

const codeMap = {
  success: 0,
  error: 1,
};

const dafaultMessageMap = {
  success: "操作成功！",
  error: "操作失败！",
};

/**
 *
 * @param {*} res response结果集
 * @param {*} options 配置项
 * @param {*} options.type 0|sucess - 成功；1|error - 失败
 * @param {*} options.data 返回数据
 * @param {*} options.message 成功/失败信息
 */
const responsePublic = (res, options = {}) => {
  if (!res) return logger.error("response为必填参数！");

  const { type = "success", data = null, message = "" } = options;

  options = {
    code: codeMap[type],
    data,
    codeText: type.toUpperCase(),
    message: message ? message : dafaultMessageMap[type],
  };

  res.send(options);
};

responseType.forEach((type) => {
  responsePublic[type] = (res, options = {}) => {
    return responsePublic(res, { type, ...options });
  };
});

module.exports = responsePublic;
