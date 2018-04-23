import React,{ Component } from 'react';
import { Button, Modal, Table, message, Icon } from 'antd';
import { Link } from 'react-router-dom';
import PageTitle from 'component/page-title/index.jsx';
import SearchList from 'component/searchlist/index.jsx';
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
			selectType: 'productId',
			searchText: '',
			searchTrigger: false,
		}
		this.loadProductList = this.loadProductList.bind(this);
	}
	componentDidMount(){
		MUtil.checkStatus().then(() => {
			this.loadProductList({
				type:'get',
				url: '/manage/product/list.do',
				params: {
					pageNum: this.state.pageNum
				}
			});
		});
	}
	handlePagination(pageNum){
		console.log('searchTrigger', this.state.searchTrigger);
		console.log('pageNum', pageNum);
		const { searchText, selectType, searchTrigger } = this.state;
		var param = {};
		if(searchTrigger){
			if(selectType === 'productId'){
				param = {
					url: '/manage/product/search.do',
					params: {
						productId: searchText,
						pageNum: pageNum
					}
				}
			}else{
				param = {
					url: '/manage/product/search.do',
					params: {
						productName: searchText,
						pageNum: pageNum
					}
				}
			}
			
		}else{
			param = {
				url: '/manage/product/list.do',
				params: {
					pageNum: pageNum
				}
			}
		}
		MUtil.checkStatus().then(() => {
			this.setState({
				pageNum: pageNum,
				loading: true,
			}, () =>{
				MUtil.request(param).then(res=>{
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
			});
		})
		
	}
	loadProductList(param){
		//console.log('loadProductList-param',param);
		MUtil.request(param).then(res=>{
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
					total: 0,
				}, () => {
					document.querySelector('.ant-table-placeholder').innerHTML = '没有请求到任何数据';
				});	
			}
		}).catch(err => {
			this.setState({
				dataSource: [],
				loading: false,
				total: 0,
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
						_this.handlePagination(_this.state.pageNum);
					})
				})
			},
			onCancel() {},
		});
	}
	searchHandler(param){
		param.params.pageNum = 1;
		//console.log('param',param);
		this.setState({
			pageNum: 1
		}, () => {
			this.loadProductList(param);
		})
	}
	selectTypeChange(value){
		this.setState({
			selectType: value
		});	
	}
	searchTextChange(value){
		this.setState({
			searchText: value
		});	
	}
	searchTriggerChange(flag){
		this.setState({
			searchTrigger: flag
		});	
	}
	cancelSeach(){
		this.setState({
			searchTrigger: false,
			pageNum: 1,
			loading: true,
			searchText: '',
			selectType: 'productId',
		}, ()=>{
			this.loadProductList({
				url: '/manage/product/list.do',
				params: { pageNum: 1 },
			})
		});	
	}
	render(){
		const { dataSource, total, pageNum, loading, selectType, searchText, searchTrigger } = this.state;
		const pagination = {
			showQuickJumper: true,
			defaultCurrent: 1,
			total: total,
			current: pageNum,
			hideOnSinglePage: true,
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
						<Link to={`/product/detail/${item.id}`}>查看</Link>
						<Link to={`/product/save/${item.id}`}>编辑</Link>
					</div>
				)
			}]
		}
		const { tableClassName, columns } =defaultProps;
		return (
			<div>
				<PageTitle title="商品管理">
					<Link to="/product/save" className="addProductBtn">
						<Button type='primary'><Icon type="plus" />添加商品</Button>
					</Link>
				</PageTitle>
				<SearchList 
					searchHandler={(param) =>this.searchHandler(param)}
					searchTextChange={(value) => this.searchTextChange(value)}
					selectTypeChange={(value) => this.selectTypeChange(value)}
					searchTriggerChange={(flag) => this.searchTriggerChange(flag)}
					cancelSeach={() => this.cancelSeach()}
					selectType={selectType} 
					searchText={searchText} 
					searchTrigger={searchTrigger}
				/>
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






