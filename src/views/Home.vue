<template>
    <el-container class="el-container">
      <el-header class="el-header">
        <div class="header-title">
          <img src="../assets/heima.png">
          <h3>电商后台管理系统</h3>
        </div>
      </el-header>
        <el-container>
        <el-aside class="el-aside" :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
           <el-menu :collapse="isCollapse" :collapse-transition="false" router class="el-menu-vertical-demo" unique-opened   background-color="#333744" text-color="#fff" active-text-color="#409EFF" :default-active="activePath" >
            <el-submenu :key="item.id" v-for="(item,index) in aside_data" :index="item.id+''">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
             <el-menu-item :index="val.id+''" :key="val.id" v-for="val in item.children" @click="skip('/'+val.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{val.authName}}</span>
                </template>
            </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
           
         
          <!-- 主内容 -->
              <router-view/>
         
         
        </el-main>
      </el-container>
      <el-button type="info" @click="logout"> 退出 </el-button>

    </el-container>


</template>

<script>
// @ is an alias to /src
export default {
  data() {
    return {
      aside_data:null,
      iconsObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
    },
    isCollapse: false,
    activePath:""
    }
  },
  methods: {
    logout() {
      this.$router.push('/login')
      window.sessionStorage.removeItem('token')
    },
    async homeData(){
      const {data:res} = await this.$http.get("menus")
      if(res.meta.status!==200) return this.$message.error("请求失败"+res.meta.msg)
      this.$message.success(res.meta.msg)
      this.aside_data = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    skip(path){
      this.$router.push(path)
    },
    welcome(){
      this.$router.push({path:'/welcome'})
    }
  },
  created () {
      this.homeData()
  }
}
</script>

<style scoped lang="less">

  .el-container{
    color:#fff;
    height:100%;
    .el-header {
    padding:0%;
    background-color:#373D41;
      .header-title {
        width:100%;
        display:flex;
        align-items:center;
        img{
          margin-right:20px
        }
        h3 {
          font-weight:normal
        }
      }
    }
    .el-aside {
    background-color:#333744;
    }
    .white {
      background-color:#fff;
    }
    .main {
      background-color:#EAEDF1;
      // .boxmain {
      //   background-color:#fff;
      //   margin-top:15px;
      // }
    }
  }

</style>
