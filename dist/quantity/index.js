function handle(e, num) {
  var dataset = e.currentTarget.dataset;
  console.log(num)

  console.log(dataset)
  var componentId = dataset.componentId;
  var disabled = dataset.disabled;
  var quantity = +dataset.quantity;
  var obj = dataset.obj;
  if (disabled) return null;

  callback.call(this, componentId, quantity + num,obj);
}

function callback(componentId, quantity, obj) {
  quantity = +quantity;
  var e = { componentId, quantity, obj };
  console.info('[zan:quantity:change]', e);

  if (this.handleZanQuantityChange) {
    this.handleZanQuantityChange(e);
  } else {
    console.warn('页面缺少 handleZanQuantityChange 回调函数');
  }
}

var Quantity = {
  // 减
  _handleZanQuantityMinus(e) {
    console.log(e)
    handle.call(this, e, -1);
  },
//  加
  _handleZanQuantityPlus(e) {
    handle.call(this, e, +1);
  },
 // 输入框
  // _handleZanQuantityBlur(e) {
  //   var dataset = e.currentTarget.dataset;
 
  //   console.log(dataset)
  //   var componentId = dataset.componentId;
  //   var max = +dataset.max;
  //   var min = +dataset.min;
  //   var value = e.detail.value;

  //   if (!value) {
  //     setTimeout(() => {
  //       callback.call(this, componentId, min);
  //     }, 16);
  //     callback.call(this, componentId, value);
  //     return '' + value;
  //   }

  //   value = +value;
  //   if (value > max) {
  //     value = max;
  //   } else if (value < min) {
  //     value = min;
  //   }

  //   callback.call(this, componentId, value);

  //   return '' + value;
  // }
};

module.exports = Quantity;
