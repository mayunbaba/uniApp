import Vue from 'vue'
import Vuex from 'vuex'
import {
	request
} from '@/utils/request.js';

Vue.use(Vuex)




let token = {},
	userInfo = {};
try {
	if (uni.getStorageSync('token')) {
		token = JSON.parse(uni.getStorageSync('token'));
	}
	if (uni.getStorageSync('userInfo')) {
		userInfo = JSON.parse(uni.getStorageSync('userInfo'));
	}
} catch (e) {
	console.log(e);
}

export default new Vuex.Store({

	state: {
		userInfo: userInfo,
		token: token,
		favData: [],
	},

	actions: {
		// 设置收藏数据
		setAllFavData(context, payload) {
			return new Promise((resolve, reject) => {
				request("/v1/fav/favList?", {
					type: payload.type,
					page: payload.page
				}).then(res => {
					if (res.code == 10000 && res.data) {
						context.state.favData[payload.index] = [
							...(context.state.favData[payload.index] || []),
							...res.data.list
						];
						Vue.set(
							context.state.favData,
							payload.index,
							context.state.favData[payload.index]
						);
						resolve(res);
					}
				});
			})

		},
	},

	mutations: {
		setUserInfo(state, payload) {
			uni.setStorageSync('userInfo', JSON.stringify(payload));
			Vue.set(state, 'userInfo', payload);
		},

		setToken(state, payload) {
			uni.setStorageSync('token', JSON.stringify(payload));
			Vue.set(state, 'token', payload);
		},

		initFavData(state, payload) {
			Vue.set(state, 'favData', payload);
		},

		// 修改菜谱数据
		changeDishData(state, payload) {
			if (payload.type == 'add') {
				let {dish} = payload;
				let data = {
					"code": dish.code,
					"type": dish.type,
					"title": dish.name,
					"favTime": "刚刚",
					"image": {
						"width": 500,
						"height": 500,
						"url": dish.img
					},
					"customer": dish.customer
				};
				this.state.favData[0].unshift(data);
			} else {
				this.state.favData[0] = this.state.favData[0].filter((item) => {
					return item.code != payload.dish.code;
				})
				Vue.set(state.favData, '0', this.state.favData[0]);
			}
		},
		// 修改视频数据
		changeVideoData(state, payload) {
			if (payload.type == 'add') {
				let {dish} = payload;
				let data = {
					"code": dish.code,
					"type": 7,
					"title": dish.name,
					"favTime": "刚刚",
					"image": {
						"width": dish.video.width,
						"height": dish.video.height,
						"url": dish.video.img
					},
					"customer": dish.customer
				};
				this.state.favData[1].unshift(data);
			} else {
				this.state.favData[1] = this.state.favData[1].filter((item) => {
					return item.code != payload.dish.code;
				})
				Vue.set(state.favData, '1', this.state.favData[1]);
			}
		},


	},


})
