import { HTTPService as HTTP } from '../../services/HTTPService';
const TOSEND = getApp().globalData.API.SEND.TOSEND;
const UPAUDIO = getApp().globalData.API.SEND.UPAUDIO;
// 录音
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendType: 'write',
    order_number: '',
    wish_text:'',
    wish_audio:'',
    isRecode: false// 正在录音 true为正在录音
   
  },
  // 切换
  changeType: function(e){
    let sendType = e.currentTarget.dataset.send
    this.setData({
      sendType
    })
  },
 sendAction: function(){
   var that = this
   wx.showLoading({ title: "正在加载", mask: true });
    console.log('哈哈哈哈哈哈哈哈哈')
   console.log(this.data.payload)
   HTTP.REQUEST({
     ...TOSEND,
     payload: {
       order_number: that.data.order_number,
       wish_text: that.data.wish_text,
       wish_audio: that.data.wish_audio,
     }
   }).then((e) => {
  
     wx.showToast({
       title: e.msg  || '赠送成功'
     });
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
 },
//  录音
startRecode:function() {
   var that = this;
   this.setData({
     isRecode:true,
     wish_text: '' // 清空文字
   })
   console.log("start");

   const options = {
     duration: 10000,//指定录音的时长，单位 ms
     sampleRate: 16000,//采样率
     numberOfChannels: 1,//录音通道数
     encodeBitRate: 96000,//编码码率
     format: 'mp3',//音频格式，有效值 aac/mp3
     frameSize: 50,//指定帧大小，单位 KB
   }
   //开始录音
   recorderManager.start(options);
   recorderManager.onStart(() => {
     console.log('recorder start')
     console.log()
   });
   //错误回调
   recorderManager.onError((res) => {
     console.log(res);
     wx.showToast({
       title: e.noticeMessage || '录音失败',
       image: "/image/warn.png"
     });
     setTimeout(function () {
       wx.hideLoading()
     }, 2000)
   })
   
 }, 
//  录音结束
 //停止录音
stopRecode: function () {
  const that = this
  console.log('停止录音')
  this.setData({
    isRecode: false // 结束录音
  })
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log(res)
      console.log('停止录音', res.tempFilePath);
      var file = res.tempFilePath;
      // wx.showLoading({
      //   title: '保存中',
      // });
      // HTTP.UPLOADFILE({
      //   ...UPAUDIO,
      //   payload: {
      //     filePath: file,
      //   }
      // }).then((e) => {
      //   // wx.hideLoading()
      //   that.setData({
      //     wish_audio: e.path // 结束录音
      //   })
      //   wx.showToast({
      //     title: e.msg || '保存成功'
      //   });
      //   setTimeout(function () {
      //     wx.hideLoading()
      //   }, 2000)
      
      var url = UPAUDIO.url;
      wx.uploadFile({
        url: url,
        filePath: file,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          var str = res.data;  
          var data = JSON.parse(str);  
          console.info("=====>"+data.data);
          that.setData({
          wish_audio: data.data // 结束录音
        })

          console.info("===+++===" + that.data.wish_audio);
        }
      })
    })
    
  },
  //播放声音
  play: function () {

    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  // 文字内容
  textInfo: function (e) {
    this.setData({
      wish_text: e.detail.value,
      wish_audio: '' // 清空语音
    })
    console.log(e.detail.value)
  },

 // 邀请
 onShareAppMessage: function () {
   var that = this
   return {
     title: that.data.name,
     path: '/pages/index/index?order_number=' + that.data.order_number,
     imageUrl: that.data.pic,
     success: function (res) {
       console.log('转发成功')
       that.sendAction()
     },
     fail: function (res) {
       console.log(res)
     }
   }
 },


  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_number: options.order_number,
      pic: options.pic,
      name: options.name
    })
  

    wx.showShareMenu({
      withShareTicket: true
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

})