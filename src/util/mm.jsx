import axios from 'axios';
import { message } from 'antd';

const MUtil = {
	loginRequest(username, password){
		return axios.post('/manage/user/login.do', {
			username, password
		})
	},
	setStorage(name,data){
		const dataType = typeof data;
		if(dataType === 'object'){
			window.localStorage.setItem(name, JSON.stringify(data));
		}else if(['number','string','boolean'].indexOf(dataType)>=0){
			window.localStorage.setItem(name, data);
		}else{
			message.error('该数据类型不能进行本地存储!');
		}
	},
	getStorage(name){
		let data = window.localStorage.getItem(name);
		if(data){
			return JSON.parse(data);
		}else{
			return ''
		}
	},
	removeStorage(name){
		window.localStorage.removeItem(name);
	}
}


export default MUtil;

