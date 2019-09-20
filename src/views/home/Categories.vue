<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
     <el-card>
            <!-- 添加分类按钮区域 -->
            <el-row  type="flex" justify="space-around">
                <el-col>
                    <!-- 添加分类 -->
                    <el-button type="primary" style="float:left;margin-bottom:15px" @click="dialogFormVisible=true;classify()">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类表格  -->
            <tree-table :data="listData" show-header :expand-type="false" show-index border stripe show-row-hover :columns="columns" :selection-type="false" index-text="#">
            <!-- 模板区域 -->              
              <template slot="valid" slot-scope="scope">
                <i  class="el-icon-check" v-if="scope.row.cat_deleted==false" style="background-color:lightgreen;color:white;border-radius:50%"></i>
                <i  class="el-icon-close" v-else style="background-color:red;color:white;border-radius:50%"></i>
              </template>
              <template slot="sort" slot-scope="scope">
               <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
               <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
               <el-tag type="warning" v-else>三级</el-tag>
              </template>
              <template slot="handle" slot-scope="scope">
                   <el-button type="primary" icon="el-icon-edit" size="mini" @click="" plain>编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini" @click="" plain>删除</el-button>
              </template>
            </tree-table>
             <el-pagination style="width:30%;margin-top:15px" :background="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagesizes" small :pager-count="5" :current-page.sync="params.pagenum"  :page-size="params.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>

            <!-- 添加分类模态 -->
            <el-dialog title="添加分类" :visible.sync="dialogFormVisible" @close="close">
              <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
                  <el-input v-model.trim="form.cat_name"  width="200px"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" :label-width="formLabelWidth" >
                  <!-- <el-select v-model="form.region" placeholder="请选择" style="width:100%">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select> -->

                  <!-- change-on-select是选中事件绑定触发change事件 -->
                   <el-cascader change-on-select :options="options" v-model="val" size="small" @change="select()" :props="{ checkStrictly: true,expandTrigger:'hover',value:'cat_id',label:'cat_name',chilrden:'children' }" style="width:100%" clearable>
                   </el-cascader>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 分页 -->
        </el-card>

    <!-- 数据列表 -->
      
  </div>
</template>

<script>
import {status} from "@/views/index.js" 
export default {
  data () {
    return {
      tableData:[],
      status,
      listData:[],
      pageData:{},
      pagesizes:[3,6,9],
      dialogFormVisible:false,
      formLabelWidth: '120px',
      val:[],
      form:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      params: {
        type:3,
        pagenum:1,
        pagesize:1
      },
      // 规则
      rules: {
          cat_name:[
            {required:true,message:'请输入分类名称',trigger:'blur'},
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'change' }
            ],
    // cat_pid:[
    //         { required: false, message: '请选择', trigger: 'change' }          
    //         ]
       } ,
      //  选择数据
    options:[],
     columns:[
       {label:'分类名称',prop:'cat_name'},
       {label:'是否有效',prop:'',type:'template',template:'valid'},
       {label:'排序',prop:'',type:'template',template:'sort'},
       {label:'操作',pro:'',type:'template',template:'handle'}
     ]
    }
  },
  methods: {
   async cateData(){
      const {data:res} = await this.$http.get('categories',{params:this.params})
      this.status(res,200)
      this.pageData=res.data
      this.listData=res.data.result
    },
    handleSizeChange(val){
      this.params.pagesize=val
      this.cateData()
    },
    handleCurrentChange(val){
      this.params.pagenum=val
      this.cateData()
    },
    // 添加分类
    classify(){
      this.get_classify()
    },
    // 获取分类
    async get_classify(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      this.status(res,200)
      this.options=res.data

    },
    // 选中事件
    select(){
      if(this.val.length>0){
        // 父级
        this.form.cat_pid=this.val[this.val.length-1]
        // 下一级 0是第一级
        this.form.cat_level=this.val.length
      }else {
        // 没有选择的时候
        this.form.cat_pid=0
        this.form.cat_level=0
        // 直接停止
        return
      }
    },
    // 关闭模态框
    // 模态框有三种关法 第一是选中后 第二是取消 第三鼠标外围
    close(){
      // 这是清除表单的
      this.$refs.form.resetFields()
      this.val=[]
      this.form.cat_pid=0
      this.form.cat_level=0
      // 清除选择框的

    },
    // 确定后
    // 选择为空就是给第一级新添加
    confirm(){
      this.$refs.form.validate(async valid=>{
        if(!valid) return this.$message.error('请好好选择')
        const {data:res} = await this.$http.post('categories',this.form)
        this.status(res,201)
        this.cateData()
        this.dialogFormVisible=false
      })
    }
  },
  created () {
    this.params.pagesize = this.pagesizes[0]
    this.cateData()
  }
}
</script>

<style lang="less" scoped>
    .btn {
      float:left;
      margin-bottom:20px;
    }
</style>