import axios from 'axios';
import api from './api'
export default {
	install: function(Vue) {
		Vue.prototype.$axios = axios,
		Vue.prototype.$api = api,

		// table点击当前行选中
		Vue.prototype.clickRow = function (row, ref){
			this.$refs[ref].toggleRowSelection(row);
		}

	}
}
