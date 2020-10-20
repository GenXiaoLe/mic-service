<!--
 * @Author: your name
 * @Date: 2020-10-08 10:17:04
 * @LastEditTime: 2020-10-20 15:17:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mic-service/app1/src/views/About.vue
-->
<template>
  <div class="home">
    <h1>我是 App1 About 页面</h1>
    <button @click="count">增加</button>
    <Test :counts="counts" />
  </div>
</template>

<script>
import Test from '../components/HelloWorld'
export default {
  name: 'Home',
  components: {
    Test
  },
  data () {
    return {
      counts: 0
    }
  },
  methods: {
    count() {
      this.counts += 1
    }
  }
}
</script>