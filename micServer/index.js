// 微服务实例文件
// MicServer实例在主框架加载后挂载在window上，方便各个子服务调用
// 包含初始化，注册app，启动app 路由跳转方法

import { registerApp, startApp, getInstance } from './app.js'
import { loadAppResource } from './load.js'

export default class MicServer {
  constructor () {
    this.apps = {}
  }

  // 初始化服务调用 初始化实例方法 返回一个promise
  /** 
   * options
   * @params _axios 服务axios实例
   * @params _vue 服务自身vue实例
   * @params _cheerio 服务自身_cheerio实例 cheerio是为服务器特别定制的，快速、灵活、实施的jQuery核心实现
   * @params appList 主服务传入的子服务app列表
   * @params app 服务实例配置项
   * @params name 服务名称
   * @params instance 服务实例化后的单例
  */
  getInstance (options = {}) {
    console.log(options, '------>服务传入相关配置项')

    return new Promise((resolve, reject) => {
      // 如果window上没有实例，则进行挂载
      if (!window._MICSERVER) {
        window._MICSERVER = {}
      }

      console.log(window._MICSERVER)

      // 如果是第一次进行初始化，对实例进行属性、方法初始化
      if (window._MICSERVER.instance === undefined) {
        console.log('-----首次加载，初始化实例方法-----')
        
        // 储存实例化后的实例，供服务中调用
        window._MICSERVER.instance = new MicServer(options)
        window._MICSERVER.instance._axios = options._axios
        window._MICSERVER.instance._vue = options._vue
        window._MICSERVER.instance._cheerio = options._cheerio

        const appList = options.appList || []
        appList.forEach(app => {
          registerApp(window._MICSERVER.instance, app)
        })
      }

      resolve(window._MICSERVER.instance)
    })
  }

  // 注册App，每次添加一个App就调用一次
  registerApp (options = {}) {
    registerApp(this, options)
  }

  // 启动app
  startApp (options = {}) {
    return startApp(this, options)
  }

  // 路由跳转
  pushRouter (options = {}, cb) {
    console.log(options, '-------> 服务间路由跳转start')
    // 判断要跳转的资源是否有实例
    const instance = getInstance(this, options)

    if (instance) {
      // 有实例则进行跳转
      cb && cb({
        success: true,
        instance
      })
    } else {
      // 无实例 先进行资源加载load
      console.log(`${options.appName} 无实例，先加载资源`)
      loadAppResource(this, options.appName, cb)
    }
  }
}