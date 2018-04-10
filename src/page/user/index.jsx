import React,{ Component } from 'react';
import PageTitle from 'component/page-title/index.jsx';
import { Button } from 'antd';

export default class User extends Component {
	render(){
		return (
			<div>
				<PageTitle title='用户列表' />
			</div>
		)
	}
}

