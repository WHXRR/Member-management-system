import router from './router'
import {getUserInfo} from './api/login'

router.beforeEach((to, from, next) => {
    //获取token
    const token = localStorage.getItem('msm-token')
    //如果没有获取到token
    //要访问非登录页，则不让访问，跳转到登录页面
    if(!token) {
        if(to.path !== '/login') {
            next({path: '/login'})
        }else {
            next()
        }
    }else {
        //如果获取到token
        //请求login
        if(to.path === '/login') {
            next()
        }else {
            //请求非登录页面，现在本地查看是否有用户信息
            const userInfo = localStorage.getItem('msm-user')
            if(userInfo) {
                //本地获取到，则去目标路由
                next()
            }else {
                //没有用户信息，通过token去获取用户信息
                getUserInfo(token).then(response => {
                    const resp = response.data
                    if(resp.flag) {
                        //如果获取到了用户信息，则进入非登录页面
                        //保存到本地
                        localStorage.setItem('msm-user', JSON.stringify(resp.data))
                        next()
                    }else {
                        //没有获取到，回到登录页
                        next({path: '/login'})
                    }
                })

            }
        }
    }

})