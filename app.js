//app.js

const API_CONST = require("./config/ApiConst");
const authorizationUtil = require("./utils/authorizationUtil");

import { HTTPService as HTTP } from './services/HTTPService';

App({
  onLaunch: function (options) {
    var that = this
    console.log("app onLaunch: ", options);
    //调用API从本地缓存中获取数据
    //   var logs = wx.getStorageSync("logs") || [];
    //   logs.unshift(Date.now());
    //   wx.setStorageSync("logs", logs);

    // wx.getStorageInfo({
    //     success: function(res) {
    //       console.log(res.keys)
    //       console.log(res.currentSize)
    //       console.log(res.limitSize)
    //     }
    // })

    //初始化登录状态
    // authorizationUtil.init(this);
    // authorizationUtil.initPreLogin(this);
    // authorizationUtil.getInfo()
    //初始化地区控件
    // this.getInfo()



    // login
    wx.login({
      success: function (res) {
        console.log(res)
        var code = res.code
        // that.setData({
        //   code: res.code
        // })
        if (res.code) {
          wx.getUserInfo({
            success: function (resdata) {
              console.log('用户信息')
              console.log(resdata)
              wx.showLoading({ title: '加载中...', });
              /*存个人信息*/
              wx.setStorageSync('avatarUrl',  resdata.userInfo.avatarUrl)
              wx.setStorageSync('nickName', resdata.userInfo.nickName)
              //发起网络请求
              HTTP.REQUEST({
                ...that.globalData.API.LOGIN.STATUS,
                payload: {
                  code: code,
                  head_url: resdata.userInfo.avatarUrl || '',
                  nickname: resdata.userInfo.nickName || ''
                  // ,
                  // encryptedData: resdata.encryptedData,
                  // iv: resdata.iv
                }
              }).then((e) => {
                console.log(e)
                wx.setStorageSync('openid', e.data.openid) //存储openid
                wx.hideLoading()
              })
                .catch(e => {
                  wx.showToast({
                    title: e.responseJSON.msg || '加载失败',
                    image: "/image/warn.png"
                  });
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 2000)
                });
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

// login   end


  },
onShow: function (options) {
  console.log("app onShow: ", options);

},
onHide: function () { },
onError: function (msg) {
  console.log("触发全局错误");
},


globalData: {
  API: API_CONST,
    authorization: wx.getStorageSync("authorization") || {},
    openid: wx.getStorageSync("openid") || {},
    avatarUrl: wx.getStorageSync("avatarUrl") || {}, //头像
    nickName: wx.getStorageSync("nickName") || {}, //名字

  },
  
});
