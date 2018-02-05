// STORE
import { HTTPService as HTTP } from '../../services/HTTPService';
const STORELIST = getApp().globalData.API.STORE.LIST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude: '',
    storeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取经纬度
  getAddree: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude //纬度
        var longitude = res.longitude //经度
        that.setData({
          latb: res.latitude, //纬度
          lngb: res.longitude //经度
        },function(){
          that.getStoreList()
        })
        // var speed = res.speed
        // var accuracy = res.accuracy
        console.log('经纬度')
        console.log(res)
      }
    })
  },
  getStoreList: function () {
    var that = this
    wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...STORELIST,
      payload: {
        pid: that.data.pid, // 商品id
        latb: that.data.latb,
        lngb: that.data.lngb
      }
    }).then((e) => {
      console.log(e.data)
      that.setData({
        storeList: e.data,
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
  onLoad: function (options) {
    let { store } = options;
    console.log('00000000000')
    console.log(store)
    this.setData({
      pid: store
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddree()
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