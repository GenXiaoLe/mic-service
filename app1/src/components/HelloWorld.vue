<!--
 * @Author: your name
 * @Date: 2020-10-08 10:12:30
 * @LastEditTime: 2020-10-20 15:23:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mic-service/app1/src/components/HelloWorld.vue
-->
<script>
  export default {
    props: {
      counts: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        counts2: 0
      }
    },
    render () {
      return (
        <div>
          <p>{this.counts}</p>
          <div>
            <p><button onClick={this.add}>增加</button></p>
            <p>{this.counts2}</p>
          </div>
        </div>
      )
    },
    methods: {
      add () {
        this.counts2 += 1
      }
    }
  }
</script>