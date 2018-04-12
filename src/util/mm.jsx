import axios from 'axios';
import WebStorageCache from 'web-storage-cache';
import { message } from 'antd';
import qs from 'qs';//axios自带qs库

const wsCache = new WebStorageCache();//初始化

const MUtil = {
	loginRequest(username, password){
		return axios.post('/manage/user/login.do', qs.stringify({username, password}))
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
				//console.log('mutil: ',res.data);
				if(res.data.status === 0){
					resolve(res.data.data);
				}else if(res.data.status === 10){//如果后台返回未登录(可能登录有生效时间,超过再发送请求,后台就返回未登录了)
					message.error(res.data.msg);
					this.doLogin();
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
        let queryString = window.location.search.split('?')[1] || '',//获取问号后面字段
            reg         = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),//定义正则表达式
            result      = queryString.match(reg);//返回去掉name开头=号结尾之后的十六进制序列
            //console.log('queryString',queryString);
            //console.log('reg',reg);
            //console.log('result',result);
        return result ? decodeURIComponent(result[2]) : null;//将十六进制序列编码成常规字符串并返回它
    },
	setStorage(name, data){
		/*const dataType = typeof data;
		if(dataType === 'object'){
			window.localStorage.setItem(name, JSON.stringify(data));
		}else if(['number','string','boolean'].indexOf(dataType)>=0){
			window.localStorage.setItem(name, data);
		}else{
			message.error('该数据类型不能进行本地存储!');
		}*/
		return wsCache.set(name, data, {exp : 30}); //设置过期时间300秒, localStorage里存的时间戳是毫秒单位
		//console.log('setStorage',typeof c)
	},
	getStorage(name){
		return wsCache.get(name);
		//console.log('getStorage',typeof b)
	},
	removeStorage(name){
		wsCache.delete(name);
	},
	getHomeCount(){
		return axios.get('/manage/statistic/base_count.do')
	},
	checkStatus(status){
		return new Promise((resolve, reject) => {
			const loginStatus = this.getStorage(status);
			if(!loginStatus){
				message.info('登录超时, 请重新登录!');
				setTimeout(() => {
					window.location.href = '/login'
				}, 1000);
			}else{
				resolve();
			}	
		})
		
	}
}


export default MUtil;

