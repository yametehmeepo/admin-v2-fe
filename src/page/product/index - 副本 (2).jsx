import React,{ Component } from 'react';
import { Button, Modal,Table, message } from 'antd';
import { Link } from 'react-router-dom';
import PageTitle from 'component/page-title/index.jsx';
import TableList from 'component/table/index.jsx';
import SearchList from 'component/searchlist/index.jsx';
import MUtil from 'util/mm.jsx';

const confirm = Modal.confirm;

export default class Product extends Component {
	statusChange(productId, status){
		console.log('productId',productId);
		console.log('status',status);
		let newStatus = status === 1 ? 0 : 1,
		    confirmTitle = status === 1 ? '确定要下架该商品么?' : '确定要上架该商品么?',
		 	_this = this;
		confirm({
			title: confirmTitle,
			onOk() {
				MUtil.checkStatus().then(()=>{
					MUtil.request({
						type: 'post',
						url: '/manage/product/set_sale_status.do',
						data: {
							productId: productId,
							status: newStatus,
						}
					}).then(res => {
						_this.table.componentDidMount();
					})
				})
			},
			onCancel() {},
		});
	}
	searchHandler(){
		
	}
	render(){
		const listProps = {
			type: 'get',
			url: '/manage/product/list.do',
			tableClassName: 'productlist',
			columns: [{
				title: 'id',
				width: '10%',
				dataIndex: 'id',
				key: 'id'
			},{
				title: '信息',
				width: '50%',
				dataIndex: 'username',
				key: 'username',
				render: (text, item) => (
					<div>
						<h4>{item.name}</h4>
						<p>{item.subtitle}</p>
					</div>
				)
			},{
				title: '价格',
				width: '10%',
				dataIndex: 'price',
				key: 'price',
				render: (text, item) => (
					<p>￥{item.price}</p>
				)
			},{
				title: '状态',
				width: '15%',
				dataIndex: 'status',
				key: 'status',
				render: (text, item, index) => (
					<div>
						<p>
							<span>{item.status === 1 ? '在售' : '已下架'}</span>
							<Button 
								size='small' 
								type="primary" 
								className="statusBtn" 
								onClick={(productId, status) => {this.statusChange(item.id, item.status)}}
							>
								{item.status === 1 ? '下架' : '上架'}
							</Button>
						</p>
					</div>
				)
			},{
				title: '操作',
				width: '15%',
				dataIndex: 'operator',
				key: 'operator',
				render: (text, item, index) => (
					<div className="tableOpearator">
						<Link to={`/product/${item.id}`}>查看</Link>
						<Link to={`/product/save`}>编辑</Link>
					</div>
				)
			}]
		}
		return (
			<div>
				<PageTitle title="商品管理" />
				<SearchList searchHandler={this.searchHandler.bind(this)}/>
				<TableList {...listProps} ref={table => this.table = table} />
			</div>
		)
	}
}

