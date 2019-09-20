
<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
    <!-- 搜索栏 -->
    <div class="search clearfix">
      <!-- <searchS :search="search"></searchS> -->
      <div class="searchInput">
        <el-input clearable  placeholder="请输入内容" v-model="params.query" @clear="listGood();params.pagenum=1" class="input-with-select input">
          <el-button slot="append" icon="el-icon-search" @click="listGood();params.pagenum=1"></el-button>
        </el-input>
    </div>
      <el-button class="btn" type="primary" @click="addGood()">添加商品</el-button>
    </div>
    <div class="list">
      <el-table :data="list" border style="width: 100%">
        <el-table-column   fixed="right" :key="i" v-for="(item,i) in dataTit" :prop="item.prop" :label="item.tit" :width="item.width">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope" >
          <el-button v-for="(val,n) in icon" :key="n" size="mini" :icon="val.icon" :type="val.type" @click="val.fun(scope.$index, scope.row)">{{val.tit}}</el-button>
          </template>
        </el-table-column>
  </el-table>
    </div>
    <div class="block page">
        <span class="demonstration"></span>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" small :pager-count="5" :current-page.sync="params.pagenum"  :page-size="pagesizes[0]" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
    </el-pagination>
  </div>
  </el-card>
  </div>
</template>
<script>
// import Page from '@/views/com/Page'
// import Search from '@/views/com/Search'
// import List from '@/views/com/List'
import {status} from "@/views/index.js"
  export default {
    data(){
      return {
        status,
          // 传的对象
          page:{},
          list:[],
        
          dataTit:[{tit:'#',width:40,prop:'index'},
                  {tit:'商品名称',width:400,prop:'goods_name'},
                  {tit:'商品价格(元)',width:100,prop:'goods_price'},
                  {tit:'商品重量',width:100,prop:'goods_weight'},
                  {tit:'创建时间',width:180,prop:'add_time'}],
          res:{},
          icon:[{type:'primary',icon:'el-icon-edit',tit:'',fun(){}},
                {type:'danger',icon:'el-icon-delete',tit:'',fun(){}}],
          params:{
              query:'',
              pagenum:1,
              pagesize:0
            },
          pagesizes:[8,16,32,64],  
      }
    },
    methods: {
      // 获取商品列表
      async listGood(){
        const {data:res} = await this.$http.get('goods',{params:this.params})
        this.status(res,200)
        res.data.goods.forEach((item,index)=>{
          item.index = index+1
          item.add_time = this.$moment(new Date(item.add_time)).format('YYYY-MM-DD hh:mm:ss')
        })
        console.log(res)
         this.page=res.data
          // 数据 标题  图标
          this.list=res.data.goods    
      },
      // 页码
      handleSizeChange(val){
      this.params.pagesize=val
     this.listGood()
      },
      handleCurrentChange(val){
      this.params.pagenum=val
      this.listGood()
      },
      addGood(){
        this.$router.push({path:'/goods/add'})
      }

    },
   created () {
      this.params.pagesize=this.pagesizes[0]
      this.listGood()
    },
    // components:{
    //   pageS:Page,
    //   searchS:Search,
    //   listS:List
    //    }
  }
</script>
<style lang="less" scoped>
.page{
    color:red;
    width:50%;
  }
  .search {
    .searchInput {
      color:red;
      .input {
      float:left;
      width:32%
    }
    }
    
    .btn {
      margin-left:-56%;
    }
  }
  .list {
    margin: 20px 0
  }
  .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
    }
    .clearfix{
        *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
    }
</style>
