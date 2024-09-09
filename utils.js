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

// 长度在8位及以上的字母，数字，特殊字符组合
const validPasswd = function validPasswd(str) {
  const reg =
    /^(?![A-Za-z0-9]+$)(?![a-z0-9\W_]+$)(?![A-Za-z\W_]+$)(?![A-Z0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/;

  return reg.test(str);
};

module.exports = {
  isPlainObject,
  filter,
  delay,
  nowTimeFn,
  validPasswd,
};
