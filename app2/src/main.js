import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import cheerio from 'cheerio'

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

import MicServer from '../../micServer/index';

const _MicServer = new MicServer()

_MicServer.getInstance({
  _axios: axios,
  _vue: Vue,
  _cheerio: cheerio
}).then(_micServer => {
    // window上的主服务挂载到vue实例上 在其他地方调用内部方法
    Vue.prototype.$MicServer = _micServer
    console.log('子项目 app2 getInstance then', _micServer)

    _micServer.registerApp({
      el: 'app2',
      name: 'app2',
      app: {
        router,
        store,
        render: (h) => h(App)
      }
    })

    _micServer.startApp({
      name: 'app2'
    }).then(res => {
      // 加载项目，添加蒙版
      console.log('子项目 app2 挂在成功，期望结果是界面显示主项目，成功的Vue实例是：', res)
    })
})
