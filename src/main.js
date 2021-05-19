import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/icon.css';
import './assets/css/WebSite.css';

import "babel-polyfill";

import filters from './filter'
import utils from './utils'
Vue.config.devtools = true    //启用Google Vue扩展插件。
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(utils);
Object.keys(filters).forEach(x => Vue.filter(x, filters[x])); // 注册filter
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    if (store.state.isGoto) {
        // Vue.prototype.$message('路由未拦截');
        next();
    } else  {
        Vue.prototype.$confirm('此操作将清空已填写内容, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            store.commit('changeGoto');
            next();
        }).catch(() => {});
    }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
