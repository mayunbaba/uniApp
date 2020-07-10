import md5 from 'md5'

function getNoncestr(length) {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  var str = ''
  for (var i = 0; i < length; i++) {
    str += chars.substr(Math.random() * (chars.length - 1), 1)
  }
  return str
}

function jsonSort(jsonObj) {
  let arr = []
  for (var key in jsonObj) {
    arr.push(key)
  }
  arr.sort()
  let str = ''
  for (var i in arr) {
    if (jsonObj[arr[i]] != undefined) {
      str += arr[i] + '=' + jsonObj[arr[i]] + '&'
    }
  }
  return str.substr(0, str.length - 1)
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

// computed XH-Client-Data
function computData(params,token,appId,secStr) {
  let noncestr = getNoncestr(32)
  let timestamp = parseInt(new Date() / 1000)
  let signJson = Object.assign({
    'accesstoken': token.data,
    'noncestr': noncestr,
    'timestamp': timestamp
  }, params)
  let sign = md5(jsonSort(signJson) + secStr)
  let clientData = {
    appId: appId,
    accesstoken: token.data,
    sign: sign,
    noncestr: noncestr,
    timestamp: timestamp
  }
  return JSON.stringify(clientData);
}


export{
  sleep,
  computData
}