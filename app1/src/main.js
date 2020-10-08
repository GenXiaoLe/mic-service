import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import cheerio from 'cheerio'

Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

import MicServer from '../../micServer/index.js'

const _MicServer = new MicServer()

// 安装微服务
_MicServer.getInstance({
  _axios: axios,
  _vue: Vue,
  _cheerio: cheerio
}).then((_micServer) => {
  // window上的主服务挂载到vue实例上 在其他地方调用内部方法
  Vue.prototype.$MicServer = _micServer
  console.log('子项目 app1 getInstance then', _micServer)

  _micServer.registerApp({
    el: 'app1',
    name: 'app1',
    app: {
      router,
      store,
      render: (h) => h(App)
    }
  })

  // 启动app1
  _micServer.startApp({
    name: 'app1'
  }).then((res) => {
    // 加载项目，添加蒙版
    console.log('子项目 app1 挂在成功，期望结果是界面显示主项目，成功的Vue实例是：', res)
  })
})