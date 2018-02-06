import { HTTPService as HTTP } from '../../../services/HTTPService';
const PROVINCE = getApp().globalData.API.GIFT.PROVINCE;
const CITY = getApp().globalData.API.GIFT.CITY;
const STORE = getApp().globalData.API.GIFT.STORE;
const SUBMIT = getApp().globalData.API.GIFT.SUBMIT;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  省份
    economize: '',
    ecoArry: [],
    //  城市
    mycity: '',
    cityArry: [],
    //  门店
    store: '',
    storeArry: [],
    // 提交信息
    payload: {},
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //获取省份
  geteConomize: function () {
    var that = this
    wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...PROVINCE,
      payload: {}
    }).then((e) => {
      console.log(e)
      // console.log(e.data)
      that.setData({
        ecoArry: e.data
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
  //获取城市
  getCity: function () {
    var that = this
    var ecoArry = [...that.data.ecoArry]
    var province = ecoArry[that.data.economize].province
    // var province = '北京'
    HTTP.REQUEST({
      ...CITY,
      payload: {
        province: province
      }
    }).then((e) => {
      console.log(e)
      this.setData({
        cityArry: e.data
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
  //获取门店
  getStore: function () {
    var that = this
    var cityArry = [...that.data.cityArry]
    var city = cityArry[that.data.mycity].city
    // wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...STORE,
      payload: {
        city: city
      }
    }).then((e) => {
      console.log(e)
      that.setData({
        storeArry: e.data
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
  // 选择省份
  ecoChange: function (e) {
    var that = this
    console.log('选择省份picker发送选择改变，携带值为', e.detail.value)
    // 
    that.setData({
      economize: e.detail.value, //选中value序号
      cityArry: [], //清空城市列表
      mycity:'', //清空城市选择信息
      storeArry: [], //清空 门店列表
      store: '' //清空 门店选择信息
    },function(){
      that.getCity()
    })
  },
  // 选择城市
  cityChange: function (e) {
    var that = this
    console.log('选择城市picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      mycity: e.detail.value, //选中value序号
      storeArry: [], //清空 门店列表
      store: '' //清空 门店选择信息
    }, function () {
      console.log('加载城市')
      that.getStore()
    })
  },
  // 选择门店
  storeChange: function (e) {
    console.log('选择门店picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      store: e.detail.value //选中value序号
    })
  },

  // 提交地址
  chooseSubmit: function(){
    // 判断是否登陆
    var that = this
    let jumb = '/pages/gift/register/register?order_id=' + that.data.payload.order_id;
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
            if (that.data.store) {
              let storeArry = that.data.storeArry
              let store_id = storeArry[that.data.store].id
              wx.showLoading({ title: "正在加载", mask: true });

              HTTP.REQUEST({
                ...SUBMIT,
                payload: {
                  ...that.data.payload,
                  store_id: store_id
                }
              }).then((e) => {
                console.log(e)
                // 跳转到结果页
                wx.navigateTo({
                  url: '/pages/gift/giftStatus/giftStatus?status=' + that.data.code,
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
            } else {
              wx.showToast({
                title: '请选择店铺',
                image: "/image/warn.png"
              });
            }


          } else {
            // 未注册
            //这里调用 STOREGIFT 2018-02-07 
            wx.showLoading({ title: "正在加载", mask: true });

            HTTP.REQUEST({
              ...SUBMIT,
              payload: {
                ...that.data.payload,
                store_id: store_id
              }
            }).then((e) => {
              console.log(e)
              // 跳转到结果页
              wx.hideLoading();
              if(e.data.code == 1){
                console.log('未注册')
                wx.navigateTo({
                  url: jumb
                });
              }else{
                 wx.showModal({
                   title: '领取失败',
                   content: '添加领取店铺失败'
                 })
                return ;
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
            //这里调用 STOREGIFT 结束 2018-02-07 
          
            // 此处处理 移到提交了商铺订单成功回调后执行跳转
            // console.log('未注册')
            // wx.navigateTo({
            //   url: jumb
            // })
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
    console.log(options)
    console.info("========从上领取页面传递过来的参数：【" + options + "】");
    var that = this
    var order_id = ''
    if (options.order_id){
      order_id = options.order_id
    }
    this.setData({
      code: options.code,
      payload: {
        order_id: order_id
      }
    })
    console.log('地址选择')
    this.geteConomize()
    // this.getCity()
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