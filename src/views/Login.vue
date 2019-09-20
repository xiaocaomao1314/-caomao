<template>
  <div id="box">
    <div class="Login_area">
      <div class="login_img">
         <div class="login_inimg">
           <img src="../assets/logo.png" alt="">
         </div>
      </div>
      <div class="login_form">
        <el-form :model="login_Form" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
          <el-form-item  prop="uname">
              <el-input placeholder="请输入用户名" v-model="login_Form.username" >
                    <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
              </el-input>
          </el-form-item>
          <el-form-item  prop="password">
              <el-input placeholder="请输入密码" v-model="login_Form.password"  type="password" >
                  <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
              </el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="submitForm()">登录</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      login_Form: {
        username: '',
        password: ''
      },
      rules: {
        userame: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '用户名长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 9,
            message: '密码长度在 6 到 9 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetForm(ruleForm) {
      this.$refs.ruleForm.resetFields()
    },
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        // 验证表单 是否正确 true是通过 false是未通过
        var { data: res } = await this.$http.post('login', this.login_Form)
        if (res.meta.status !== 200)
          return this.$message.error('登录失败:' + res.meta.msg)
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
#box {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .Login_area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 5px;
    .login_img {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -40%);
      width: 152px;
      height: 152px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 0 10px #ccc;
      .login_inimg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 130px;
        height: 130px;
        background-color: #eeeeee;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .login_form {
      position: absolute;
      top: 120px;
      left: 20px;
      width: 410px;
      height: 450px;
    }
  }
}
</style>
