import Vue from 'vue'
import App from './App'
import store from './store'
import pageFoot from './components/tabbar/page-foot.vue'


Vue.config.productionTip = false
Vue.prototype.$store = store;

Vue.component('page-foot', pageFoot)

App.mpType = 'app'

new Vue({
  render: h => h(App)
}).$mount('#app')


