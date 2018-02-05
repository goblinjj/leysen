import { HTTPService as HTTP } from '../../services/HTTPService';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cat_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  openbox: function () {
    wx.navigateTo({
      url: '/pages/gift/giftKind/giftKind?cat_id=' + this.data.cat_id,
    })
  },
  onLoad: function (options) {
    let { cat_id } = options;
    console.log('宝盒id')
    console.log(cat_id)
    this.setData({
      cat_id: cat_id
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