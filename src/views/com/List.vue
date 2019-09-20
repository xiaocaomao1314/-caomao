<template>
  <div>
    <el-table :data="list[0]" border style="width: 100%">
    <el-table-column   fixed="right" :key="i" v-for="(item,i) in list[1]" :prop="item.prop" :label="item.tit" :width="item.width">
    </el-table-column>
    <el-table-column label="??" fixed="right">
      <template slot-scope="scope" >
          <el-button v-for="(val,n) in list[2]" :key="n" size="mini" :icon="val.icon" :type="val.type" @click="val.fun(scope.$index, scope.row)">{{val.tit}}</el-button>
        </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
export default {
  props:['list'],
  data() {
    return {
    }
  },
  methods:{
  },
  created() {
    console.log(this.list,6666)
  },
}
</script>
<style lang="less" scoped>

</style>
