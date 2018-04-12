import React,{ Component } from 'react';
import { Row, Col, Table, Button, Icon, message } from 'antd';
import PageTitle from 'component/page-title/index.jsx';
import MUtil from 'util/mm.jsx';
import './index.less';

export default class User extends Component {
	constructor(){
		super();
		this.state = {
			loading: true,
			pageNum: 1,
			dataSource: [],
			total: '',
			pageNum: 1,
		}
	}
	componentDidMount(){
		MUtil.checkStatus('loginStatus').then(() => {
			MUtil.request({
				type: 'get',
				url: '/manage/user/list.do',
				params: {
					pageNum: this.state.pageNum
				}
			}).then(res=>{
				if(res.list.length){
					this.setState({
						total: res.total
					});
					res.list.map((item, index) => {
						item.key = index;
						var date=new Date(item.createTime);
						item.createTime = date.toLocaleString();
					});
					//console.log(res.list);
					this.setState({
						dataSource: res.list,
						loading: false,
					});	
				}else{
					this.setState({
						dataSource: [],
						loading: false,
					}, () => {
						document.querySelector('.ant-table-placeholder').innerHTML = '没有请求到任何数据';
					});	
				}
			}, err => {
				this.setState({
					dataSource: [],
					loading: false,
				}, () => {
					document.querySelector('.ant-table-placeholder').innerHTML = '没有请求到任何数据';
				});
			})
		});
	}
	handlePagination(pageNum){
		//console.log('user-getStorage', MUtil.getStorage('loginStatus'));
		MUtil.checkStatus('loginStatus').then(() => {
			this.setState({
				pageNum,
				loading: true,
			});
			MUtil.request({
				type: 'get',
				url: '/manage/user/list.do',
				params: {
					pageNum: pageNum
				}
			}).then(res=>{
				res.list.map((item, index) => {
					item.key = index;
					var date=new Date(item.createTime);
					item.createTime = date.toLocaleString();
				});
				//console.log(res.list);
				this.setState({
					dataSource: res.list,
					loading: false,
				});
			})	
		})
		
	}
	render(){
		const { loading, total } = this.state;
		const columns = [{
			title: 'ID',
			dataIndex: 'id',
			key: 'id'
		},{
			title: '用户名',
			dataIndex: 'username',
			key: 'username'
		},{
			title: '邮箱',
			dataIndex: 'email',
			key: 'email'
		},{
			title: '电话',
			dataIndex: 'phone',
			key: 'phone'
		},{
			title: '注册时间',
			dataIndex: 'createTime',
			key: 'createTime'
		}];
		const pagination = {
			showQuickJumper: true,
			defaultCurrent: 1,
			total: total,
			current: this.state.pageNum,
			onChange: ((pageNum)=>{this.handlePagination(pageNum)}),
		};
		return (
			<div>
				<PageTitle title='用户列表' />
				<div className="userlist">
					<Table 
						className='userTable'
						bordered 
						rowClassName={(record, index) => index % 2  === 0 ? 'rowcss' : ''}
						loading={loading}
						columns={columns} 
						dataSource={this.state.dataSource} 
						pagination={pagination}
					/>
				</div>
			</div>
		)
	}
}

