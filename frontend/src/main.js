import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import store from './store'
import common from './js/common.js'
import io from 'socket.io-client'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$common = common
Vue.prototype.$io = io;

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
