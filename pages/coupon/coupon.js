import { HTTPService as HTTP } from '../../services/HTTPService';
import { PayService as Pay } from "../../services/PayService";
const CARDLIST = getApp().globalData.API.CARD.CARDLIST;
const SETORDER = getApp().globalData.API.CARD.SETORDER;
var Zan = require("../../dist/index");
Page(

  Object.assign({}, Zan.Quantity,{
  data: {
    // num: 1,
    choosed: 0, //选中的卡片index
    cid: '',
    cardList: [],
    showCard:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 数量选择
  handleZanQuantityChange(e) {
    // wx.showLoading({ title: "正在加载", mask: true });
    var that = this;
    var componentId = e.componentId; //选中index
    var quantity = e.quantity; // 选中数量
    var obj = e.obj;
    console.log('选中index')
    console.log(componentId)
    // mynum
    let cardList = [...that.data.cardList]
    cardList[componentId].mynum = quantity
    this.setData({
      // num: quantity, //计算价格
      cardList
    })
  },
  // 数量选择   end
  // 获取卡片列表
  getCard: function () {
    var that = this
    wx.showLoading({ title: "正在加载", mask: true });

    HTTP.REQUEST({
      ...CARDLIST,
      payload: {
        cid: that.data.cid
      }
    }).then((e) => {
      console.log(e)
      this.setData({
        cardList: e.data,
        showCard: true
      },function(){
        let cardList = [...that.data.cardList]
        for (let i = 0; i <cardList.length; i++){
          cardList[i].mynum = 1
          console.log(cardList[i])
          that.setData({
            cardList: cardList
          })
        }
      })
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
  // 选择卡片
  choosedAction: function(e){
    let choosed = this.data.choosed
    let thisindex = e.currentTarget.dataset.index //当前点击的index
    if (choosed === thisindex){
      // 点击是当前卡片
      console.log('点击是当前卡片')
   
    }else{
      // 点击是其它卡片
      console.log('点击是其它卡片')
      this.setData({
        num: 1, //数据还原
        choosed: thisindex
      })
    }
  },
 
  // 生成订单
  setOrder: function () {
    // 判断是否登陆
    var that = this
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
            console.log('已经注册')
            that.setData({
              phone: data.data.phone
            },
              function () {
                // 生成订单
                HTTP.REQUEST({
                  ...SETORDER,
                  payload: {
                    // cid: that.data.cid
                    product_id: that.data.cardList[that.data.choosed].id,
                    phone: that.data.phone,
                    number: that.data.cardList[that.data.choosed].mynum
                  }
                }).then((e) => {
                  console.log(e)
                  that.setData({
                    order_id: e.data.order_number,
                    price: e.data.price
                  }, function () {
                    console.log('其支付哈哈哈哈')
                    that.goOrder()
                  })

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
    // var price = that.data.num * that.data.cardList[that.data.myindex].price
  },
  onLoad: function (options) {
    let { id } = options
    var that = this
    this.setData({
      cid: id
    }, function () {
      that.getCard()
    })

  },
  // 支付
  goOrder: function () {
    // 判断是否登陆
    var that = this

    Pay.do({
      payment: {
        order_id: this.data.order_id, //订单号
        price: this.data.price, //价格
        combination_pay: false,
        def_pay: {
          pay_app_id: "wxminiprogrampay",
          cur_money: this.data.order_total_amount
        },
        memo: ""
      }
      //pay_type: "relation"
    })
      .then(res => {
        console.log("支付成功", res);
        wx.showToast({
          title: "支付成功",
          complete: function () {
            // setTimeout(() => {
            //   wx.redirectTo({
            //     url: "/pages/my/myOrder/order_list/order_list"
            //   });
            // }, 1500);
          }
        });
      })
      .catch(e => {
        console.log("支付失败", e);
        wx.showToast({
          title: e.noticeMessage || "支付失败",
          image: "/image/warn.png"
        });
      });
    // 去支付   end
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
)