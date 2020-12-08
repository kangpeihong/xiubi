import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.less'
import axios from 'axios'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import htmlToPdf from './utils/htmlToPdf'
import animated from 'animate.css'
import "./assets/iconfont/iconfont.css"
import utils from "./assets/js/utils";
import request from "./assets/js/request";
import Print from 'vue-print-nb'
Vue.use(Print);
Vue.use(animated)
Vue.use(htmlToPdf)
Vue.use(ElementUi)
Vue.config.productionTip = false
axios.defaults.baseURL = 'https://www.xiubi.com.cn:8000'
Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.prototype.$request = request



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
