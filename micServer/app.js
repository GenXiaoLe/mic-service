/* eslint-disable */
// app挂载相关方法文件

// 注册服务的方法
const registerApp = (server, options) => {
  console.log('需要注册的的服务----->', server, '服务的配置项------->', options)

  // 挂载服务hash集合
  const apps = server.apps || {}
  // 配置项内容
  const {name, el, app, host, type} = options

  // 服务内部结构
  const _APPITEM = {
    el, // 根节点DOM
    app, // 服务实例的相关配置项
    host, // 服务地址
    type: type || 'vue' // 服务类型
  }

  if (Object.prototype.hasOwnProperty.call(apps, name)) {
    // 如果app已经存在则进行更新操作
    console.log('合并app----->', apps[name])
    apps[name] = Object.assign(apps[name], _APPITEM)
  } else {
    // 如果app不存在则新增app
    apps[name] = _APPITEM
  }
}

// 启动服务的方法
const startApp = (server, options) => {
  console.log('需要启动的的服务----->', server, '服务的配置项------->', options)

  return new Promise((resolve, reject) => {
    // 服务集合
    const apps = server.apps || {}
    // 需要启动的服务名
    const name = options.name

    if (!name) {
      reject('服务名不能为空')
      return
    }

    // 需要启动的服务
    const app = apps[name]
    
    // 如果项目实例存在
    if (app.instance) {
      console.log(`${name} 项目已经被挂载，项目是 ${app} `)
      return app.instance
    }

    // 检查元素是否存在
    let el = document.getElementById(app.el)
    if (!el) {
      reject(`挂载 ${name} App 获取DOM元素失败 -- ${el}`)
      return
    }
    
    // 如果被挂载的实例类型为vue
    if (app.type === 'vue') {
      // 服务实例
      const _vue = server._vue
      // 服务实例化
      app.instance = new _vue(app.app)
      
      // 激活服务
      const vm = app.instance.$mount(`#${app.el}`)

      if (vm) {
        console.log('startApp', name + ' Vue：加载成功')
        resolve(vm)
      } else {
        console.log('startApp', name + ' Vue：加载失败')
        reject(vm)
      }
    }
  })
}

// 获取服务实例的方法
const getInstance = (server, options) => {
  const name = options.name

  if (!name) {
    console.log('服务名不能为空')
    return
  }

  const app = server.apps[name]

  if (app) {
    // 如果服务存在 则返回服务实例
    return app.instance
  }
  return false
}

export {
  registerApp,
  startApp,
  getInstance
}