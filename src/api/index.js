function getAllPath(path) {
  let global = 'http://localhost:7417';
  return global + path;
}
const api = {

  ///DD Start////////
	GetOrderType: getAllPath('/api/DD/GetOrderType'), //获取订单类型*

}

export default api;
