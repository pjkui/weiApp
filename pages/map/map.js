// map.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
// 引入QQ map SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    height: '600',
    longitude: 121.324520,
    latitude: 31.099994,
    distance: 0,
    lic: 'xxx',
    speed: 0,
    dt: 0,
    tipsInfo:'',
    shortDt: 0,
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 31.099994,
      longitude: 121.324520,
      width: 50,
      height: 50,
      title: '这是你的位置'
    }, {
      iconPath: "/resources/bus.png",
      id: 1,
      latitude: 31.099994,
      longitude: 121.324520,
      width: 50,
      height: 50,
      title: '这是班车'
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 121.324520,
        latitude: 31.21229
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
    }],
    buses: [
      {name:'长宁线-沪D40473',value:'沪D-40473',id:0},
      {name:'浦东蓝村线-沪D40427',value:'沪D-40427',id:1},
      {name:'浦东张江线-沪D40472',value:'沪D-40472',id:2},
      {name:'浦东北蔡线-沪D40425',value:'沪D-40425',id:3},
      {name:'闵行交大线-沪D42542',value:'沪D-42542',id:4},
      {name:'闵行交大线-沪DP3462',value:'沪D-P3462',id:5},
      {name:'闵行春申线-沪D40479',value:'沪D-40479',id:6},
      {name:'闵行银都线-沪D40443',value:'沪D-40443',id:7},
      {name:'九亭线-沪D40277',value:'沪D-40277',id:8},
      {name:'嘉定线-沪D40497',value:'沪D-40497',id:9},
      {name:'嘉定线-沪D54186',value:'沪D-54186',id:10},
      {name:'杨浦线-沪D40412',value:'沪D-40412',id:11},
      {name:'杨浦线-沪D42888',value:'沪D-42888',id:12},
      {name:'宝山顾村线-沪D40470',value:'沪D-40470',id:13},
      {name:'宝山顾村线-沪D61422',value:'沪D-61422',id:14},
      {name:'松江线-沪D61392',value:'沪D-61392',id:15},
      {name:'松江线-沪D40407',value:'沪D-40407',id:16},
      {name:'泗泾线-沪D54188',value:'沪D-54188',id:17},
      {name:'泗泾线-沪DP6146',value:'沪D-P6146',id:18},
      {name:'虹口金桥线-沪DB8965',value:'沪D-B8965',id:19},
      {name:'虹口金桥线-沪D40437',value:'沪D-40437',id:20},
    ],
    selectedBus: '8',
    showBusSelector: false
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
          height: res.windowHeight - 100
        })
      }
    })
    setInterval(function () { that.updatePosition(that) }, 5000);

  },
  updatePosition: function (that) {
    //update self position 
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,

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
        url: 'https://blog.pjkui.com/bus.php', //仅为示例，并非真实的接口地址
        data: {
          lic: that.data.buses[that.data.selectedBus].value,
        },
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
          var tempTransfBusLocation = util.wgs84togcj02(app.globalData.busInfo.location.lo, app.globalData.busInfo.location.la);
          app.globalData.busInfo.location.lo = tempTransfBusLocation[0];
          app.globalData.busInfo.location.la = tempTransfBusLocation[1];
          var serverTime = res.data.location.dt;
          var tips='';
          if(serverTime){
            serverTime = new Date(res.data.location.dt);
            var now = new Date().getTime();
            if(now - serverTime>60000){
              //if server time is not update more than one minutes
              tips = '班车数据过时1分钟以上，请注意班车动向！'; 
            }
          }
          that.setData({
            lic: res.data.location.lic,
            speed: res.data.location.speed,
            dt: res.data.location.dt,
            tipsInfo:tips,
            shortDt: res.data.location.shortDt
          })
        },
        fail: function (res) {
          console.error(res);
          wx.showToast({
            title: 'get data from pjkui.com:fail' + JSON.stringify(res),
            icon: 'success',
            duration: 2000
          })
        }

      })
    that.setData({
      markers: [{
        //user marker
        iconPath: "/resources/others.png",
        id: 0,
        title: app.globalData.userInfo.nickName,
        longitude: app.globalData.userInfo.longitude,
        latitude: app.globalData.userInfo.latitude,
        width: 50,
        height: 50
      }, {
        // bus marker
        iconPath: "/resources/bus.png",
        id: 0,
        title: app.globalData.busInfo.location.lic + ':' + app.globalData.busInfo.location.dt,
        longitude: app.globalData.busInfo.location.lo,
        latitude: app.globalData.busInfo.location.la,
        width: 50,
        height: 50
      }],
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
  },
  /**
   * bus picker
   */
   bindBusPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log('picker发送选择改变，携带值为', e)
    this.setData({
      selectedBus: e.detail.value
    })
  },
})