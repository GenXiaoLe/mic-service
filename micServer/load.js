/* eslint-disable */
// js等资源加载文件
// 用于拉取其他服务上的js等并进行解析加载

// 加载服务资源
const loadAppResource = (server, name, cb) => {
  console.log(`开始加载项目${name}资源`)

  const app = server.apps[name]

  if (!app) {
    cb && cb({
      success: false,
      msg: `未找到注册过 ${name} !`
    })
    return
  }
  console.log(app)

  if (!app.host) {
    cb && cb({
      success: false,
      msg: `未找到 ${name} 项目资源地址`
    })
    return
  }

  loadHtml(server, app.host, name, cb)
}

// 拉取网页html资源
const loadHtml = (server, host, name, cb) => {
  // 获取资源
  server._axios({
    method: 'get',
    url: `${host}?times=${new Date().valueOf()}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {}
  }).then((res) => {
    // 请求到的页面资源
    let htmlStr = res.data
    console.log('htmlStr----->', htmlStr)
    getScriptLink(server, host, name, cb, htmlStr)
  },(error) => {
    console.log('资源加载出错了', host, error)
    cb && cb({
      success: false,
      msg: `加载 ${name} 资源错误`
    })
  }).catch((e) => {
    console.log('运行异常',e)
  })
}

// 分析 html 结构，拉取资源
const getScriptLink = (server, host, name, cb, html) => {
  // 使用服务传入的cheerio解析html资源
  const $ = server._cheerio.load(html)
  // 获取link资源
  let linkList = []
  $('link').each((i, ele) => {
    if (ele.type === 'tag' && ele.name === 'link') {
      linkList.push({
        link: host + ele.attribs.href,
        rel: ele.attribs.rel,
        as: ele.attribs.as,
        type: ele.attribs.type,
        loaded: false
      })
    }
  })

  // 获取script资源
  let scriptList = []
  $('script').each((i, ele) => {
    if (ele.type === 'script' && ele.name === 'script') {
      scriptList.push({
        link: host + ele.attribs.src,
        chaerset: ele.attribs.chaerset,
        async: ele.attribs.async,
        defer: ele.attribs.defer,
        loaded: false
      })
    }
  })

  // 根据script 去重 linkScript
  linkList = linkList.filter(item => {
    let flag = true
    scriptList.forEach(itm => {
      if (item.link === itm.link) {
        flag = false
      }
    })
    return flag
  });

  console.log('linkList', linkList)
  console.log('scriptList', scriptList)
  // 2. 挂载资源
  appendDOMElement(server, linkList, 'link')
  appendDOMElement(server, scriptList, 'script', name, cb)
}

// 添加相关属性 挂载资源
const appendDOMElement = (server, list, type, name, cb) => {
  list.forEach(item => {
    // 如果资源加载过，则不在重新加载
    if (item.loaded) {
      return
    }

    // 如果是以js结尾的地址
    if (item.link.slice(-2) === 'js') {
      // 最后加载app.js，因为有依赖，必须等到其余资源加载完毕后在加载app.js
      // 形式为app+时间戳.js
      let flag = /app\.(\w+\.)?js/.test(item.link)

      if (flag) {
        item.loaded = true
        console.log('是首页 - 过滤不加载，最后加载app.js', item)
        return
      }

      // 将js资源加载到body
      const script = document.createElement('script')

      // 增加属性
      script.src = item.link
      
      // 如果有这些属性则进行设置
      if (item.chaerset) {
        script.chaerset = item.chaerset
      }
      if (item.async) {
        script.async = item.async
      }
      if (item.defer) {
        script.defer = item.defer
      }
      
      // 如果不是link类型
      if (type !== 'link') {
        addEventScript(server, list, script, item, name, false, cb)
      }

      script.setAttribute('mic', 'mic')
      // 插入到body中
      document.body.append(script)
    }
  })
}

// 加载js添加完成后的回调事件
const addEventScript = (server, list, script, item, name, isApp, cb) => {
  if (script.addEventListener) {
    script.addEventListener('load', () => {
      item.loaded = true
      // 查询所有js是否全部加载完毕，加载完毕后，加载app.js
      let flag = true
      list.forEach(el => {
        if (el.link.slice(-2) === 'js') {
          if (!el.loaded) {
            flag = false
          }
        }
      })
      // 全部加载完毕
      if (flag) {
        if (isApp) {
          // app.js，说明加载完毕了
          const instance = server.apps[name].instance
          cb && cb({
            success: true,
            appName: name,
            instance: instance
          })
        } else {
          // 待别的js加载完成后最后加载app.js
          loadApp(server, list, name, cb)
        }
      }
    })
  } else if (script.attachEvent) {}
}

// 加载 app.js
function loadApp (server, list, name, cb) {
  list.forEach((item) => {
    let flag = /app\.(\w+\.)?js/.test(item.link)
    if (flag) {
      console.log('最后一个js是', item.link)
      // js资源，加载到body
      let script = document.createElement('script')
      // 添加属性
      script.src = item.link
      if (item.chaerset) {
        script.chaerset = item.chaerset
      }
      if (item.async) {
        script.async = item.async
      }
      if (item.defer) {
        script.defer = item.defer
      }
      addEventScript(server, list, script, item, name, true, cb)
      document.body.append(script)
    }
  })
}

export {
  loadAppResource
}