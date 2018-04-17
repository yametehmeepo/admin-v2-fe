import axios from 'axios';
import WebStorageCache from 'web-storage-cache';
import { message } from 'antd';
import qs from 'qs';//axios自带qs库

const wsCache = new WebStorageCache();//初始化

const MUtil = {
	loginRequest(username, password){
		return axios.post('/manage/user/login.do', qs.stringify({username, password}))
	},
	logout(){
		axios.post('/user/logout.do').then(res=>{
			if(res.data.status === 0){
				message.success('退出成功!');
				this.doLogin();
			}else{
				message.error(res.data.msg);
			}
		})
	},
	request(param){//将除了登录的请求之外所有请求整合到这里
		let paramdata = null;
		if(param.type === 'post'){
			paramdata = qs.stringify(param.data);
		}else{
			paramdata = param.data;
		}
		return new Promise((resolve, reject) => {
			axios({
				method: param.type || 'get',
				url: param.url,
				params: param.params,
				data: paramdata
			}).then(res=>{
				if(res.data.status === 0){
					//console.log('进来啦,MUtil-request');
					//console.log(res.data.data);
					resolve(res.data.data);
				}else if(res.data.status === 10){//如果后台返回未登录(可能登录有生效时间,超过再发送请求,后台就返回未登录了)
					//resolve(res.data.msg);
					document.title = '登录超时';
					message.info('登录超时, 请重新登录!');
					setTimeout(() => {
						this.doLogin();
					}, 1500);
					//this.doLogin();
				}else{
					message.error(res.data.msg);
				}
			}).catch(err=>{
				//console.log(err);
				message.error('请求错误!');
				reject(err);
			})		
		})
	},
	doLogin(){
		window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)//encodeURIComponent是用来将字符串转化成它们的十六进制表示
	},
	getUrlParam(name){
        // param=123&param1=456
        let queryString = window.location.search.split('?')[1] || '',//获取问号后面字段, split() 返回字符串数组
            reg         = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),//定义正则表达式
            result      = queryString.match(reg);//返回去掉name开头,=号结尾之后的十六进制序列
        return result ? decodeURIComponent(result[2]) : null;//将十六进制序列编码成常规字符串并返回它 encodeURIComponent的反向
        //result[2] 选index=2的原因是queryString.match(reg)返回的是一个数组 ["redirect=%2F", "", "%2F", ""] (全部匹配, 第一个括号,第二个括号,第三个括号...几个括号就几个数组匹配)
    },
	/*setStorage(name, data){
		return wsCache.set(name, data, {exp : 300}); //设置过期时间300秒, localStorage里存的时间戳是毫秒单位
	},
	getStorage(name){
		return wsCache.get(name);
	},
	removeStorage(name){
		wsCache.delete(name);
	},*/  //通过向后台发送请求用户数据的方式判断用户登录状态, 不采用localStorage的方式模拟登录状态了
	getHomeCount(){
		return axios.get('/manage/statistic/base_count.do')
	},
	checkStatus(status){
		return this.request({type: 'post', url: '/user/get_information.do'});
	}
}


export default MUtil;

