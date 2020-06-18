import Vue from 'vue'
import App from './App'
import store from './store'
import customTabBar from '@/module/custom-tab-bar/index.vue';

Vue.config.productionTip = false;
Vue.prototype.$store = store;

Vue.component('custom-tab-bar', customTabBar);

App.mpType = 'app'

new Vue({
  render: h => h(App)
}).$mount('#app')


