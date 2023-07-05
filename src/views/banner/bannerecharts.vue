<template>
  <div>
    <!-- 统计图容器 -->
    <echartsdata :xdata="xdata" :ydata="ydata"></echartsdata>
  </div>
</template>
<script>

import echartsdata from '../../components/echarts/zhuzhuang.vue'

import { echartsbanner } from '@/api/table'

export default {
  components: {
    echartsdata
  },
  data() {
    return {
      'xdata': [],
      'ydata': []
    }
  },
  created() {
    this.ajaxData()
  },
  methods: {

    ajaxData() {
      echartsbanner({}).then(response => {

        response.data.forEach((item, index) => {

          this.xdata.push(item.date_month)
          this.ydata.push(item.total)
          
        })

      })
    }


  }

}
</script>