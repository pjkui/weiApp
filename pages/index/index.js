//index.js
// 引入QQ map SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '点开有惊喜',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'X36BZ-2ANRI-KU7GZ-5ZK2L-PXYS3-QQFNJ'
    });
  },
  onShow: function () {
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log('search success');
        console.log(res);
      },
      fail: function (res) {
        console.log('search fail');
        console.log(res);
      },
      complete: function (res) {
        console.log('search complete');
        console.log(res);
      }
    });
  }
})
