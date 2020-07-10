function getCurrentTime() {
  var keep = '';
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  var rand = Math.round(Math.random() * 899 + 100);
  keep = y + '' + m + '' + d + '' + h + '' + f + '' + s;
  return keep; //20160614134947
}

function objLength(input) {
  var type = toString(input);
  var length = 0;
  if (type != "[object Object]") {
    //throw "输入必须为对象{}！"
  } else {
    for (var key in input) {
      if (key != "number") {
        length++;
      }

    }
  }
  return length;
}
//验证是否是手机号码
function vailPhone(number) {
  let flag = false;
  let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (number.length != 11) {
    flag = flag;
  } else if (!myreg.test(number)) {
    flag = flag;
  } else {
    flag = true;
  }
  return flag;
}


// 遍历对象属性和值
function displayProp(obj) {
  var names = "";
  for (var name in obj) {
    names += name + obj[name];
  }
  return names;
}
// 去除字符串所有空格
function sTrim(text) {
  return text.replace(/\s/ig, '')
}
//去除所有:
function replaceMaohao(txt) {
  return txt.replace(/\:/ig, '')
}

// 判断一个数组是否存在某一个值;并返回索引
function inArray(cur, arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] == cur) return i;
  }
  return -1;
}

// 路由栈层级
function routingStack() {
  let routes = getCurrentPages();
  if (routes.length >= 4) {
    return 'redirect'
  } else {
    return 'navigate'
  }
}

// 防止快速点击带来的二次跳转
let isFast = true;

function xhNavigateTo(url, openType = "") {
  if (isFast) {
    isFast = false;
    if (openType == 'redirect') {
      uni.redirectTo({
        url: url
      });
    }else{
      uni.navigateTo({
        url: url
      });
    }
    setTimeout(() => {
      isFast = true;
    }, 500)
  }
}

module.exports = {
  getCurrentTime: getCurrentTime,
  objLength: objLength,
  displayProp: displayProp,
  sTrim: sTrim,
  replaceMaohao: replaceMaohao,
  vailPhone: vailPhone,
  inArray: inArray,
  routingStack: routingStack,
  xhNavigateTo: xhNavigateTo
}
