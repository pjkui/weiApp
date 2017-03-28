// map.js
//获取应用实例
var app = getApp()
// 引入QQ map SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    height: '600',
    longitude: 113.324520,
    latitude: 23.099994,
    distance: 0,
    lic: 'xxx',
    speed: 0,
    dt: 0,
    shortDt: 0,
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
    // 实例化QQ map API核心类
    qqmapsdk = new QQMapWX({
      key: 'X36BZ-2ANRI-KU7GZ-5ZK2L-PXYS3-QQFNJ'
    });
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
    //update self position 
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
        if (app.globalData.userInfo) {
          app.globalData.userInfo.latitude = res.latitude;
          app.globalData.userInfo.longitude = res.longitude;
        }
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
    }),
      //call my server to update bus' position 
      wx.request({
        url: 'https://www.pjkui.com/bus.php', //仅为示例，并非真实的接口地址
        // data: {
        //   //x: '',
        //   // y: ''
        // },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('get data from pjkui.com');
          // location: {
          // com: "腾讯"
          // dir: "正北"
          // dirNum: 0
          // driver: ""
          // dt: "2017-03-28 21:24:56"
          // la: 31.190784
          // lic: "沪D-40277"
          // lo: 121.41312
          // pos: ""
          // shortDt: "2017-03-28 21:24:56"
          // speed: 0
          // state: 1
          // stateStr: "重车" 
          // }
          // success: true

          console.log(res.data)
          app.globalData.busInfo = res.data;
          that.setData({
            lic: res.data.location.lic,
            speed: res.data.location.speed,
            dt: res.data.location.dt,
            shortDt: res.data.location.shortDt
          })
        }
      })
    that.setData({
      polyline: [{
        points: [{
          longitude: app.globalData.userInfo.longitude,
          latitude: app.globalData.userInfo.latitude
        }, {
          longitude: app.globalData.busInfo.location.lo,
          latitude: app.globalData.busInfo.location.la
        }],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true
      }],
    }),
      // 调用接口
      qqmapsdk.calculateDistance({
        from: {
          longitude: app.globalData.userInfo.longitude,
          latitude: app.globalData.userInfo.latitude
        },
        to: [{
          longitude: app.globalData.busInfo.location.lo,
          latitude: app.globalData.busInfo.location.la
        }],
        success: function (res) {
          console.log('distance caculate ok !');
          var distance = res.result.elements[0].distance;
          console.log(distance + '米');
          that.setData({
            distance: distance
          });
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });
  }


})