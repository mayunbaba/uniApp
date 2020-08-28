import store from '../store';

import {
	sleep,
	computData
} from './secret.js'

// MP-WEIXIN	微信小程序
// MP-ALIPAY	支付宝小程序
// MP-BAIDU	百度小程序
// MP-TOUTIAO	字节跳动小程序
// MP-QQ	QQ小程序
// MP-360	360小程序
// MP 小程序

// H5配置
// #ifdef H5
const Host = '';
const Platfrom = '/baidu';
const Appid = 2;
const SecStr = 'C99283E93A44FD59';
// #endif

// 小程序配置
// #ifdef MP-BAIDU
const Host = 'https://apielf.xiangha.com';
const Platfrom = '/baidu';
const Appid = 2;
const SecStr = 'C99283E93A44FD59';
// #endif
// #ifdef MP-TOUTIAO
const Host = 'https://apielf.xiangha.com';
// const Host = 'https://apielf.ixiangha.com:9906';
const Platfrom = '/TouTiao';
const Appid = 7;
const SecStr = '300DA0FBB6662A42';
// #endif
// #ifdef MP-ALIPAY
const Host = 'https://apielf.xiangha.com';
// const Host = 'https://apielf.ixiangha.com:9906';
const Platfrom = '/uc';
const Appid = 6;
const SecStr = 'C5CAE70A0EFD7FAC';

// #endif
// #ifdef MP-WEIXIN
const Host = 'https://apielf.xiangha.com';
const Platfrom = '/baidu';
const Appid = 2;
const SecStr = 'C99283E93A44FD59';
// #endif



let loading = false;

function request(url, params = {}, method = 'post') {
	return checkToken().then(() => {
		return new Promise((resolve, reject) => {
			params.userCode = store.state.userInfo.code || ''
			uni.request({
				header: {
					'Content-Type': 'application/json',
					'XH-Client-Data': computData(params, store.state.token, Appid, SecStr)
				},
				data: params,
				url: Host + Platfrom + url,
				method,
				success: (res) => {
					if (res && res.statusCode == 200 && res.data) {
						if (res.data.code == 10000) {
							resolve(res.data)
						} else {
							reject(res)
						}
					} else {
						reject(res)
					}
				}
			})
		})
	})
}

// 检查token是否合法
function checkToken() {
	return new Promise((resolve) => {
		if (store.state.token.data && store.state.token.time > new Date()) {
			resolve()
		} else {
			if (loading) {
				sleep(20).then(checkToken).then(resolve);
			} else {
				getServiceToken().then(resolve);
			}
		}
	})
}

// 服务端获取token
function getServiceToken() {
	loading = true;
	return new Promise((resolve, reject) => {
		let clientData = {
			appId: Appid
		}
		uni.request({
			header: {
				'Content-Type': 'application/json',
				'XH-Client-Data': JSON.stringify(clientData)
			},
			url: Host + '/common/public/auth/getToken',
			method: 'post',
			dataType: 'json',
			success: (res) => {
				loading = false;
				if (res.data.code === 10000) {
					store.commit("setToken", {
						data: res.data.data.token,
						time: new Date().getTime() + 1000 * 60 * 30
					})
					resolve();
				} else {
					reject();
				}
			}
		})
	})

}

export {
	request
};
