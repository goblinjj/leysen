import { HTTPService as HTTP } from '../../../services/HTTPService';
const GIFTINFO = getApp().globalData.API.SEND.GIFTINFO; //礼物信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_number:'',
    giftInfo:'',
    canPlay: true
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
  //播放声音
  // play: function () {

  //   innerAudioContext.autoplay = true
  //   innerAudioContext.src = this.giftInfo.wish_audio,
  //     innerAudioContext.onPlay(() => {
  //       console.log('开始播放')
  //     })
  //   innerAudioContext.onError((res) => {
  //     console.log(res.errMsg)
  //     console.log(res.errCode)
  //   })

  // },
  playVoice: function () {
    var that = this
    console.log('ok')
    wx.playVoice({
      filePath: this.data.giftInfo.wish_audio,
      success: function () {
        var playTime = 0
        console.log('play voice finished')
  
      }
    })
  },
  pauseVoice: function () {
    clearInterval(playTimeInterval)
    wx.pauseVoice()
    this.setData({
      playing: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // wish_audio
  onLoad: function (options) {
    var that = this
    that.setData({
      order_number: options.order_number
    },function(){
      // let order_number = '2018020545769'
      // that.giftInfo(order_number)
      that.giftInfo(that.data.order_number)
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
    // this.audioCtx.setSrc('http://tmp/wxdca5a09dae7447a9.o6zAJswsTFQnooiBkg3Bndtsho6w.d1db642dfb408e1e379e6b749a9c467a.durationTime=1272.mp3')
    // this.audioCtx.setSrc('wxfile://tmp_5a9618f204455fc26fe65d71e681cd0f.mp3')
    // this.audioCtx.play()
  },
  audioPlay: function () {
    this.setData({
      canPlay: false
    })
    this.audioCtx.play()
  },
  audioPause: function () {
    this.setData({
      canPlay: true
    })
    this.audioCtx.pause()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }
})