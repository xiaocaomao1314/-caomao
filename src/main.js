import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/common.css'
import axios from 'axios'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import moment from 'moment'
import tree from 'vue-table-with-tree-grid'
import echarts from 'echarts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
// ----------------------------------------------------
// ------------------------------------------------------
Vue.component('tree-table', tree)
Vue.use(ElementUI)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// Vue.prototype.$http = axios

Object.defineProperties(Vue.prototype,{
  '$http':{
    value:axios,
    writable: true
  },
  '$message':{
    value:Message,
    writable: true
  },
  '$moment':{
    value:moment,
    writable:true
  },
  '$echarts':{
    value:echarts,
    writable:true
  }
})
// Vue.component('page',Page)
// Vue.component('search',Search)
// Vue.component('list',List)
 new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
