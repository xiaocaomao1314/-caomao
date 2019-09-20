<template>
  <div class="block">
    <span class="demonstration"></span>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[...page[3]]" small :pager-count="5" :current-page.sync="page[0].pagenum"  :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="page[2].total">
    </el-pagination>
  </div>
</template>
<style lang="less" scoped>
  div {
    color:red;
    width:50%;
  }
</style>
<script>
export default {
  props:['page'],
  data() {
    return {
    }
  },
  methods: {

    handleSizeChange(val){
      this.page[0].pagesize=val
     this.page[1]()
    },
    handleCurrentChange(val){
      this.page[0].pagenum=val
      this.page[1]()
    }
  },
  created () {
  }
}
</script>
