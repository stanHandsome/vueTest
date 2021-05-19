import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
Vue.use(Vuex);

const state = {
  collapse: false, // 是否展开左侧列表
  activeIndex: 'dd',
  Menus: [], // 总导航
  sideBarMenus: [], // 侧边导航
  openList: [], // 侧边栏默认打开
  isGoto: true,  // 当前页面是否允许调转
}

const mutations = {
  changeCollapse(state, flag) {
    if (state.collapse != flag) {
      state.collapse = flag;
    }
  },
  changeMenu(state, menu) {
    state.activeIndex = menu[0].path
    state.Menus = menu;
    state.sideBarMenus = menu.filter(x => x.path === state.activeIndex)[0].childrenNodes;
    state.openList[0] = state.sideBarMenus[0].part
  },
  changeActiveIndex(state, key) {
    state.activeIndex = key;
    state.sideBarMenus = state.Menus.filter(x => x.path === key)[0].childrenNodes;
    state.openList[0] = state.sideBarMenus[0].part
  },
  changeGoto(state) {
    state.isGoto = !state.isGoto;
  }
}
const actions = {
  getMenu({ commit }) {
    // axios.get('https://www.easy-mock.com/mock/5c60ed93c50cf921833f2a2c/moocApi/header').then(res => {
    axios.get('../header.json').then(res => {
      if (res.data) {
        commit('changeMenu', res.data);
      }
    })
  }
}

export default new Vuex.Store({
  state,
  // getters,
  mutations,
  actions
})
