var Zan = require("../../dist/index");
import { HTTPService as HTTP } from '../../services/HTTPService';
import { PayService as Pay } from "../../services/PayService";
const CARDLIST = getApp().globalData.API.CARD.CARDLIST;
const SETORDER = getApp().globalData.API.CARD.SETORDER;

var strip_tags = require('../../utils/striptags.js');
const WxParse = require("../../utils/wxParse.js");

Page(

  Object.assign({}, Zan.Quantity, {
    data: {
      cid: '',
      num: 1,
      chooseCard: '', // 选中卡片id
      myindex: 0, //选中第几个卡片
      showCard: false,
      cardList: [],
      nodes: {

      }
    },
    // 数量选择
    handleZanQuantityChange(e) {
      // wx.showLoading({ title: "正在加载", mask: true });
      var that = this;
      var componentId = e.componentId; //选中id
      var quantity = e.quantity; // 选中数量
      var obj = e.obj;
      console.log('卡片')
      console.log(e)
      this.setData({
        num: quantity
      })   
    },
    phoneCall:function(e){
      var phone = e.currentTarget.id;
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    // 文本
    changeHtml: function(compare){
      var html_nodes = this.data.cardList[compare].desc;
      html_nodes = html_nodes.replace(/\\/ig, '');
      html_nodes = strip_tags(html_nodes, ['img']);//仅允许html img标签
      console.log(html_nodes);
      WxParse.wxParse("html_nodes", "html", html_nodes, this, 0);
    },
    // 数量选择   end
    upper: function (e) {
      console.log(e)
    },
    lower: function (e) {
      console.log(e)
    },
    scroll: function (e) {
      console.log(e)
    },
    tap: function (e) {
      for (var i = 0; i < order.length; ++i) {
        if (order[i] === this.data.toView) {
          this.setData({
            toView: order[i + 1]
          })
          break
        }
      }
    },
    tapMove: function (e) {
      this.setData({
        scrollTop: this.data.scrollTop + 10
      })
    },
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
        console.log(e.data)
        this.setData({
          cardList: e.data,
          showCard: true
        },function(){
          that.changeHtml(that.data.myindex)
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
    // 选择卡片id
    chooseCard: function(e){
      var that = this
      let chooseCard = e.currentTarget.dataset.card
      let myindex = e.currentTarget.dataset.index
      console.log(myindex)
      this.setData({
        chooseCard,
        myindex,
        num:1
      }, function () {
        that.changeHtml(that.data.myindex)
      })
    },
    // 生成订单
    setOrder: function() {
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
              function(){
                // 生成订单
                HTTP.REQUEST({
                  ...SETORDER,
                  payload: {
                    // cid: that.data.cid
                    product_id: that.data.cardList[that.data.myindex].id,
                    phone: that.data.phone,
                    number: that.data.num
                  }
                }).then((e) => {
                  console.log(e)
                  that.setData({
                    order_id: e.data.order_number,
                    price: e.data.price
                  }, function () {
                    // console.log('卧槽')
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
                      pay_app_id: "wxminiprogrampay"
                      // ,
                      // cur_money: this.data.order_total_amount
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
                        setTimeout(() => {
                          wx.navigateTo({
                            url: '/pages/orderAction/send?order_number=' + that.data.order_id + '&pic=' + that.data.cardList[that.data.myindex].pic_url + '&name=' + that.data.cardList[that.data.myindex].title
                          });
                        }, 1500);
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
    onLoad: function (options) {
      let { id } = options
      var that = this
      this.setData({
        cid: id
      }, function () {
        that.getCard()
      })
    }
  })
)