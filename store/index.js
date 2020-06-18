import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)




let token = {},userInfo={};
try{
    if(uni.getStorageSync('token')){
			token = JSON.parse(uni.getStorageSync('token'));
    }
    if(uni.getStorageSync('userInfo')){
			userInfo = JSON.parse(uni.getStorageSync('userInfo'));
    }
} catch (e){
  console.log(e);
}

export default new Vuex.Store({

  state: {
    userInfo: userInfo,
    token: token,
    favData: [],
  },

  actions: {

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
		// 设置收藏数据
		setAllFavData(state, payload){
			this.state.favData = payload;
			console.log(this.state.favData);
			// Vue.set(state,'favData',payload);
		},
		// 修改菜谱数据
		changeDishData(state, payload){
			if(payload.type == 'add'){
				
			}else{
				this.state.favData[0] = this.state.favData[0].filter((item)=>{
					return item.code != payload.code;
				})
				// this.state.favData[0].pop();
				Vue.set(state, 'favData', this.state.favData);
				console.log(this.state.favData);
			}
		},
		// 修改视频数据
		changeVideoData(state, payload){
			
		},
		
    setScroll(state, payload) {
      Vue.set(state.scroll, payload.key, payload.value);
    },
  },


})