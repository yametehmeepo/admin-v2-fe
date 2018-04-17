import React,{ Component } from 'react';
import PageTitle from 'component/page-title/index.jsx';
import { Button } from 'antd';

export default class Product extends Component {
	render(){
		return (
			<div>
				<PageTitle title='商品管理' />
			</div>
		)
	}
}

