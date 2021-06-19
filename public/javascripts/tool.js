// local操作
/*
 * 参数说明：
 * method：get获取，set存入或覆盖，clean清除
 * name:localStorage的名称
 * obj:存入的内容，可以是任意类型
 * localStorage.getItem(key):获取指定key本地存储的值
 * localStorage.setItem(key,value)：将value存储到key字段
 * localStorage.removeItem(key):删除指定key本地存储的值
 * */
localData = (method, name, obj) => {
    switch (method) {
      case 'get':
        if (localStorage.getItem(name + '_obj')) {
          return JSON.parse(localStorage.getItem(name + '_obj'));
        } else if (localStorage.getItem(name + '_str')) {
          return localStorage.getItem(name + '_str');
        } else {
          return null
        }
        case 'set':
          localData('clean', name);
          if (typeof obj == 'object') {
            localStorage.setItem(name + '_obj', JSON.stringify(obj));
          } else {
            localStorage.setItem(name + '_str', obj);
          }
          return true;
        case 'clean':
          localStorage.removeItem(name + '_obj');
          localStorage.removeItem(name + '_str');
          return true;
    }
  };
  
  // session操作
  /*
   * 参数说明：
   * method：get获取，set存入或覆盖，clean清除
   * name:session的名称
   * obj:存入的内容，可以是任意类型
   * */
  sessionData = (method, name, obj) => {
    switch (method) {
      case 'get':
        if (sessionStorage.getItem(name + '_obj')) {
          return JSON.parse(sessionStorage.getItem(name + '_obj'));
        } else if (sessionStorage.getItem(name + '_str')) {
          return sessionStorage.getItem(name + '_str');
        } else {
          return null
        }
        case 'set':
          sessionData('clean', name);
          if (typeof obj == 'object') {
            sessionStorage.setItem(name + '_obj', JSON.stringify(obj));
          } else {
            sessionStorage.setItem(name + '_str', obj);
          }
          return true;
        case 'clean':
          sessionStorage.removeItem(name + '_obj');
          sessionStorage.removeItem(name + '_str');
          return true;
    }
  };
  
  createUUID = () => {
    var s = [];
    var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = ""; //"" 引号里面可以加任意字符，代表拼接的意思，如果不加就是 纯32位支付
  
    var uuid = s.join("");
    return uuid;
  }
  