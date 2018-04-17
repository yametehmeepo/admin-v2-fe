import React,{ Component } from 'react';
import { Button, Modal,Table, message } from 'antd';
import { Link } from 'react-router-dom';
import PageTitle from 'component/page-title/index.jsx';
import MUtil from 'util/mm.jsx';

const confirm = Modal.confirm;

export default class Product extends Component {
	constructor(){
		super();
		this.state = {
			loading: true,
			dataSource: [],
			total: '',
			pageNum: 1,
		}
		this.loadProductList = this.loadProductList.bind(this);
	}
	componentDidMount(){
		const { type, url } = this.props;
		MUtil.checkStatus().then(() => {
			this.loadProductList();
		});
	}
	handlePagination(pageNum){
		//console.log('user-getStorage', MUtil.getStorage('loginStatus'));
		MUtil.checkStatus().then(() => {
			this.setState({
				pageNum,
				loading: true,
			});
			MUtil.request({
				url: '/manage/product/list.do',
				params: { pageNum },
			}).then(res=>{
				res.list.map((item, index) => {
					item.key = index;
					var date = new Date(item.createTime);
					item.createTime = date.toLocaleString();
				});
				this.setState({
					dataSource: res.list,
					loading: false,
				});
			})	
		})
		
	}
	loadProductList(){
		MUtil.request({
			url: '/manage/product/list.do',
			params: {
				pageNum: this.state.pageNum
			}
		}).then(res=>{
			if(res.list.length){
				this.setState({
					total: res.total
				},()=>{
					res.list.map((item, index) => {
						item.key = index;
						var date = new Date(item.createTime);
						item.createTime = date.toLocaleString();
					});
					this.setState({
						dataSource: res.list,
						loading: false,
					});		
				});
			}else{
				this.setState({
					dataSource: [],
					loading: false,
				}, () => {
					document.querySelector('.ant-table-placeholder').innerHTML = '没有请求到任何数据';
				});	
			}
		}).catch(err => {
			this.setState({
				dataSource: [],
				loading: false,
			}, () => {
				document.querySelector('.ant-table-placeholder').innerHTML = '没有请求到任何数据';
			});
		});
	}
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
						console.log('pageNum', _this.state.pageNum);
						_this.loadProductList();
					})
				})
			},
			onCancel() {},
		});
	}
	render(){
		const { dataSource, total, pageNum, loading } = this.state;
		const pagination = {
			showQuickJumper: true,
			defaultCurrent: 1,
			total: total,
			current: pageNum,
			onChange: ((pageNum)=>{this.handlePagination(pageNum)}),
		};
		const defaultProps = {
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
		const { tableClassName, columns } =defaultProps;
		return (
			<div>
				<PageTitle title="商品管理" />
				<Table 
					className={tableClassName}
					bordered 
					rowClassName={(record, index) => index % 2  === 0 ? 'rowcss' : ''}
					loading={loading}
					columns={columns}
					dataSource={dataSource}
					pagination={pagination}
				/>
			</div>
		)
	}
}






