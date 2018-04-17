import React,{ Component } from 'react';
import PageTitle from 'component/page-title/index.jsx';
import TableList from 'component/table/index.jsx';

export default class User extends Component {
	onClickButton(){
		this.table.componentDidMount();
	}
	render(){
		const listProps = {
			type: 'get',
			url: '/manage/user/list.do',
			tableClassName: 'userlist',
			columns: [{
				title: 'ID',
				width: '20%',
				dataIndex: 'id',
				key: 'id',
			},{
				title: '用户名',
				width: '20%',
				dataIndex: 'username',
				key: 'username',
			},{
				title: '邮箱',
				width: '20%',
				dataIndex: 'email',
				key: 'email',
			},{
				title: '电话',
				width: '20%',
				dataIndex: 'phone',
				key: 'phone',
			},{
				title: '注册时间',
				width: '20%',
				dataIndex: 'createTime',
				key: 'createTime',
			}]
		}
		return (
			<div>
				<PageTitle title="用户列表" />
				<TableList {...listProps} ref={table => this.table = table} />
			</div>
		)
	}
}

