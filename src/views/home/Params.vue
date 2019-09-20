<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
     <el-card>
       <!-- 警示 -->
       <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" close-text :center="false" show-icon></el-alert>
       <el-row type="flex" align="middle" class="el_row">
         <!-- 搜索框 联级 -->
         <el-col :span="2.5">
          <span style="font-weight:normal">选择商品分类:</span>
        </el-col>
        <el-col :span="6">
        <!-- 三级联动 经过该行高亮 -->
          <el-cascader filterable placeholder="可以搜索哟" size="small" @change="select()" v-model="val" :props="{ checkStrictly: true,expandTrigger:'hover',value:'cat_id',label:'cat_name',chilrden:'children' }" :options="options" change-on-select clearable @clear="refresh()"></el-cascader>
        </el-col>
       </el-row>
       <!-- 配置参数 -->
       <el-tabs v-model.trim="param" size="small"  @tab-click="handleClick">
          <el-tab-pane style="" label="动态参数" name="first"></el-tab-pane>
          <el-tab-pane label="静态属性" name="second"></el-tab-pane>
       </el-tabs>
       <el-row class="el_row_btn">
         <el-col :span="2">
          <el-button size="mini" type="primary" :disabled="val.length!==3" @click="dialogFormVisible=true;flag=false" round>{{'添加'+current[0].substr(2)}}</el-button>
         </el-col>
       </el-row>
      <el-table :data="paramData" border style="width: 100%" height="250">
        <el-table-column type="expand" fixed="right" label="" width="60" >
           <template slot-scope="props">
            <!-- <el-table :data="[props.row]" style="width: 100%" border>
              <el-table-column :prop="item.prop"  :label="item.label"  v-for="(item,index) in tableData" :key="index">
              </el-table-column>
            </el-table> -->
            <el-tag :key="index" v-for="(tag,index) in props.row.attr_vals" closable :disable-transitions="false" @close="handleClose(tag,props.row)"> {{tag}}</el-tag>
            <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model.trim="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(props.row)" @blur="handleInputConfirm(props.row)"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+New Tag</el-button>
           </template>
        </el-table-column>
        <el-table-column  fixed="right" type="index" width="50">
        </el-table-column>
        <el-table-column prop="attr_name" fixed="right" :label="current[0].substr(2)+'名称'" width="260">
        </el-table-column>
        <el-table-column prop="city" fixed="right" label="操作" width="">
          <template slot-scope="scope" >
            <el-button size="mini" type="primary" icon="el-icon-edit"  @click="edit(scope.row);dialogFormVisible=true">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"  @click="deletes(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 添加 -->
      <el-dialog :title="flag ? '编辑'+current[0].substr(2) : '添加'+current[0].substr(2)" :visible.sync="dialogFormVisible" @close="close">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item :label="current[0]" prop="attr_name" :label-width="formLabelWidth">
            <el-input v-model="form.attr_name" autocomplete="off" :placeholder="'请输入'+current[0].substr(2)"></el-input>
          </el-form-item>
              </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="params()">确 定</el-button>
        </div>
      </el-dialog>
     </el-card>

  </div>
</template>
<script>
import {status} from "@/views/index.js"
export default {
  data() {
    return {
      status,
      val:[],
      options:[],
      param:'first',
      paramData:[],
      dialogFormVisible:false,
      flag:false,
      attr_id:0,
      formLabelWidth:'120px',
      // inputVisible: false,
      inputValue: '',
      attr_val:[],
      vals:'信使费热鹅鹅鹅鹅鹅鹅饿鹅鹅鹅鹅鹅鹅饿',
      // tableData:[
      //   {label:'作者',prop:'attr_write'},
      //   {label:'内容',prop:'attr_vals'},
      //   ],
      current:[],
      tabs:[['动态参数','many'],['静态属性','only']],
      form:{
        attr_name:''
      },
      rules:{
        attr_name:[
                  {required:true,message:'请不要为空',trigger:'blur'},
                  { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'change' }
                  ],
      }
    }
  },
  methods: {
    async getCateData(){
      const {data:res} = await this.$http.get('categories')
      this.status(res,200)
      this.options = res.data
    },
    // 选中触发的事件
    select(){
      this.refresh()
    },
    async refresh(){
      if(this.val.length==3){
        const {data:res} = await this.$http.get(`categories/${this.val[this.val.length-1]}/attributes`,{params:{sel:this.current[1]}})
        this.status(res,200)
        // 把attr_vals不变成数组
        res.data.forEach((value, index, array) => {
          value.attr_vals = value.attr_vals ? value.attr_vals.split(',') : []
        })
        res.data.forEach((value, index, array) => {
            value.inputVisible = false
        })
        this.paramData=res.data
      }else {
        this.paramData=[]
        return null
      }
    },
    // tap选中触发的事件
    handleClick(val){
     const arr = this.tabs.filter(item=>{
        if(item[0]==val.label){
          return item
        }
      })
      this.current=arr[0]
      this.refresh()
    },
    // 编辑
    edit(val){
      this.rules.attr_name[0].required=false
      this.flag=true
      this.form.attr_name=val.attr_name
      this.attr_id=val.attr_id
    },
    // 删除
    deletes(val){
      console.log(val)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`categories/${this.val[this.val.length-1]}/attributes/${val.attr_id}`)
          this.status(res,200)
          this.refresh()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 确定
    params(){
      this.$refs.form.validate(async valid=>{
        if(!valid) return this.$http.message.error('请认真填写')
        if(!this.flag){
        const {data:res} = await this.$http.post(`categories/${this.val[this.val.length-1]}/attributes`,{attr_name:this.form.attr_name,attr_sel:this.current[1],attr_vals:this.vals})
        this.status(res,201)
        }else{
        const {data:res} = await this.$http.put(`categories/${this.val[this.val.length-1]}/attributes/${this.attr_id}`,{attr_name:this.form.attr_name,attr_sel:this.current[1]})
        this.status(res,200)
        }

        this.refresh()
        this.dialogFormVisible=false
      })
    },
    close(){
      this.$refs.form.resetFields()
      this.attr_id=0
    },



     handleClose(tag,obj) {
    // 获得展示的数组
     const index = obj.attr_vals.findIndex(item=>{
         if(item==tag){
           return item
         }
       })
      obj.attr_vals.splice(index,1)
      this.attrVals(obj)
      },

      showInput(val) {
        console.log(val)
        val.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm(obj) {
        let inputValue = this.inputValue;
        if (inputValue) {
          obj.attr_vals.push(inputValue);
          this.attrVals(obj)
        }
        obj.inputVisible = false;
        this.inputValue = '';
      },
      async attrVals(obj) {
        const {data:res} = await this.$http.put(`categories/${this.val[this.val.length-1]}/attributes/${obj.attr_id}`,
                                                {'attr_name':obj.attr_name,'attr_sel':obj.attr_sel,'attr_vals':obj.attr_vals.join(',')})
        this.status(res,200)
      }
  },
  created() {
    this.getCateData()
    this.current=this.tabs[0]
  },
}
</script>
<style lang="less" scoped>
  .el-row {
    margin-top:20px
  }
  .el_row_btn {
    margin:-3px 0 15px
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
