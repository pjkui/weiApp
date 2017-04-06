//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (e) {
          console.log('wxlogin success!');
          console.log(e);
          var code = e.code;

          wx.getUserInfo({
            success: function (res) {
              console.log('get User Info');
              console.log(res);
              that.globalData.userInfo = res.userInfo;
              that.globalData.userInfo.longitude = 0;
              that.globalData.userInfo.latitude = 0;


              //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
              wx.request({
                url: 'https://blog.pjkui.com/weapp/index.php',
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                }, // 设置请求的 header
                success: function (res) {
                  // success
                  console.log('get user info from server success!');
                  console.log(res);
                },
                fail: function (res) {
                  console.log('get user info from server failed!');
                  console.log(res);
                  // fail
                },
                complete: function (res) {
                  // complete
                }
              });


              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail: function (res) {
              console.error('get user info error!');
              console.log(res);
            }
          })
        },
        fail: function (e) {
          console.error('wx login error!');
          console.log(e);
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    busInfo: {
      location: {
        lo: 0,
        la: 0
      }
    }
  }
})