// map.js
//获取应用实例
var app = getApp()

Page({
  data: {
    height: '600',
    longitude: 113.324520,
    latitude: 23.099994,
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,


          // var latitude = res.latitude
          // var longitude = res.longitude
          // var speed = res.speed
          // var accuracy = res.accuracy
        });
        app.getUserInfo(function (userInfo) {
          //更新数据
          console.log(that);
          that.setData({
            markers: [{
              // iconPath: userInfo.avatarUrl,
              iconPath: "/resources/others.png",
              id: 0,
              title: userInfo.nickName,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 25,
              height: 25
            }],
          })
        })
        wx.showToast({
          title: '已经知道你的位置！O(∩_∩)O~',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '好像无法获得你的位置！O(∩_∩)O~',
          icon: 'success',
          duration: 2000
        })
      },
      cancel: function (res) {

      }
    })

    console.log(e.controlId)
  },
  onLoad: function (options) {
    //保证wx.getSystemInfo的回调函数中能够使用this
    var that = this

    //调用wx.getSystemInfo接口，然后动态绑定组件高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    setInterval(function () { that.updatePosition(that) }, 2000);
  },
  updatePosition: function (that) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            // iconPath: userInfo.avatarUrl,
            iconPath: "/resources/others.png",
            id: 0,
            title: 'dream pjkui',
            latitude: res.latitude,
            longitude: res.longitude,
            width: 25,
            height: 25
          }],
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '好像无法获得你的位置！O(∩_∩)O~',
          icon: 'success',
          duration: 2000
        })
      },
      cancel: function (res) {

      }
    })
  }


})