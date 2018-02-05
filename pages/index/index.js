//index.js
//获取应用实例
const app = getApp()
import { HTTPService as HTTP } from '../../services/HTTPService';
const HOME_LIST = getApp().globalData.API.HOME.LIST;
const STATUS = getApp().globalData.API.LOGIN.STATUS;
const GETGIFT = getApp().globalData.API.SEND.GETGIFT; //领取礼物
const GIFTINFO = getApp().globalData.API.SEND.GIFTINFO; //礼物信息

Page({
  data: {
    payload: {},
    fastList: [],
    reciveGift: false, //是否收到礼品
    showIndex: false, //加载成功显示首页
    giftInfo: '' // 礼物信息
  },
  // 关闭弹框 礼物
  closeTk: function(){
    this.setData({
      reciveGift: false
    })

  },
  testtap:function(){
    wx.navigateTo({
      url: '/pages/order/sendUrl/sendUrl?order_number=2018020523783'
    })
  },
  //事件处理函数
  getList: function () {
    var that = this
    wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...HOME_LIST,
      payload: {}
    }).then((e) => {
        console.log(e.data)
        this.setData({
          fastList: e.data,
          showIndex: true
        })
        wx.hideLoading()
      })
      .catch(e => {
          wx.showToast({
            title: e.noticeMessage || '加载失败',
            image: "/image/warn.png"
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
      });
  },
  // 全屏
  // playVideo: function (res) {
  //   console.log(res)
    // this.setData({
    //   showCover: true
    // })
  //   console.log(this.data.showCover)
  // },
  // 路由跳转
  routeConfig: function (e) {
    let routeId = e.currentTarget.dataset.url
    let id = e.currentTarget.dataset.id
    switch (routeId) {
      case 1:
        wx.navigateTo({
          url: '/pages/chooseCard/chooseCard?id=' + id
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/coupon/coupon?id=' + id
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/gift/gift?cat_id=' + id
        })
        break;
    }

  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext = wx.createVideoContext('myVideo2')
  },
  // 礼物信息
  giftInfo: function (order_number) {
    var that = this
    wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...GIFTINFO,
      payload: {
        order_number: order_number
      }
    }).then((e) => {
      console.log(e.data)
      that.setData({
        giftInfo: e.data
      })
      if (e.data.donee_time == 0){
        // 未领取弹出弹框
        that.setData({
          reciveGift: true,
        })
      }else{
        that.setData({
          reciveGift: false,
        })
      }
      wx.hideLoading()
    })
      .catch(e => {
        wx.showToast({
          title: e.noticeMessage || '加载失败',
          image: "/image/warn.png"
        });
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      });
  },
  // 收取礼物
  reciveGife: function (){
    var that = this
    var openid = wx.getStorageSync("openid")
    let jumb = '/pages/login/register/register'
    var openid = wx.getStorageSync('openid');
    wx.showLoading({ title: "正在加载", mask: true });
    if (openid) {
      HTTP.POST({
        ...getApp().globalData.API.LOGIN.CHEACK,
        payload: {
          openid
        }
      })
        .then(data => {
          console.log(data)
          if (data.data.status == 1) {
            // 注册成功
            console.log('注册成功')
            HTTP.REQUEST({
              ...GETGIFT,
              payload: {
                order_number: that.data.order_number,
                donee_user_openid: openid
              }
            }).then((e) => {
              console.log(e.data)
              wx.showToast({
                title: e.msg || '领取成功',
              });
              wx.navigateTo({
                url: '/pages/order/sendUrl/sendUrl?order_number=' + that.data.order_number
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
            })
              .catch(e => {
                wx.showToast({
                  title: e.noticeMessage || '加载失败',
                  image: "/image/warn.png"
                });
                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
              });
         

          } else {
            // 未注册
            console.log('未注册')
            wx.navigateTo({
              url: jumb
            })
          }
        })
        .catch(e => {
          wx.showToast({
            title: e.noticeMessage || '加载失败',
            image: "/image/warn.png"
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        });

    } else {
      console.log("用户未授权");
    }

  },
  onLoad: function (options) {
    console.log('礼物呀')
    var that = this
    console.log(options)
    // let order_number = '2018020479776'
    if (options.order_number){
      that.setData({
        order_number: options.order_number
      },function(){
        that.giftInfo(that.data.order_number)
      })
    }
    this.getList()
  },
  toOrderList: function(){
    let jumb = '/pages/login/register/register'
    var openid = wx.getStorageSync('openid');
    if (openid) {
      HTTP.POST({
        ...getApp().globalData.API.LOGIN.CHEACK,
        payload: {
          openid
        }
      })
        .then(data => {
          console.log(data)
          if (data.data.status == 1) {
            // 注册成功
            console.log('注册成功')
            wx.navigateTo({
              url: '/pages/order/orderList/orderList'
            })


          } else {
            // 未注册
            console.log('未注册')
            wx.navigateTo({
              url: jumb
            })
          }
        })
        .catch(e => {
          wx.showToast({
            title: e.noticeMessage || '加载失败',
            image: "/image/warn.png"
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        });

    } else {
      console.log("用户未授权");
    }
  }
})
