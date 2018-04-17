import React,{ Component } from 'react';
import { Row, Col, Table, Button, Icon, message } from 'antd';
import MUtil from 'util/mm.jsx';

export default class TableList extends Component {
	constructor(){
		super();
		this.state = {
			loading: true,
			dataSource: [],
			total: '',
			pageNum: 1,
		}
	}
	componentDidMount(){
		//console.log('table-componentDidMount');
		const { type, url } = this.props;
		MUtil.checkStatus().then(() => {
			MUtil.request({
				type,
				url,
				params: {
					pageNum: this.state.pageNum
				}
			}).then(res=>{
				if(res.list.length){
					//console.log('component/table-res.list',res.list);
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
		const { type, url } = this.props;
		//console.log('user-getStorage', MUtil.getStorage('loginStatus'));
		MUtil.checkStatus().then(() => {
			this.setState({
				pageNum,
				loading: true,
			});
			MUtil.request({
				type,
				url,
				params: { pageNum },
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
		const { loading, total, dataSource, pageNum } = this.state;
		const { tableClassName, columns } = this.props;
		const pagination = {
			showQuickJumper: true,
			defaultCurrent: 1,
			total: total,
			current: pageNum,
			hideOnSinglePage: true,
			onChange: ((pageNum)=>{this.handlePagination(pageNum)}),
		};
		return (
			<div className={tableClassName}>
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

