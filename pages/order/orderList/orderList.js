var Zan = require("../../../dist/index");
import { HTTPService as HTTP } from '../../../services/HTTPService';
import { PayService as Pay } from "../../../services/PayService";
const ORDER_LIST = getApp().globalData.API.MYORDER.LIST;
const ORDER_BACK = getApp().globalData.API.MYORDER.BACK;
const ORDER_USE = getApp().globalData.API.MYORDER.USE;
Page(
  /**
   * 页面的初始数据
   */
  Object.assign({}, Zan.Tab, {
    data: {
      payload: {
        type: 1
      },
      orderList: [],
      codeImg: '',
      tab1: {
        list: [
          {
            id: "0",
            title: "全部订单",
            typeId: 1
          },
          {
            id: "1",
            title: "未付款",
            typeId: 2
          },
          {
            id: "2",
            title: "已领取",
            typeId: 3
          }
        ],
        selectedId: "0",
        scroll: false,
        toUse: false // 去使用弹框
      }
    },
    // 切换，筛选
    handleZanTabChange(e) {
      var that = this;
      var componentId = e.componentId;
      console.log(componentId);
      var selectedId = e.selectedId;
      this.setData({
        [`${componentId}.selectedId`]: selectedId
      });
      console.log(selectedId);
      let typeId = this.data.tab1.list[selectedId].typeId;
      this.setData({
        payload: {
          type: typeId
        }
      }, function () {
        wx.showLoading({ title: "正在处理", mask: true });
        that.getList()
      });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    // 获取列表
    getList: function () {
      var that = this
      HTTP.REQUEST({
        ...ORDER_LIST,
        payload: that.data.payload
      })
        .then((e) => {
          console.log('列表')
          console.log(e)
          if (e.data) {
            that.setData({
              orderList: e.data
            })
          }
          wx.hideLoading()
        })
        .catch(e => {
          that.setData({
            orderList: []
          })
          wx.showToast({
            title: e.responseJSON.msg || '加载失败',
            image: "/image/warn.png"
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        });
    },
    // 退款
    backPay: function (e) {
      var that = this
      let orderNum = e.currentTarget.dataset.num //订单号
      wx.showLoading({ title: "正在处理", mask: true });
      HTTP.POST({
        ...ORDER_BACK,
        payload: {
          order_number: orderNum
        }
      })
        .then((e) => {
          wx.showToast({
            title: e.msg || '失败',
            success: function () {
              that.getList()
            }
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)

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
    // 关闭二维码
    closeCode: function () {
      this.setData({
        toUse: false
      })
      this.getList()
    },
    // 使用
    toUse: function (e) {
      var that = this
      let useId = e.currentTarget.dataset.num //订单号
      // 获取到二维码后显示该浮层
      this.setData({
        toUse: true
      })
      wx.showLoading({ title: "正在加载", mask: true });
      HTTP.GET({
        ...ORDER_USE,
        payload: {
          order_number: useId
        }
      })
        .then((e) => {
          if (e.data) {
            this.setData({
              codeImg: e.data.qrCode
            })
          }
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
    // 支付
    goOrder: function (e) {

      var that = this
      var index = e.currentTarget.dataset.index
      console.log(e)
      var order_id = that.data.orderList[index].order_number
      var price = that.data.orderList[index].price
      var order_id = that.data.orderList[index].order_number
      Pay.do({
        payment: {
          order_id: order_id, //订单号
          price: price, //价格
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
    // 赠送
    sendOther: function (e) {
      let order_number = e.currentTarget.dataset.num
      let pic = e.currentTarget.dataset.pic
      let name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: '/pages/orderAction/send?order_number=' + order_number + '&pic=' + pic + '&name=' + name,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    onLoad: function (options) {
     
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
      wx.showLoading({ title: "正在加载", mask: true });
      this.getList()
    }
  })
);