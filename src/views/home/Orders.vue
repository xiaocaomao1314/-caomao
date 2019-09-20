<template>
  <div >
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
    <div class="search">
    <!-- <searchs :search="search"></searchs> -->
    <div class="searchInput">
    <el-input clearable  placeholder="请输入内容" v-model="params.query" @clear="orders();params.pagenum=1" class="input-with-select input">
      <el-button slot="append" icon="el-icon-search" @click="orders();params.pagenum=1"></el-button>
    </el-input>
    </div>
    </div>
    <div class="list">
      <!-- <lists  :list="list"></lists> -->
    <el-table :data="list" border style="width: 100%">
    <el-table-column   fixed="right"  :prop="dataTit[0].prop" :label="dataTit[0].tit" :width="dataTit[0].width">
    </el-table-column>
    <el-table-column   fixed="right"  :prop="dataTit[1].prop" :label="dataTit[1].tit" :width="dataTit[1].width">
    </el-table-column>
    <el-table-column   fixed="right"  :prop="dataTit[2].prop" :label="dataTit[2].tit" :width="dataTit[2].width">
    </el-table-column>
    <el-table-column   fixed="right"  :prop="dataTit[3].prop" :label="dataTit[3].tit" :width="dataTit[3].width">
      <template slot-scope="prop">
        <el-tag type="danger">{{prop.row.pay_status}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column   fixed="right"  :prop="dataTit[4].prop" :label="dataTit[4].tit" :width="dataTit[4].width">
    </el-table-column>
    <el-table-column   fixed="right"  :prop="dataTit[5].prop" :label="dataTit[5].tit" :width="dataTit[5].width">
    </el-table-column>
    <el-table-column label="操作" fixed="right">
      <template slot-scope="scope" >
          <el-button  size="mini" :icon="icon[0].icon" :type="icon[0].type" @click="edit(scope.$index, scope.row)">{{val.tit}}</el-button>
          <el-button  size="mini" :icon="icon[1].icon" :type="icon[1].type" @click="find(scope.$index, scope.row)">{{val.tit}}</el-button>
        </template>
    </el-table-column>
    </el-table>

    <div class="block page" >
      <span class="demonstration"></span>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesize" small :pager-count="5" :current-page.sync="params.pagenum"  :page-size="pagesize[0]" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>
    </div>
     <!-- 编辑 -->
    <el-dialog title="修改地址" :visible.sync="dialogFormVisible" @close="close">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="省市区/县"  :label-width="formLabelWidth">
        <el-cascader change-on-select :options="options" v-model="val" size="small" @change="select()" :props="{ checkStrictly: true,expandTrigger:'hover',value:'value',label:'label',chilrden:'children' }" style="width:100%" clearable>
        </el-cascader>

    </el-form-item>
    <el-form-item label="详细地址" prop="address" :label-width="formLabelWidth">
    <el-input v-model.trim="form.name" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
  </el-dialog>
  </div>
     </el-card>

     <!-- 物流状态 -->
      <el-dialog title="物流进度" :visible.sync="dialogVisible" width="30%" >
        <el-steps direction="vertical"  :align-center="true" >
          <el-step   :title="item.context" v-for="(item,index) in stic" :description="item.time" :key="index"></el-step>
        </el-steps>

      </el-dialog>
  </div>
</template>
<script>
// import Page from '@/views/com/Page'
// import Search from '@/views/com/Search'
// import List from '@/views/com/List'
import {status} from "@/views/index.js"
import areaData from "@/views/area/area.js"
  export default {
      data() {
        var validateAddress = (rule, value, callback) => {
                  var Rex = /^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/
                 if (value === '') {
                   callback(new Error('请输入详细地址'))
                  } else if(!Rex.test(value)){
                    callback(new Error('请输入合法地址'))
                  }
                   callback()
                  }
        return {
          status,
          stic:[],
          dialogFormVisible:false,
          formLabelWidth:'120px',
          dialogVisible:false,
          options:[],
          val:[],
          areaData,
          form:{
             name:'',
             region:''
          },
          rules:{
              address: [
                      { required: true,validator: validateAddress, trigger: ['blur','change']}
              ],
              // region: [
              //   { required: true, message: '请选择活动区域', trigger: ['change','blur'] }
              // ],
           },
          // ruleForm:{},
          // rules:[],
          // formLabelWidth:120,

          page:{},
          list:[],
          // 页码
           params:{
                  query:'',
                  pagenum:1,
                  pagesize:5
                   },
            dataTit:[
                  {tit:'#',width:40,prop:'index'},
                  {tit:'订单编号',width:300,prop:'order_number'},
                  {tit:'订单价格',width:100,prop:'order_price'},
                  {tit:'是否付款',width:80,prop:'pay_status'},
                  {tit:'是否发货',width:80,prop:'is_send'},
                  {tit:'下单时间',width:200,prop:'create_time'}
              ],
            icon:[
                  {type:'primary',icon:'el-icon-edit',tit:''},
                  {type:'success',icon:'el-icon-location',tit:''}
                ],
            pagesize:[4,8,16,32],
        }
      },
      methods: {
       async orders(){
          const {data:res} = await this.$http.get('orders',{params:this.params})
          this.status(res,200)
          res.data.goods.forEach((item,index)=>{
            item.index = index+1
            item.create_time = this.$moment(new Date(item.create_time)).format('YYYY-MM-DD hh:mm:ss')
            item.pay_status=item.pay_status == 0 ? '未付款' : '已付款'
          })
         // this.funArr.push(this.orders,this.status)
          // 页码 函数  总页数 每页数
          // 数据 标题  图标
          this.page=res.data
          this.list=res.data.goods
        },
        // 页码
          handleSizeChange(val){
          this.params.pagesize=val
          this.orders()
          },
          handleCurrentChange(val){
          this.params.pagenum=val
          this.orders()
          },
          edit(){
            this.dialogFormVisible=true
            this.options=this.areaData
        },
        async find(val,obj){
          this.dialogVisible=true
          const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
          this.stic = res.data.reverse()
         // this.status(res,200)
         console.log(res)
        //  this.status(res,200)

        },
        // 关闭模态框
        close(){

        },
        select(){

        }
      },
      created(){
        this.params.pagesize=this.pagesize[0]
        this.orders()
        // this.icon[0].fun=this.edit
        // this.icon[1].fun=this.find
        console.log(this.areaData)
      },
      // components:{
      //     pages:Page,
      //     searchs:Search,
      //     lists:List
      //  }
  }
</script>

<style scoped lang="less">
.searchInput {
    color:red;
    .input {
      float:left;
      width:32%
    }
  }
.list {
    margin: 20px 0
  }
.page{
    color:red;
    width:50%;
  }
.search {
  padding-bottom:40px
}
.el-step__title {
  color:red !important;
  font-weight:400 !important;
}
</style>

