<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
            <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="user-white">
            <div style="margin-top: 15px;" class="user-search" >
                <div class="user-input">
                    <el-input  placeholder="请输入内容" v-model="params.query" class="input-with-select" @clear="useList();this.params.pagenum=1" clearable>
                      <!-- clearable生成清空按钮 点击就是触发clear事件 另外要设置可清空 -->
                      <el-button slot="append" icon="el-icon-search" @click="useList();this.params.pagenum=1"></el-button>
                    </el-input>
                </div>
                <div class="user-button">
                    <el-button  type="primary" @click="dialogFormVisible=true;title='添加用户';ruleForm=ruledata;arr=Object.keys(ruleForm);flag=false;rules.username[0].required=true">添加用户</el-button>
                </div>

            </div>
            <!-- 表单 -->
            <template>
                <el-table  :data="tableData" border style="width: 100%">
                  <el-table-column fixed prop="index" label="#" width="30">
                  </el-table-column>
                  <el-table-column prop="username" label="姓名" width="120">
                  </el-table-column>
                  <el-table-column prop="email" label="邮箱" width="180">
                  </el-table-column>
                  <el-table-column prop="mobile" label="电话" width="120">
                  </el-table-column>
                  <el-table-column prop="role_name" label="角色" width="120">
                  </el-table-column>
                  <el-table-column prop="mg_state"  label="状态" width="120" >
                    <template slot-scope="props">
                      <el-switch v-model="props.row.mg_state" @change="userSwidth(props.row.mg_state,props.row.id)" active-color="#13ce66" inactive-color="#ff4949">
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                      <el-button size="mini" icon="el-icon-edit" type="primary" @click="dialogFormVisible=true;title='修改用户';handleEdit(scope.$index, scope.row)"></el-button>
                      <el-button size="mini" icon="el-icon-setting" type="warning" @click="handleset(scope.$index, scope.row)"></el-button>
                      <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)"></el-button>
                    </template>
                    
                  </el-table-column>
                </el-table>
            </template>
            <!-- 分页 -->
            <div class="block users-page">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="resPon.pagenum" :page-sizes="[pageSize[0], pageSize[1], pageSize[2], pageSize[3]]" :page-size="pageSize[0]" small layout="total, sizes, prev, pager, next, jumper" :pager-count="5" :total="resPon.total">
              </el-pagination>
            </div>
            <!-- 模态框-->
            <el-dialog :title="title" :visible.sync="dialogFormVisible">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :key="index" v-for="(item,index) in arr" :label="formTitle[item]" :prop="item" :label-width="formLabelWidth" >
                  <el-input  :disabled="flag&&item=='username'? true : false" v-model.trim="ruleForm[item]"  autocomplete="on" ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="userJoi()">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 设置 -->
            <el-dialog title="分配角色" :visible.sync="dialogTableVisible" width="50%">
               <el-form ref="roleForm" :model="form" :rules="rules" >
                  <div class="role">
                    <div>
                      <span class="span">当前的用户:</span><span>{{ruleForm.username}}</span>
                    </div>
                    <div>
                      <span class="span">当前的角色:</span><span>{{ruleForm.role_name}}</span>
                    </div>
                  </div>
                  <el-form-item  label="分配新角色:" prop="region" :label-width="formLabelWidth">
                   <el-select style="float:left"  v-model.trim="value.rid"  placeholder="请选择角色">
                     <el-option :key="item.id" v-for="item in form.roleList" :label="item.roleName" :value="item.id"></el-option>
                   </el-select>
                  </el-form-item>
               </el-form>
               <div slot="footer" class="dialog-footer">
                 <el-button @click="dialogTableVisible = false">取 消</el-button>
                 <el-button type="primary" @click="roleSelect()">确 定</el-button>
               </div>
              </el-dialog>

        </div>
        </el-card>
    </div>
