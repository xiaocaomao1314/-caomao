import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
// ----------------------------------------------------
import Welcome from '@/views/Welcome'
import Users from '@/views/home/Users'
import Roles from '@/views/home/Roles'
import Rights from '@/views/home/Rights'
import Goods from '@/views/home/Goods'

import Orders from '@/views/home/Orders'
import Categories from '@/views/home/Categories'
import Params from '@/views/home/Params.vue'
import Add from '@/views/home/Add.vue'
import reports from '@/views/home/reports.vue'

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------------------
Vue.use(Router)


const router = new Router({
  routes: [
    {
      path:'/',redirect:'/login'
    },
    {
      path:'/login',component:Login
    },

    {
      path: '/home',component: Home,redirect:'/welcome',
      children:[
                {path:'/welcome',component:Welcome},
                {path:'/users',component:Users},
                {path:'/roles',component:Roles},
                {path:'/rights',component:Rights},
                {path:'/goods',component:Goods},
                {path:'/orders',component:Orders},
                {path:'/categories',component:Categories},
                {path:'/params',component:Params},
                {path:'/goods/add',component:Add},
                {path:'/reports',component:reports}

              ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(to.path=="/login")  return next()
  const Token = window.sessionStorage.getItem('token')
  if(!Token) return next('/login')
  next()

})
export default router
