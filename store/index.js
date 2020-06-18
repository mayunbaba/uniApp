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
		
		setAllFavData(state, payload){
			//缓存是为了方便调试
			uni.setStorageSync('favData', JSON.stringify(payload));
			this.state.favData = payload;
			// Vue.set(state,'favData',payload);
		},
		
    setScroll(state, payload) {
      Vue.set(state.scroll, payload.key, payload.value);
    },
  },


})