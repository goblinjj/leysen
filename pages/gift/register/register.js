import { HTTPService as HTTP } from '../../../services/HTTPService';
// const REGISTER = getApp().globalData.API.LOGIN.REGISTER;
const timerUtil = require("../../../utils/timerUtil");
const PICCODE = getApp().globalData.API.LOGIN.PICCODE;
const NUMCODE = getApp().globalData.API.LOGIN.NUMCODE;
const REGISTER = getApp().globalData.API.LOGIN.REGISTER;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputInfo: {},
    phone: '', // 手机号
    captcha_status: "isReady", // isReady: 等待发送,  isSending: 正在发送,  isSended:已发送
    wxTimerList: {},
    status: "",
    wx_user_info: {},
    captcha: '', //图形验证码,
    order_id:''
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  //手机号码变化时
  bindMobileChange: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  //  输入图形验证码
  inputPicCode: function (e) {
    this.setData({
      captcha: e.detail.value
    });
  },
  //获取验证码
  bindGetCaptcha: function () {
    var that = this
    if (!this.data.phone) {
      wx.showToast({
        title: "请输入手机号码",
        image: "/image/warn.png"
      });
    } else {
      this.setData(
        {
          captcha_status: "isSending"
        },
        () => {
          HTTP.POST({
            ...NUMCODE,
            payload: {
              phone: this.data.phone,
              captcha: this.data.captcha
              // type: "bind_mobile"
            }
          })
            .then(data => {
              console.log("验证码为:", data);

              this.setData(
                {
                  captcha_status: "isSended"
                }, () => {

                  this.timer.start(this);
                });
            })
            .catch(e => {
              that.setData(
                {
                  captcha_status: "isReady"
                },
                () => {
                  if (e.responseJSON.msg) {
                    wx.showToast({
                      title: e.responseJSON.msg || '加载失败',
                      image: "/image/warn.png"
                    });
                  } else {
                    wx.showToast({
                      title: e.noticeMessage || '加载失败',
                      image: "/image/warn.png"
                    });
                  }
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 2000)
                }
              );
            });
        }
      );
    }
  },

  // 确认注册
  formSubmit: function (e) {
    var that = this
    console.log('确认注册')
    console.log(e.detail.value)
    this.setData({
      inputInfo: e.detail.value //表单内容
    }, function () {
      if (!that.data.inputInfo.name) {
        wx.showToast({
          title: '请输入姓名',
          image: "/image/warn.png"
        });
        return
      }
      if (!that.data.inputInfo.phone) {
        wx.showToast({
          title: '请输入手机号',
          image: "/image/warn.png"
        });
        return
      }
      if (!that.data.inputInfo.phonecode) {
        wx.showToast({
          title: '请输入验证码',
          image: "/image/warn.png"
        });
        return
      }
      wx.showLoading({ title: "正在加载", mask: true });
      HTTP.REQUEST({
        ...REGISTER,
        payload: {
          ...that.data.inputInfo,
          head_url: wx.getStorageSync("avatarUrl") || '',
          nickname: wx.getStorageSync("nickName") || ''
        }
      }).then((e) => {
        console.log(e.data)
        // wx.showToast({
        //   title: e.msg || '成功',
        //   success: function (res) {
        //     wx.navigateBack({
        //       delta: 1,
        //     })
        //   }
        // });
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

        //2018-02-06 修改注册成功提示并返回首页
        wx.showModal({
          title: "注册成功",
          content: "注册完成，1000积分已打入您的账户",
          showCancel: false,
          success: function () {
            wx.navigateTo({
              url: '/pages/index/index'
            })
          }
        });  

      })
        .catch(e => {
          if (e.responseJSON.msg) {
            wx.showToast({
              title: e.responseJSON.msg || '加载失败',
              image: "/image/warn.png"
            });
          } else {
            wx.showToast({
              title: e.noticeMessage || '加载失败',
              image: "/image/warn.png"
            });
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        });
    })

  },
  onLoad: function (options) {
      var order_id = options.order_id;
      this.setData({order_id : order_id});
      console.info("========从门店选择页面传递过来的参数：【" + options + "】");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.timer = new timerUtil({
      beginTime: "00:01:20",
      complete: () => {
        console.log("完成了");
        this.setData({
          captcha_status: "isReady"
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})