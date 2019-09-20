<template>
  <div>
    <el-input clearable  placeholder="请输入内容" v-model="search[0].query" @clear="search[1]();search[0].pagenum=1" class="input-with-select input">
      <el-button slot="append" icon="el-icon-search" @click="search[1]();search[0].pagenum=1"></el-button>
    </el-input>
  </div>
</template>
<style lang="less" scoped>
  div {
    color:red;
    .input {
      float:left;
      width:32%
    }
  }
</style>
<script>
export default {
  props:['search'],
  data() {
    return {

    }
  },
}
</script>
