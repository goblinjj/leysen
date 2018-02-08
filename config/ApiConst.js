const API_URL = `https://leysen.zoomdoit.com/dev`;
// const API_URL = `https://watch.ctfmall.com/index.php/m`; //正式环境


const API_CONST = {
    HOME: {
      LIST: { url: `${API_URL}/shop/index/getCategory`, method: "GET" },
        // RECOMMEND: { url: `${API_URL}/home-recommend.html`, method: "GET" }
    },
    GIFT: {
      GIFTKIND: { url: `${API_URL}/shop/product/randGift`, method: "GET" },
      PROVINCE: { url: `${API_URL}/shop/store/getProvince`, method: "POST" },
      CITY: { url: `${API_URL}/shop/store/cityStore`, method: "POST" },
      STORE: { url: `${API_URL}/shop/store/getStore`, method: "POST" },
      SUBMIT: { url: `${API_URL}/shop/order/storegift`, method: "POST" }
    },
    MYORDER: {
        LIST: { url: `${API_URL}/shop/order/getOrderForType`, method: "GET" },
        BACK: { url: `${API_URL}/shop/order/refund`, method: "GET" }, 
        USE: { url: `${API_URL}/shop/order/getQrcode`, method: "GET" }
    },
    CARD: {
      CARDLIST: { url: `${API_URL}/shop/product/getListForCategory`, method: "GET" },
      SETORDER: { url: `${API_URL}/shop/product/order`, method: "POST" }
    },
    LOGIN: {
      STATUS: { url: `${API_URL}/shop/index/userInfo`, method: "POST"},
      CHEACK: { url: `${API_URL}/shop/index/checkUserRegister`, method: "POST"},
      PICCODE: { url: `${API_URL}/shop/product/getCaptcha`, method: "POST" },
      NUMCODE: { url: `${API_URL}/shop/product/authPhone`, method: "POST"},
      REGISTER: { url: `${API_URL}/shop/product/saveContact`, method: "POST" },
      GOPAY: { url: `${API_URL}/shop/product/pay`, method: "POST"}    
    },
    STORE: {
      LIST: { url: `${API_URL}/shop/product/getStore`, method: "POST" },
    },
    SEND: {
      TOSEND: { url: `${API_URL}/shop/order/give`, method: "POST" },
      GETGIFT:{  url: `${API_URL}/shop/order/get`, method: "POST" },
      UPAUDIO: { url: `${API_URL}/shop/give/upload`, method: "POST" },
      GIFTINFO: { url: `${API_URL}/shop/give/giveInfo`, method: "POST"}
    }
};
module.exports = API_CONST;
