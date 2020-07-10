
/**
 * 提示与加载工具类
 */
export default class Tips {
  constructor() {
    this.isLoading = false;
    this.timer = null;
  }
  /**
   * 弹出提示框
   */

  static success(title, duration = 500) {
    setTimeout(() => {
      uni.showToast({
        title: title,
        icon: "success",
        mask: true,
        duration: duration
      });
    }, 300);
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }

  static toast(title, onHide, icon = "success") {
    setTimeout(() => {
      uni.showToast({
        title: title,
        icon: icon,
        mask: true,
        duration: 1000
      });
    }, 300);

    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 1000);
    }
  }

  /**
   * 警告框
   */
  static alert(title) {
    uni.showToast({
      title: title,
      image: "../images/warn-icon.png",
      mask: true,
      duration: 1500
    });
  }

  /**
   * 错误框
   */

  static error(title, onHide) {
    uni.showToast({
      title: title,
      image: "../images/error-icon.png",
      mask: true,
      duration: 1000
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 1000);
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = "加载中") {
    if (Tips.isLoading) {
      return;
    }
    Tips.isLoading = true;
    uni.showLoading({
      title: title,
      mask: true
    });
    clearInterval(this.timer);
    this.timer = setTimeout(()=>{
      if(Tips.isLoading){
        Tips.loaded();
        Tips.error('网络异常，请检查网络');
      }
    },3000)
  }

  /**
   * 加载完毕
   */
  static loaded() {
    if (Tips.isLoading) {
      Tips.isLoading = false;
      uni.hideLoading();
    }
  }

  /**
   * 获取分享数据
   */
  static getShareData(cbFn, con = "") {
    let that = this;
    let oUrl = getCurrentPages().pop().route;
    let params = {
      path: `/${oUrl}`,
      content: con
    };
    
  }

  /**
   * 菜谱详情根据code获取分享数据
   */
  static getShareDataReci(cbFn, code = "") {
    let that = this;
    let oUrl = getCurrentPages().pop().route;
    let params = {
      path: `/${oUrl}`,
      code: code
    };
    
  }

  /**
   * 获取搜索热词
   */
  static getSearchText(cbFn) {
    let that = this;
    bdRequest("/v1/Index/getSearchWords").then(res => {
      if (res.code == 10000 && res.data) {
        let seL = res.data;
        let len = parseFloat(res.data.length);
        let num = Math.ceil(Math.random() * len);
        cbFn(seL[num]);
      }
    });
  }

  /**
   *
   * @param {*} title 模态框标题
   * @param {*} con 模态框内容
   * @param {*} showC 是否隐藏取消按钮
   * @param {*} leftText 模态框左侧按钮文案
   * @param {*} rightText 模态框右侧按钮文案
   * @param {*} okCbFn 模态框右侧按钮回调
   * @param {*} noCbFn 模态框左侧按钮回调
   */
  static openConfirm(params) {
    let showC;
    showC = params.showC ? false : true;
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: params.title || '香哈标题',
        content: params.con || '香哈内容体',
        showCancel: showC,
        confirmText: params.rightText || '确定',
        cancelText: params.leftText || '取消',
        success: res => {
          if (res.confirm) {
            if (params.okCbFn) {
              resolve(params.okCbFn());
            }
          } else if (res.cancel) {
            if (params.noCbFn) {
              reject(params.noCbFn());
            }
          }
        },
        fail: res => {
          reject(params.noCbFn());
        }
      })
    })

  }
}

/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;
