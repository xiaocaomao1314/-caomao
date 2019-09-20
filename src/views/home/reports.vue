<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
      <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="box" ref="form">
      </div>
      
    </el-card>
  </div>
</template>
<script>
import {status} from "@/views/index.js"
  export default {
    
    data() {
      return {
          status,
        option : {
    title: {
        text: '用户信息来源'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
        }
    ],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
  
}
      }
    },
    methods: {
    async reports(){
      const {data:res} = await this.$http.get('reports/type/1')
      this.status(res,200)
    res.data.xAxis[0]=Object.assign(res.data.xAxis[0],this.option.xAxis[0])
    this.option=Object.assign(this.option,res.data)
    console.log(this.option)
      this.$echarts.init(this.$refs.form).setOption(this.option)
      }
    },
    mounted() {
      this.reports()
    }
  }
</script>

<style lang="less" scoped>
    .box {
        height:400px;
        width:600px
    }
</style>