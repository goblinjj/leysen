class HTTPService {
    static authenticationHeader() {
        //console.log('能拉到登录信息么： ',__CREDENTIAL__)
        const { credential = {} } = getApp().globalData.authorization;
        // console.log('能拉到登录信息11： ')
        // console.log(getApp().globalData.authorization)
        return {
            // memberid: credential.member_id,
          // memberid: 1,
          // token: credential.token
          openid:wx.getStorageSync("openid")
        };
    }

    static requestHeader(payload, method) {
        console.log(...this.authenticationHeader())
        return {
            "Content-Type": "application/json;charset=utf-8",
            "Access-Control-Allow-Credentials": "true",
            //...this.signatureHeader(payload, method),
            ...this.authenticationHeader()
        };
    }

    /**
     * API 异常统一处理
     * 业务逻辑异常统一处理, message统一为 "Exception"
     *
     * 将服务器返回的异常统一包装未统一错误对象
     *
     */
    static api_exception_process(responseJSON) {
        let errorObject = {
            __EXCEPTION__: true
        };

        //服务器返回的错误码
        switch (responseJSON.status) {
            case 1:
                //错误  通用错误码
                errorObject.statusCode = 1;
                errorObject.noticeMessage = responseJSON.msg;

                break;

            case -1:
                //未登录  统一未登录的提示语言
                errorObject.noticeMessage = responseJSON.msg || "您还未登录,请先登录";
                errorObject.statusCode = -1;
                break;

            case -2:
                //请求内容为空   可用在初次加载和翻页，异步操作
                errorObject.noticeMessage = responseJSON.msg || "请求内容为空";
                errorObject.statusCode = -2;
                break;

            default:
        }

        //服务器异常原文 @fixme 待评估这里是否有必要放置
        errorObject.responseJSON = responseJSON;

        return errorObject;
    }

    /**
     * HTTP 异常统一处理
     * 
     * 
     */
    static exception_process(responseJSON) {
        let errorObject = {
            __ERROR__: true
        };
        //服务器返回的错误码
        /*
        switch (responseJSON.statusCode) {
            case 404:
                //错误  通用错误码
                errorObject.statusCode = 1
                errorObject.noticeMessage = '请求的网页不存在'
                
                break;
                
            case 503:
                errorObject.statusCode = 1
                errorObject.noticeMessage = '服务不可用';
                break;
                
            case 500:
                //请求内容为空   可用在初次加载和翻页，异步操作
                errorObject.statusCode = 1;
                errorObject.noticeMessage = '服务器内部错误';
                break;

                
            default:
        
        }
        */

        //目前统一返回统一为错误信息
        errorObject.statusCode = 1;
        errorObject.noticeMessage = "加载失效, 请稍后再试";

        //服务器异常原文 @fixme 待评估这里是否有必要放置
        errorObject.responseJSON = responseJSON;

        return errorObject;
    }

    /**
     * 网络层 异常统一处理
     * 
     * 
     */
    static error_process() {
        let errorObject = {}; //new Error("Exception");

        //目前统一返回统一为错误信息
        errorObject.statusCode = 1;
        errorObject.noticeMessage = "加载失效, 请稍后再试";

        return errorObject;
    }

    static REQUEST({ url = "", payload = {}, extend_headers = {}, method = "GET" }) {
        //console.log('走接口喽',{url ,payload , extend_headers , method})
        console.log("3333")
        console.log(...HTTPService.requestHeader(payload, method))
        return new Promise((resolve, reject) => {
            wx.request({
                url,
                data: payload,
                header: {
                    ...HTTPService.requestHeader(payload, method),
                    ...extend_headers
                },
                method,
                dataType: "json",
                success: responseJSON => {
                    //console.log('接口的返回原文:',responseJSON)
                    const { data, statusCode, header } = responseJSON;
                    console.log('不成功')
                    console.log(payload)
                    console.log(url)
                    console.log(statusCode)
                    // console.log(responseJSON)
                    //HTTP通讯层状态处理
                    if (statusCode === 200) {
                        //API业务层逻辑处理
                      const { data, code,  msg } = responseJSON.data;
                      console.log('成功')
                      console.log(responseJSON)
                        if (code === 1) {
                          resolve(responseJSON.data);
                        } else {
                            reject(HTTPService.api_exception_process(responseJSON.data));
                        }
                    } else {
                        //HTTP通讯层异常
                      console.log('通讯层异常成功')
                        reject(HTTPService.exception_process(responseJSON));
                    }
                },
                fail: () => {
                    //console.log('接口请求失败');
                    reject(HTTPService.error_process());
                },
                complete: () => {
                    //console.log('接口请求完成');
                }
            });
        });
    }

    static GET({ url, payload, extend_headers }) {
        return this.REQUEST({ url, payload, extend_headers, method: "GET" });
    }

    static POST({ url, payload, extend_headers }) {
        return this.REQUEST({ url, payload, extend_headers, method: "POST" });
    }

    static PUT({ url, payload, extend_headers }) {
        return this.REQUEST({ url, payload, extend_headers, method: "PUT" });
    }

    static DELETE({ url, payload, extend_headers }) {
        return this.REQUEST({ url, payload, extend_headers, method: "DELETE" });
    }

    static PATCH({ url, payload, extend_headers }) {
        return this.REQUEST({ url, payload, extend_headers, method: "PATCH" });
    }
}

export { HTTPService };
