 export const status = function(res,num){
    if(res.meta.status!=num) return this.$message.error(res.meta.msg)
    this.$message.success(res.meta.msg)
  }
//   export const reqData = function(method,url){
//       this.$http.[method](url)
//   }