</template>
<script>
    export default {
        data () {
                var validateTel = (rule, value, callback) => {
                  var Rex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
                 if (value === '') {
                   callback(new Error('请输入手机号'))
                  } else if(!Rex.test(value)){
                    callback(new Error('请输入合法手机号'))
                  }
                  // else{
                  //  if (this.ruleForm.checkPass !== '') {
                  //    this.$refs.ruleForm.validateField('checkPass');
                   
                   callback()
                  }
                  var validateEmail = (rule, value, callback) => {
                  var Rex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                  if (value === '') {
                   callback(new Error('请输入邮箱'))
                  } else if(!Rex.test(value)){
                    callback(new Error('请输入合法邮箱'))
                  }
                  // else{
                  //  if (this.ruleForm.checkPass !== '') {
                  //    this.$refs.ruleForm.validateField('checkPass');
                   
                   callback()
                  }
            return {
                title:'',
                dialogFormVisible: false,
                dialogTableVisible:false,
                formLabelWidth: '120px',
                flag:false,
                tableData:[],
                arr:[],
                resPon:{},
                ruleForm:{},
                form:{},
                pageSize:[2,3,4,5],
                value:{id:'',rid:''},
                params:{
                    query:'',
                    pagenum:1,
                    pagesize:0
                },
                // 添加用户
                ruledata: {
                    username:'',
                    password:'',
                    email: '',
                    mobile: ''
                      },
                // 添加用户
                formTitle:{
                  'username':'用户名',
                  'password':'密码',
                  'email':'邮箱',
                  'mobile':'手机'
                },
                rules: {
                  username: [
                          { required: true, message: '请输入用户名', trigger: 'blur' },
                          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['blur','change'] }
                        ],
                  password: [
                          { required: true, message: '请输入密码', trigger: 'blur' },
                          {  min: 6, max: 9, message: '长度在 6 到 9 个字符', trigger: ['blur','change'] },

                        ],
                  email: [
                          // { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                          { required: true,validator: validateEmail, trigger: ['blur','change'] }
                          ],
                  mobile: [
                          // { required: true, message: '请输入手机号', trigger: 'blur' },
                          // { min: 6, max: 9, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
                          { required: true,validator: validateTel, trigger: ['blur','change']}
                          ],
                  region: [
                          { required: false, message: '请选择角色', trigger: 'change' }
                          ]
                        }
                  }
                },
        methods: {
         async useList() {
           const {data:res} = await this.$http.get('users',{
             params:this.params
           })
           this.resPon = res.data
           this.status(res)
           res.data.users.forEach((item,index)=>{
             item.index=index+1
           })
            this.tableData=[...res.data.users]
          },
          // 分页
          handleSizeChange(val){
              // console.log(`每页 ${val} 条`);
              this.params.pagesize = val
              this.useList()
          },
          handleCurrentChange(val){
              // console.log(`当前页: ${val}`)
              this.params.pagenum = val
              this.useList()
          },
          // 添加用户
        userJoi(){
          this.$refs.ruleForm.validate(async valid=>{
          if (!valid) return
          if (!this.flag){
            // 添加用户
              var {data:res} = await this.$http.post('users',this.ruleForm)
              if(res.meta.status!==201) return this.$message.error(res.meta.msg)
              this.$message.success(res.meta.msg)
          }else{
              // 编辑用户
              // console.log(this.ruleForm)
              var {data:res} = await this.$http.put(`users/${this.ruleForm.id}`,this.ruleForm)
              this.status(res)
          }
            this.dialogFormVisible = false
            this.$refs.ruleForm.resetFields()
            this.useList()
          })
        },
        // 改变状态
        async userSwidth(state,id){
        const {data:res} = await this.$http.put(`users/${id}/state/${state}`)
         this.status(res)
        },
        // 修改
       async handleEdit(val,obj){
          // 获取用户信息
          this.flag = true
          var {data:res} = await this.$http.get('users/'+obj.id)
          this.status(res)
          this.arr = this.arr.filter(item=>{
            if(item!='password') return item
          })
          this.ruleForm = res.data
          this.rules.username[0].required=false
        },
        // 删除
       handleDelete(val,obj){
          // 删除提示
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          if(this.resPon.pagenum==Math.ceil(this.resPon.total/this.params.pagesize)&&this.params.pagenum>=2&&this.resPon.users.length==1){
            this.params.pagenum = this.params.pagenum-1
          }
          const {data:res} = await this.$http.delete('users/'+obj.id)
          this.useList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

        },
        // 设置用户角色
       async handleset(val,obj){
         this.ruleForm = obj
         this.value.id=obj.id
        const {data:res} = await this.$http.get('roles')
        this.status(res)
        this.form.roleList = res.data 
        this.dialogTableVisible = true
        },
       async roleSelect(){
            if(this.value.rid=='') return this.$message.error('请选择角色')
            const {data:res} = await this.$http.put(`users/${this.value.id}/role`,{rid:this.value.rid})
            if(res.meta.status!=200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.value.rid=''
            // console.log(this.$refs.roleForm)
            this.useList()
            this.dialogTableVisible = false
        },
        // 封装
        status(res){
          if(res.meta.status!=200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
        }
        },
        created () {
          this.params.pagesize=this.pageSize[0]
          this.useList()
          this.arr = Object.keys(this.ruledata)
        },
        mounted (){

        }
    }
</script>
<style scoped lang="less">
    .user-white {
        // background-color:#fff;
        // padding:15px;
        // margin-top:15px;
        .user-search {
            display:flex;
            justify-content:flex-start;
            .user-input {
                width:30%;
            }
            .user-button {
                width:30%;
                margin:0 0 15px -90px;
            }
        }
        .users-page {
          padding-top:15px;
          width:20%;
        }
        .role{
          text-align:left;

          div {
            display:flex;
            margin-bottom:12px;
            .span {
              text-align:right;
              width:108px;
              padding-right:18px;
            }
          }
          
        }
    }
</style>
