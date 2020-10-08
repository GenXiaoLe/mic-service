<template>
  <el-container style="height:100%;">
    <el-aside
      style="border-right:1px solid #ccc;">
      <div>
        <h1 style="margin-left:30px;" @click="pushHome">XXX管理系统</h1>
      </div>
      <el-menu
        style="height:100%;border-top:1px solid #ccc;"
        default-active="1">
        <el-submenu v-for="item  in routerList" :index="''+item.id"  :key="''+item.id">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.label}}</span>
          </template>
          <el-menu-item v-for="itm in item.children" :index="''+itm.id" :key = "'' + itm.id">
            <div @click="jumpRouter(item.appName, itm.path)">{{itm.label}}</div>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="page-header">
        <h3>xxx，您好！</h3>
      </el-header>
      <el-main>
        <div v-show="ActiveName === 'main'">
          <h1>欢迎访问XXX管理系统</h1>
          <h1>{{new Date()}}</h1>
        </div>
        <div v-show="ActiveName === 'app1'">
          <div id="app1"></div>
        </div>
        <div v-show="ActiveName === 'app2'">
          <div id="app2"></div>
        </div>
        <div v-show="ActiveName === 'app3'">
          <div id="app3"></div>
        </div>
        <div v-show="ActiveName === 'app4'">
          <div id="app4"></div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "",
  mixins: [],
  props: {},
  components: {},
  data() {
    return {
      routerList: [
        {
          id: 1,
          label: 'Vue - App1',
          icon: 'el-icon-platform-eleme',
          appName: 'app1', // 归属那个App
          children: [
            {
              id: 11,
              label: 'app1 - home',
              path: '/app1/home'
            },
            {
              id: 12,
              label: 'app1 - about',
              path: '/app1/about'
            }
          ]
        },
        {
          id: 2,
          label: 'Vue - App2',
          icon: 'el-icon-s-platform',
          appName: 'app2', // 归属那个App
          children: [
            {
              id: 21,
              label: 'app2 - home',
              path: '/app2/home'
            },
            {
              id: 22,
              label: 'app2 - about',
              path: '/app2/about'
            }
          ]
        },
        {
          id: 3,
          label: 'Vue - App3',
          icon: 'el-icon-s-grid',
          appName: 'app3', // 归属那个App
          children: [
            {
              id: 31,
              label: 'app3 - home',
              path: '/app3/home'
            },
            {
              id: 32,
              label: 'app3 - about',
              path: '/app3/about'
            }
          ]
        }
      ]
    };
  },
  watch: {},
  computed: {
    ...mapGetters(['ActiveName']),
  },
  created() {},
  mounted() {},
  methods: {
    pushHome () {
      this.$router.push({
        path: '/'
      })
      this.ActiveName = 'main'
    },
    jumpRouter (appName, path) {
      console.log('跳转页面',this.$MicServer, appName, path)
      // 跳转页面
      this.$MicServer.pushRouter({appName, path}, (res) => {
        console.log(res)
        if (res.success) {
          if (appName === 'app4') {
            this.$message.error('暂未添加路由功能')
            this.$store.commit('set_activeName', appName)
          } else {
            this.$store.commit('set_activeName', appName)
            res.instance.$router.push({
              path: path
            })
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.page-header {
  border-bottom: 1px solid #ccc;
  h3 {
    text-align: right;
  }
}
</style>