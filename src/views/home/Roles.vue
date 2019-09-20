<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row class="roleRow">
            <el-button type="primary"  @click="roleAdd('添加角色');dialogFormVisible=true;flag=true">添加角色</el-button>
        </el-row>
        <template>
        <el-table border :data="tableData" style="width: 100%">
        <el-table-column type="expand" class="rowcol">
          <template slot-scope="props">
            <el-row :class="[index===0 ? 'tnb' : 'b','current']" v-for="(item,index) in props.row.children" :key="item.id">
            <!-- 一级 -->
              <el-col :span="6">
                <el-tag @close="close(item.id,props.row)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row :class="[i===0 ? '' : 't','current']" v-for="(val,i) in item.children" :key="val.id">
                  <el-col :span="6">
                     <el-tag type="success" @close="close(val.id,props.row)" closable>{{val.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16" >
                    <el-tag class="tagcurrent" @close="close(vals.id,props.row)" v-for="vals in val.children" :key ="vals.id" type="warning" closable>{{vals.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" prop="index" width="32px">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" >
        </el-table-column>
        <el-table-column label="操作" fixed="right">
            <template slot-scope="scope" >
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="dialogFormVisible=true;title='编辑用户';handleEdit(scope.$index, scope.row);flag=false">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button size="mini" icon="el-icon-setting" type="warning" @click="handleSet(scope.$index, scope.row);dialogVisible=true">分配权限</el-button>
            </template>
        </el-table-column>
        </el-table>
    </template>
    <!-- 模态框 -->
    <el-dialog  :title="title" :visible.sync="dialogFormVisible" lock-scroll>
         <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           <el-form-item :key="index" v-for="(item,index) in arr" :label="formTitle[item]" :prop="item" :label-width="formLabelWidth" >
             <el-input   v-model.trim="ruleForm[item]"  autocomplete="on" ></el-input>
           </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button @click="dialogFormVisible = false">取 消</el-button>
           <el-button type="primary" @click="roleJoi()">确 定</el-button>
         </div>
    </el-dialog>
    <!-- 分配权限 -->
     <el-dialog  title="分配权限" :visible.sync="dialogVisible" lock-scroll>
           <el-tree :default-checked-keys="checkData" :data="data2" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
          </el-tree>
        <div slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="power()">确 定</el-button>
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
                tableData:[],
                status,
                title:'',
                flag:false,
                dialogFormVisible:false,
                dialogVisible:false,
                formLabelWidth:'120px',
                arr:[],
                data2:[],
                checkData:[],
                ruleForm:{},
                checkId :{},
                formTitle:{
                    roleName:'角色名称',
                    roleDesc:'角色描述',
                },
                roleForm:{
                    roleName:'',
                    roleDesc:''
                },
                rules:{
                    roleName:[
                        { required: true, message: '请输入角色名', trigger: 'blur' },
                        { min: 2, max: 3, message: '角色长度在 2 到 3 个字符', trigger: ['blur','change'] }
                    ],
                    roleDesc:[
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 3, max: 5, message: '描述长度在 3 到 5 个字符', trigger: ['blur','change'] }
                    ]
                },
                 defaultProps: {
                    children: 'children',
                    label: 'authName'
        }
            }
        },
        methods: {
            async roles(){
                const {data:res} = await this.$http.get('roles')
                this.status(res,200)
                res.data.forEach((item,index)=>{
                    item.index=index+1
                })
                this.tableData = res.data
            },
            // 添加角色
            roleAdd(title){
                this.title = title
                this.ruleForm=this.roleForm
            },
            // 修改用户
            handleEdit(val,obj){
                this.ruleForm = obj
            },
            // 删除用户
            handleDelete(val,obj){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                const {data:res} = await  this.$http.delete('roles/'+obj.id)
                this.status(res,200)
                this.roles()
                }).catch(() => {
                    this.$message({
                     type: 'info',
                     message: '已取消删除'
                    });
                });

            },
            // 校验表单
            roleJoi(){
                this.$refs.ruleForm.validate(async valid=>{
                    if(!valid) return this.$message.error('重新填写')
                    // 发送请求
                    if(this.flag){
                        const {data:res} = await this.$http.post('roles',this.ruleForm)
                        this.status(res,201)
                    }else {
                        const {data:res} = await this.$http.put('roles/'+this.ruleForm.id,this.ruleForm)
                        this.status(res,200)
                    }
                    this.$refs.ruleForm.resetFields()
                    this.roles()
                    this.dialogFormVisible = false
                })
            },
            // 删除角色列表信息
            close(val,role){
               this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                const {data:res} = await  this.$http.delete(`roles/${role.id}/rights/${val}`)
                this.status(res,200)
                // 改变实参就可以改变外面的形参
                role.children = res.data
                }).catch(() => {
                    this.$message({
                     type: 'info',
                     message: '已取消删除'
                    });
                });
              
            },
            // 分配权限
            async handleSet(value,obj){
              this.checkData=[]
              const {data:res} =await this.$http.get('rights/tree')
               this.checkId = obj
              this.status(res,200)
              this.data2 = res.data
              this.check(obj)
              console.log(res,'-------------------',this.checkData)
            },
            // 循环被选中的权限
            check(obj){
              if(Array.isArray(obj.children)){
                obj.children.forEach(item=>{
                this.checkData.push(item.id)
                this.check(item)
              })
              }
            },
            // 获取权限
            async power(){
               const {data:res} = await this.$http.post(`/roles/${this.checkId.id}/rights`,{rids:this.$refs.tree.getCheckedKeys().join(',')})
                console.log(this.checkId.id,this.$refs.tree.getCheckedKeys())
                this.status(res,200)
                this.roles()
                this.dialogVisible=false
            }
            
         
        },
        created(){
            this.roles()
            this.arr = Object.keys(this.roleForm)
        }
    }
    </script>
<style lang="less" scoped>
    .demo-table-expand {
    font-size: 0;
    }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
    }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .roleRow {
      text-align:left;
      margin-bottom:12px;
  }
  
  .tnb{
    border-top:1px solid #C9C1BC;
    border-bottom:1px solid #C9C1BC;
  }
  .b {
    border-bottom:1px solid #C9C1BC;
  }
  .t {
    border-top:1px solid #C9C1BC;
  }
  .current {
    display:flex;
    align-items:center;
    padding:5px 5px  
  }
  .tagcurrent {
    margin:5px
  }
</style>
