<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    <el-card>
    <el-table border ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="date" prop="authName" label="权限名称">
      </el-table-column>
      <el-table-column property="name" prop="path" label="路径" >
      </el-table-column>
      <el-table-column property="address" prop="level" label="权限等级" fixed="right">
        <template slot-scope="scope">
        <!-- scope.row能拿到 tableData数组 是因为:data的功劳相当于scope.row=tableData-->
        <!-- row属性去接收了父亲传的数据 -->
          <el-tag type="success"   v-if="scope.row.level==0"> 一级权限</el-tag>
          <el-tag type="warning"  v-if="scope.row.level==1">二级权限</el-tag>
          <el-tag ype="danger"  v-if="scope.row.level==2">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>
<script>
import {status} from "@/views/index.js"
export default {
  data () {
    return {
      tableData:[],
      handleCurrentChange:'',
      status,
    }
  },
  methods: {
    async rights(){
      const {data:res} = await this.$http.get('rights/list')
      this.status(res,200)
      this.tableData=res.data
    }
  },
  created () {
    this.rights()
  }
}
</script>
<style scoped lang="less">
</style>
