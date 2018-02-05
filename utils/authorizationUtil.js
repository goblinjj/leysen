/**
 *
 * 用户验证模块
 *
 *
 * 服务端目前是基于token的验证机制，持续有效
 *
 */
import { HTTPService as HTTP } from "../services/HTTPService";
// const CHEACK = getApp().globalData.API.LOGIN.CHEACK;
//初始化
const init = function () {
  //仅检测微信侧登录是否有效
  wx.checkSession({
    success: function () {
      //session有效，并且在本生命周期一直有效
      console.log("微信登录session有效");
      //processLogin()
      initPreLogin(); //实际无必要，目前只是确保微信session一致有效
    },
    fail: function () {
      //session已过期 登录态过期
      console.log("微信登录session已失效");
      //重新登录 并且维护用户登录状态
      initPreLogin();
    },
    complete: function () {
      // console.log('微信登录session检测完成')
    }
  });
};

//登录失败 或 手动触发以清除登录状态
// const clearLogin = function() {
//     try {
//         wx.removeStorageSync("authorization");
//         getApp().globalData.authorization = {};
//         console.log("清楚登录状态成功");
//     } catch (e) {
//         console.log("清楚登录状态失败", e);
//     }
// };

//初始化登录
const initPreLogin = function () {
  wx.login({
    success: function (res) {
      // if (res.code) {
      //     console.log("wx.login 获取用户登录态成功", res);

      //     HTTP.GET({
      //         ...getApp().globalData.API.PASSPORT.PRE_LOGIN,
      //         payload: {
      //             code: res.code
      //         }
      //     })
      //         .then(data => {
      //             //服务端登录成功， 查询到已绑定手机号码， 服务端已返回登录成功的信息
      //             processLogin(data);
      //         })
      //         .catch(e => {
      //             if (e.statusCode === -1) {
      //                 //服务端预登录成功,  但该微信账户未绑定手机号码
      //                 processLogin(e.responseJSON.data);
      //             } else {
      //                 //服务端预登录失败,  未获取到该微信账户的信息
      //                 clearLogin();
      //             }
      //         });
      // } else {
      //     console.log("wx.login 获取用户登录凭证code失败！" + res.errMsg);
      //     clearLogin();
      // }





    },
    fail: function () {
      console.log("wx.login 微信登录失败");
      clearLogin();
    },
    complete: function () {
      //console.log('微信登录操作完成')
    }
  });
};

//根据服务端返回的信息, 处理本地登录状态
// const processLogin = (authorizationResponse = {}) => {
//   let authorizationState = "";

//   const { credential = {}, user_object = {} } = authorizationResponse;

//   //当前登录成功的唯一判断依据
//   if (credential.member_id && credential.token && user_object.mobile) {
//     authorizationState = "isAuthorized";
//   } else {
//     authorizationState = "isUnAuthorized";
//   }

//   wx.setStorageSync("authorization", {
//     ...authorizationResponse,
//     status: authorizationState
//   });

//   //同步登录状态到globalData中
//   getApp().globalData.authorization = wx.getStorageSync("authorization");

//   console.log(
//     "登录信息已存储在storage,并已同步至globalData ",
//     wx.getStorageSync("authorization")
//   );
// };

/**
 * 检测当前是否登录有效
 * 返回bool
 */

const checkLogin = function () {
  const {
        credential = {},
    user_object = {},
    status = ""
    } = getApp().globalData.authorization;

  return status === "isAuthorized";
};

//登出
// const logout = function() {
//     try {
//         clearLogin();
//         console.log("登出成功");
//         return true;
//     } catch (e) {
//         console.log("登出失败", e);
//         return false;
//     }
// };

//绑定手机号 代理模式
const goLogin = route => {
  console.log(route);
  wx.navigateTo({
    url: "/pages/authorization/login/login?scene=normal"
  });
};

//获取微信的关联手机号码
const getWxMobile = ({ encryptedData, iv }) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          HTTP.GET({
            ...getApp().globalData.API.PASSPORT.WX_MOBILE,
            payload: {
              code: res.code,
              encryptedData,
              iv
            }
          })
            .then(data => {
              resolve(data);
            })
            .catch(e => {
              reject(e);
            });
        } else {
          reject(res.errMsg);
        }
      },
      fail: function () {
        reject("wx.login 微信登录失败");
      },
      complete: function () {
        //console.log('微信登录操作完成')
      }
    });
  });
};

//绑定手机号 并登录
// const bindMobile = ({ mobile, captcha }) => {
//   const { user_object = {} } = getApp().globalData.authorization;

//   return new Promise((resolve, reject) => {
//     const { wx_user_info = {} } = user_object;
//     const { unionid, openid } = wx_user_info;

//     if (!unionid && !openid) {
//       reject({
//         noticeMessage: "登录失败"
//       });
//     } else {
//       HTTP.GET({
//         ...getApp().globalData.API.PASSPORT.BIND_MOBILE,
//         payload: {
//           unionid,
//           openid,
//           mobile,
//           captcha
//         }
//       })
//         .then(data => {
//           processLogin(data); //处理登录态
//           resolve(data);
//         })
//         .catch(e => {
//           reject(e);
//         });
//     }
//   });
// };




//此处应判断  是否需要bind 手机号的逻辑

// var openid = wx.getStorageSync('openid');
// if (!openid) {
//   console.log("用户未授权");
//   wx.getSetting({
//   success: function(data) {
//     if (data.authSetting["scope.userInfo"] == false) {
//       wx.showModal({
//         title: '用户未授权',
//         content: '如需登录并正常使用，请按确定并在授权管理中选中“用户信息”，然后点击确定即可正常使用。',
//         showCancel: false,
//         success: function (res) {
//           if (res.confirm) {
//             wx.openSetting({
//               success: function success(res) {
//                 if (res.authSetting["scope.userInfo"] == true) {
//                   console.log("用户已授权");
//                   app.getUserInfo(); // 自己用来获取用户数据的函数
//                 }
//                }
//              });
//            }
//          }
//        })
//       }
//     }
//   });
// }
// 判断是否注册
const checkRister = (jumb) => {
    console.log('判断是否注册')
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
            if (data.data.status == 0) {
              // 注册成功
              console.log('注册成功')
              return true

            } else{
              // 未注册
              console.log('未注册')
              wx.navigateTo({
                url: jumb +'?routePath='+ path
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
    
    }else{
         console.log("用户未授权");
    }

}
module.exports = {
  init,
  // logout,
  checkLogin,
  goLogin,
  getWxMobile,
  // bindMobile,
  checkRister

};
