import { HTTPService as HTTP } from '../../../services/HTTPService';
const GIFTKIND = getApp().globalData.API.GIFT.GIFTKIND;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showGift: false,
    cat_id: '',
    giftBox: {}
  },
  //打开宝盒
  giftInfo: function () {
    var that = this
    wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...GIFTKIND,
      payload: {
        cat_id: that.data.cat_id
      }
    }).then((e) => {
      console.log(e)
      // console.log(e.data)
      this.setData({
        giftBox: e.data,
        showGift: true,
        showMsg: e.msg,
        // order_id: e.data.order_id
      })
      // console.log(e.data)
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
  },
// 立即领取
  openbox: function () {
    var that = this
    if (that.data.giftBox.code==1){
      // 领到实物
      wx.navigateTo({
        url: '/pages/gift/chooseAddress/chooseAddress?order_id=' + that.data.giftBox.order_id + '&code=' + that.data.giftBox.code,
      })
    }else{
      // 没有领到实物
      wx.navigateTo({
        url: '/pages/gift/giftStatus/giftStatus?status=' + that.data.giftBox.code,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let { cat_id } = options;
    console.log('open宝盒')
    console.log(cat_id)
    this.setData({
      cat_id: cat_id
    },function(){
      that.giftInfo()
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