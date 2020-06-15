import Vue from 'vue'
import App from './App'
import store from './store'


Vue.config.productionTip = false

App.mpType = 'app'

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
