<template>
    <div>
      <!-- 统计图容器 -->
      <div id="main" style="width: 100%;height: 800px;" />
    </div>
  </template>
  <script>
  
  export default {
    name: "echartsdata",
    props: ['xdata','ydata'],
    data() {
      return {
       
      }
    },
    methods: {
      echarts(xdata,ydata) {
        var echarts = require('echarts')
        // 初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
        // 配置参数
        var option = {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data: ['录入数']
          },
          xAxis: {
            data: xdata
          },
          yAxis: {},
          series: [{
            name: '录入数',
            type: 'bar',
            data: ydata
          }]
        }
        myChart.setOption(option)
      }
  
    },
    mounted() {
  
      setTimeout(() => {
        this.echarts(this.xdata,this.ydata);
      }, 500)
      
    }
  }
  </script>