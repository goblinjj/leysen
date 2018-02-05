import { HTTPService as HTTP } from "./HTTPService";
// import _ from "../vendor/lodash/lodash.wxapp";

class PayService {
    //生成支付单和微信支付信息
    /**
     * appid必须为最后拉起收银台的小程序appid； 
        mch_id为和appid成对绑定的支付商户号，收款资金会进入该商户号； 
        trade_type请填写JSAPI； 
        openid为appid对应的用户标识，即使用wx.login接口获得的openid
     */
    static gen_payinfo = () => {};

    static do = orderPayInfo => {
      const openid = wx.getStorageSync('openid');
  
      console.log('ranran')
      console.log(orderPayInfo.payment)
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: "正在准备支付",
                mask: true
            });
            HTTP.POST({
              ...getApp().globalData.API.LOGIN.GOPAY,
                payload: {
                  ...orderPayInfo.payment,
                    openid: openid
                }
            })
                .then(payInfo => {
                    console.log("服务端生产的支付信息:", payInfo.data);
                    wx.hideLoading();

                    wx.requestPayment({
                        // timeStamp: "",
                        // nonceStr: "",
                        // package: 'prepay_id=' + payInfo.data.prepay_id,
                        // signType: "MD5",
                        // paySign: "",
                        ...payInfo.data,
                        success: function(res) {
                            console.log("wxapi 支付成功", res);
                            resolve(res);
                        },
                        fail: function(res) {
                            console.log("wxapi 支付失败:", res);
                            reject(res);
                        },
                        complete: function() {}
                    });
                })
                .catch(e => {
                    wx.hideLoading();
                    reject(e);
                });
        });
    };
}

export { PayService };
