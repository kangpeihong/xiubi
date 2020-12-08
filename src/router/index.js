import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Order from '../views/order'
import Register from '../views/register'
import Modify from '../views/modifypasw'
import Modifyifo from '../views/modifyinfo'
import Modifyadd from '../views/modifyadd'
import history from '../views/historyPage'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: Login
},
{
  path: '/order',
  component: Order
},
{
  path: '/register',
  component: Register
},
{
  path: '/modify',
  component: Modify
},
{
  path: '/modifyinfo',
  component: Modifyifo
},
{
  path: '/historyPage',
  component: history
}

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log('所有路由跳转经过这里')

  // 1.登录页面直接放行
  if (to.path === '/login' || to.path === '/register' || to.path === '/') {
    next()
    return
  }

  // 2.非登录页面 ，需要校验

  const token = window.sessionStorage.getItem('user-token')



  if (token) {
    next()
  } else {
    next('/login')
  }

  //   router.beforeEach((to, from, next) => {
//     // to将要访问的路径
//     // from代表从哪个路径跳转而来
//     // next 是一个函数，表示放行
//     // next() 放行， next('/login')强制跳转
//     debugger
//     if (to.path === '/login') return next();
//     const tokenStr = window.sessionStorage.getItem('user-token');  //判断是否存在token
//     if (!tokenStr) return next('/login');
//     next();
// });
})
export default router
