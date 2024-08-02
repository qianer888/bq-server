// 检测是否为纯粹对象
const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor;
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]")
    return false;
  proto = Object.getPrototypeOf(obj);
  if (!proto) return true;
  Ctor = proto.hasOwnProperty("constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor === Object;
};

// JSON数据转换
const filter = function filter(data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = [];
  }
  return data;
};
// 延迟函数
const delay = function delay(interval) {
  typeof interval !== "number" ? (interval = 1000) : null;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

// 获取当前日期
const zero = (val) => {
  val = +val;
  return val < 10 ? "0" + val : val;
};

const nowTimeFn = function nowTimeFn() {
  let time = new Date(),
    year = time.getFullYear(),
    month = time.getMonth() + 1,
    day = time.getDate(),
    hours = time.getHours(),
    minutes = time.getMinutes(),
    seconds = time.getSeconds();
  return `${year}-${zero(month)}-${zero(day)} ${zero(hours)}:${zero(
    minutes
  )}:${zero(seconds)}`;
};

/**
 *
 * @param {*} res response结果集
 * @param {*} flag 0 - 成功；1 - 失败
 * @param {*} data 返回数据
 * @param {*} msg 成功/失败信息
 */
const responsePublic = function responsePublic(
  res,
  flag = true,
  data = null,
  msg = ""
) {
  const options = {
    code: flag ? 0 : 1,
    data,
    codeText: flag ? "SUCCESS" : "ERROR",
    message: msg ? msg : flag ? "操作成功" : "操作失败",
  };
  res.send(options);
};

module.exports = {
  isPlainObject,
  filter,
  delay,
  nowTimeFn,
  responsePublic,
};
