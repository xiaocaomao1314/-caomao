<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:15px">
      <el-breadcrumb-item  :to="{path: '/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 内容第一 -->
    <el-alert title="添加商品信息"  show-icon type="info" :closable="false" center></el-alert>
    <el-row class="el_row">
      <el-col :span="24">
        <el-steps :active="active" align-center :finish-status="finish[0]" :process-status="finish[3]">
        <!-- 可以循环做 -->
          <el-step v-for="(item,index) in el_step" :key="index" :title="item" description=""></el-step>
          <!-- <el-step title="商品参数" description=""></el-step>
          <el-step title="商品属性" description=""></el-step>
          <el-step title="商品图片" description=""></el-step>
          <el-step title="商品内容" description=""></el-step>
          <el-step title="完成" description=""></el-step> -->
        </el-steps>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left	">
          <el-tab-pane :label="item[0]" :disabled="item[3]" :name="item[1]" :key="index" v-for="(item,index) in el_tabs"></el-tab-pane>
          <!-- <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
        </el-tabs>
      </el-col>
      <el-col :span="18">
        <div>
          <el-form :model="ruleForm" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item v-if="flag===1" :label="item[0]" :prop="item[1]" v-for="(item,index) in el_form" :key="index">
              <el-input :type="item[2]"  v-model.trim="ruleForm[item[1]]"></el-input>
            </el-form-item>
            <el-form-item v-if="flag===1" label="商品分类" prop="region">
              <el-cascader   :debounce="400"  filterable placeholder="可以搜索哟" style="width:100%" size="small" change-on-select clearable @clear="clear()" v-model="val" :options="options" :props="{checkStrictly: true, expandTrigger: 'hover', value:'cat_id',label:'cat_name',chilrden:'children'}" @change="select()"></el-cascader>
            </el-form-item>
            <!-- 商品参数 -->
            <el-form-item label="商品参数:" v-if="flag===2" prop="attr_value">
              <!-- <el-input v-model.trim="ruleForm.attr_value"  placeholder="选填"></el-input> -->
              <template slot-scope="scoped">
                <div  v-for="(item,index) in params" :key="index">
                <span style="color:black;font-size:18px;"> {{item.attr_name}}</span>
                <br>
                --------------------------------------------------------------------------------------------------
                  <el-checkbox-group v-model="item[index]" size="mini" fill="blue" text-color="white" ref="group" @change="checked()">
                    <el-checkbox  :label="val"  border v-for="(val,i) in item.attr_vals" :key="i"  ></el-checkbox>
                  </el-checkbox-group>
                </div>
            </template>


            </el-form-item>


            <el-form-item  label="商品属性:" v-if="flag===3" prop="ruval">
              <!-- <el-input v-model.trim="ruleForm.attr_val"  placeholder="选填"></el-input> -->
                  <template slot-scope="proped">
                    <el-form  :model="attrs_Arr" status-icon   label-width="100px" class="demo-ruleForm">
                      <el-form-item v-for="(item,index) in attributes"  prop="attr_vals">
                          <p>{{item.attr_name}}</p>
                          <el-input  v-model.trim="item.attr_vals"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
            </el-form-item>
            <el-upload ref="upload" :headers="headers" :on-error="error" :on-success="success" v-if="flag===4" class="upload-demo el_upload" action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
              <el-button size="small" type="info">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>

            <el-form-item v-if="flag===5" prop="goods_introduce" label="请输入内容:">
               <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
              <!-- <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"  clearable @clear="resetForm()" v-model.trim="ruleForm.goods_introduce">
              </el-input> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm($event)">提交</el-button>
              <el-button @click="resetForm($event)" >重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import {status} from "@/views/index.js"
  export default {
    data () {
      var Validateprice= (rule, value, callback)=>{
        if (value <=0) {
          callback(new Error('价格这么低 做慈善嘛？'));
        } else if(value===''){
          callback(new Error('请输入价格'));
        }
          else{
          // if (this.ruleForm.price !== '') {
          //   this.$refs.ruleForm.validateField('price');
          // }
          callback();
        }
      }
      var Validateweight = (rule, value, callback)=>{
        if (value <=0) {
          callback(new Error('重量为0 失重？'));
        } else {
          // if (this.ruleForm.weight !== '') {
          //   this.$refs.ruleForm.validateField('weight');
          // }
          callback();
        }
      }
      var Validatenum =  (rule, value, callback)=>{
        if (value <=0) {
          callback(new Error('数量为0 空手套白狼？'));
        } else {
          // if (this.ruleForm.num !== '') {
          //   this.$refs.ruleForm.validateField('num');
          // }
          callback();
        }
      }
      return {
        status,
        active:0,
        activeName: '0',
        val:[],
        options:[],
        params:[],
        flag:1,
        previewPath: '',
        previewVisible:false,
        attrs_Arr:{
          attr_vals:''
        },
        headers:{
          Authorization : window.sessionStorage.getItem('token')
        },
        attributes:[],
        finish:['success','wait','error','process'],
        el_step:['基本参数','商品参数','商品属性','商品图片','商品内容','完成'],
        fileList: [],
        strArr:[],
        attrs_value:[],
        attrs_v:[],
        // [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        el_tabs : [['基本信息','first',1,false],['商品参数','second',2,true],['商品属性','three',3,true],['商品图片','fourth',4,true],['商品内容','five',5,true]],
        el_form:[['商品名称','name','text'],['商品价格','price','number'],['商品重量','weight','number'],['商品数量','num','number']],
        ruleForm:{
          name:'',
          price:0,
          weight:0,
          num:0,
          attr_value:'',
          attr_val:'',
          goods_introduce:'',
          pics:[]
        },
        rules:{
           name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'change' }
                ],
            price:[
            {required: true,validator: Validateprice, trigger: ['blur','change']}
            ],
            weight:[
            {required: true,validator: Validateweight, trigger: ['blur','change']}
            ],
            num:[
            {required: true,validator: Validatenum, trigger: ['blur','change']}
            ],
            attr_value:[
            { required: false, message: '请输入商品名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'change' }
            ],
            goods_introduce:[
            { required: false, message: '请输入商品名称', trigger: 'blur' },
            { min: 8, max: 30, message: '长度在 8 到 30 个字符', trigger: 'change' }
            ],

        },
        rule : {
           attr_vals : [
            { required: false, message:'',trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: ['change','blur'] }
              ],
        }

      }

    },
    methods: {
      handleClick(){
        this.el_tabs.forEach((value, index, array) => {
         if(value[1]==this.activeName) return this.flag=value[2]
        })

      },
      select(){
        if(this.val.length!==3){
          this.val=[]
          return
        }
      },
      clear(){
        this.val=[]
        return
      },
      async get_classify(){
      const {data:res} = await this.$http.get('categories',{params:{type:3}})
      this.options=res.data
      this.status(res,200)

    },
    // 重置
    resetForm(e){
      switch(this.flag) {
        case 1 :
          this.val=[]
          this.ruleForm.name=''
          this.ruleForm.price=0
          this.ruleForm.weight=0
          this.ruleForm.num=0
          break
        case 2 :
          this.params.forEach((value, index, array) => {
          value[index]=[]
        })
        this.attrs_value=[]
          break
        case 3 :
        this.attributes.forEach((value, index, array) => {
          value.attr_vals=''
        })
          break
        case 4 :
        this.$refs.upload.clearFiles()
        this.ruleForm.pics=[]
          break
        case 5 :
        this.ruleForm.goods_introduce=''
        // 清除上传列表
         break

      }

    },
    // 基本信息提交
      submitForm(evnet){
        this.$refs.form.validate(async valid=>{
          if(!valid) return this.$message.error('请填写 有的地方重新填写')
          if(this.flag>=this.el_tabs[this.el_tabs.length-1][2]){
          const {data:res} = await this.$http.post('goods',{'goods_name':this.ruleForm.name,
                                                            'goods_price':this.ruleForm.price,
                                                            'goods_number':this.ruleForm.num,
                                                            'goods_weight':this.ruleForm.weight,
                                                            'goods_cat':this.val.join(','),
                                                            'attrs':[...this.attrs_value,...this.attrs_v],
                                                            'goods_introduce':this.ruleForm.goods_introduce,
                                                            "pics":this.ruleForm.pics
                                                            })
          this.status(res,201)
          this.get_classify()
          this.$refs.form.resetFields()
          this.val=[]
          this.$router.push({path:'/goods'})
          }else {

          switch(this.flag){
            case 1 :
            this.argument(this.val[this.val.length-1],'many')
            break
            case 2 :
            this.argument(this.val[this.val.length-1],'only')
            break
            case 3 :
            this.attrs_v=[]
            this.attributes.forEach((value, index, array) => {
            this.attrs_v.push({attr_id:value.attr_id,attr_value:value.attr_vals})
            })
            break
          }
          this.active=this.flag
          this.el_tabs[this.active][3]=false
          this.activeName=this.el_tabs[this.active][1]
          this.handleClick()
          }
          })


      },
      async argument(id,val){
        const {data:res} = await this.$http.get(`categories/${id}/attributes`,{params:{'sel':val}})
        // c
        this.status(res,200)

        if(val=='many'){
          res.data.forEach((value, index, array) => {
          value[index]=[]
          value.attr_vals=value.attr_vals ? value.attr_vals.split(',') : []
        })
        this.params = res.data
        }else {
          this.attributes=res.data
        }
      },
      // 上传图片
      handleRemove(file, fileList) {
        const filePath = file.response.data.tmp_path
        const index = this.ruleForm.pics.findIndex(item => item.pic === filePath)
        this.ruleForm.pics.splice(index, 1)
      },
      handlePreview(file) {
        console.log(file)
        this.previewPath = file.response.data.url
        this.previewVisible = true
      },
      success(response, file, fileList){
        console.log(response)
        this.ruleForm.pics.push({'pic':response.data.tmp_path})
      },
      error(response, file, fileList){
        this.$message.error('上传失败')
      },

      checked(){
        this.attrs_value=[]
        this.params.forEach((value, index, array) => {
        this.attrs_value.push({attr_id:value.attr_id,attr_value:value[index].join(',')})
        })
      },

    },
    created(){
        this.activeName = this.el_tabs[0][1]
        this.get_classify()
    }
  }
</script>
<style lang="less" scoped>
  .el_row {
    margin:15px 0
  }
  .el_upload {
    margin:15px 0
  }
  .previewImg {
    width:100%
  }
  .ql-editor{
    min-height: 300px;
}
</style>
