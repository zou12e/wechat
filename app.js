App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx037232cadf17facf&secret=8c2cd83e5243832f5067566e9d91a6a7&js_code=${res.code}&grant_type=authorization_code`,
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  host: function () {
    return "abc"
  },
  retain : function (num) {
      num = "0" + parseInt(num);
      return num.length > 2 ? num.substring(1) : num;
  }


})