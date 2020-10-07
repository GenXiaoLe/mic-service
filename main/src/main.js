/* eslint-disable */

import Vue from 'vue'
import Axios from 'axios'
import cheerio from 'cheerio'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(ElementUI);

Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

// 子服务地址 这里测试用例写死 生产环境需要动态配置
const appList = [
  {
    name: 'app1',
    host: 'http://localhost:8002'
  },
  {
    name: 'app2',
    host: 'http://localhost:8003'
  },
  {
    name: 'app3',
    host: 'http://localhost:8004'
  },
  {
    name: 'app4',
    host: 'http://localhost:8005'
  }
]

import MicServer from '../../micServer/index.js'

const _MicServer = new MicServer()

// 初始化微服务
_MicServer.getInstance({
  _axios: Axios,
  _vue: Vue,
  _cheerio: cheerio,
  appList: appList
}).then((_micServer) => {
  // window上的主服务挂载到vue实例上
  Vue.prototype.$MicServer = _micServer
  console.log('主项目 getInstance then', _micServer)

  // 注册服务
  // 须传入name, el, app, host, type
  _micServer.registerApp({
    el: 'app',
    name: 'main',
    app: {
      router,
      store,
      render: (h) => h(App)
    },
    type: 'vue',
    host: ''
  })

  // 启动服务
  _micServer.startApp({
    name: 'main'
  }).then((vm) => {
    // 获取挂在后返回的实例
    console.log('主项目 main 挂在成功，期望结果是界面显示主项目，成功的Vue实例是：', vm)
    // 获取当前路由地址
    const path = window.location.pathname
    // 刷新默认先跳转到首页
    vm.$router.push('/')
    // 如果当前不是首页
    if (path !== '/') {
      // 获取服务名 约定所有地址均以服务名开头 例如主服务即main/xxx/xxx
      const appName = path.slice(1,5)
      // 调用方法进行路由跳转
      _micServer.pushRouter({ appName, path }, (res) => {
        if (res.success) {
          // 获取到的实例
          const _instance = res.instance
          _instance.$router.push({
            path
          })
        } else {
          res.$message.error(res.msg)
        }
      })
    }
  })
})


