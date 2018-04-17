import React,{ Component } from 'react';
import { Layout, Menu, Icon, Dropdown, message } from 'antd';
import { Link } from 'react-router-dom';
import { enquireScreen } from 'enquire-js';
import PropTypes from 'prop-types';
import MUtil from 'util/mm.jsx';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

let isMobile;
enquireScreen((b) => {
  isMobile = b;
  console.log(b);
});
const openKeysObj = {
	"/product": ['sub1-1'],
	"/product-catagory": ['sub1-2'],
	"/order": ['sub2-1'],
	"/user": ['sub3-1']
}


export default class BasicLayout extends Component {
	constructor(){
		super();
		this.state = {
			isMobile: isMobile,
			collapsed: false,
			selectedKeys: ['1'],
			username: '',
			userCount: ' ',
			productCount: ' ',
			orderCount: ' ',
			loginStatus: false
		}
	}
	getChildContext(){
		return {
			userCount: this.state.userCount,
			productCount: this.state.productCount,
			orderCount: this.state.orderCount
		}
	}
	componentWillMount(){
		MUtil.checkStatus().then(res=>{
			//console.log('layout-componentWillMount')
			this.setState({
				username: res.username,
				loginStatus: true
			})
		});
		this.UrlToSelectedKeys();
	}
	componentDidMount(){
			//console.log('进来啦,layout-componentDidMount');
			//console.log(res);
			MUtil.getHomeCount().then(res=>{
				this.setState(res.data.data);
			}).catch(err=>{console.log(err)});
	}
	componentWillReceiveProps(){
		//console.log('componentWillReceiveProps: '+window.location.pathname)
		this.UrlToSelectedKeys();
	}
	UrlToSelectedKeys(){
		const path = window.location.pathname;
		if(path === '' || path === '/'){
			this.setState({
				selectedKeys: ['1']
			})
		}
		else if(openKeysObj[path]){
			this.setState({
				selectedKeys: openKeysObj[path]
			})
		}else{
			this.setState({
				selectedKeys: ['']
			})
		}	
	}
	sideToggle(){
		this.setState({
			collapsed: !this.state.collapsed,
		})
	}
	changeSelectedKeys(item, key, keyPath){
		this.setState({
			selectedKeys: keyPath
		})
	}
	clickDropdown(item, key, keypath){
		if(key === '1'){
			MUtil.logout();
		}
	}
	render(){
		//console.log('进来啦,layout-render');
		const { selectedKeys, username, loginStatus } = this.state;
		const menu = (
			<Menu onClick={({item, key, keypath}) => this.clickDropdown(item, key, keypath)} style={{width: 260}}>
				<MenuItem key="1" style={{padding: '15px 20px'}}><Icon type="logout" style={{marginRight: 5}}/><span>退出登录</span></MenuItem>
			</Menu>
		)
			return ( loginStatus ?
				<Layout>
					<Sider 
						collapsible
						collapsed={this.state.collapsed}
						width={260}
						style={{minHeight: '100vh'}}
						trigger={null}
						breakpoint="lg"
						onCollapse={()=>{this.sideToggle()}}
						collapsedWidth={this.state.isMobile === true ? 0 : 80}
					>
						<div className="logo">
							<Link to="/" onClick={()=>{this.setState({selectedKeys: ['1']})}}>
								<img src={require('../../../test/logo.png')} alt="HAPPY MMALL"/><span style={{display: this.state.collapsed?'none':'inline-block'}}><strong>HAPPY</strong> MMALL</span>
							</Link>
						</div>
						<Menu
							theme="dark"
							mode="inline"
							selectedKeys={selectedKeys}
							defaultOpenKeys={['sub1', 'sub2', 'sub3']}
							onClick={({ item, key, keyPath })=>{this.changeSelectedKeys(item, key, keyPath)}}
						>
							<MenuItem key='1'><Link to='/' style={{color: '#fff'}}><Icon type="home" /><span>首页</span></Link></MenuItem>
							<SubMenu key='sub1' title={<span><Icon type="bars" /><span>商品</span></span>}>
								<MenuItem key='sub1-1'><Link to="/product">商品管理</Link></MenuItem>
								<MenuItem key='sub1-2'><Link to="/product-catagory">品类管理</Link></MenuItem>
							</SubMenu>
							<SubMenu key='sub2' title={<span><Icon type="check-square-o" /><span>订单</span></span>}>
								<MenuItem key='sub2-1'><Link to="/order">订单管理</Link></MenuItem>
							</SubMenu>
							<SubMenu key="sub3" title={<span><Icon type="user" /><span>用户</span></span>}>
								<MenuItem key='sub3-1'><Link to="/user">用户列表</Link></MenuItem>
							</SubMenu>
						</Menu>
					</Sider>
					<Layout>
						<Header className='headerstyle'>
							<div className="sideToggleIcon">
								<Icon type={!this.state.collapsed?'menu-fold':'menu-unfold'} onClick={()=>this.sideToggle()} />
							</div>
							<div className="welcomeAdmin">
								<Dropdown overlay={menu} trigger={['click']} style={{top: 64}}>
									<span className="adminButton">
										<Icon type="user" style={{marginRight: 5}}/><span>欢迎, {username}</span><Icon type="caret-down" style={{marginLeft: 5, fontSize: 12}} />
									</span>
								</Dropdown>
							</div>
						</Header>
						<Content style={{padding: '10px 25px'}}>
							{this.props.children}
						</Content>
					</Layout>
				</Layout>
				:
				null
			)
		
	}
}

BasicLayout.childContextTypes = {
	userCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	productCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	orderCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}


