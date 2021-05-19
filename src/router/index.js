import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dd'
        },
        {
            path: '/dd',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '',
                    redirect: 'ddorder'
                },
                {
                    path: 'ddorder',
                    component: resolve => require(['../components/pages/WebRootDD/DDOrder.vue'], resolve),
                    meta: { title: '创建个检订单' }
                },
            ]
        },
        {
            // 权限页面
            path: '/permission',
            component: resolve => require(['../components/pages/Permission.vue'], resolve),
            meta: { title: '权限测试', permission: true }
        },
        {
            path: '/404',
            component: resolve => require(['../components/pages/404.vue'], resolve),
            meta: { title: '404' }
        },
        {
            path: '/403',
            component: resolve => require(['../components/pages/403.vue'], resolve),
            meta: { title: '403' }
        },
        {
            path: '/login',
            component: resolve => require(['../components/pages/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
