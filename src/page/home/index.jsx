import React,{ Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageTitle from 'component/page-title/index.jsx';
//import MUtil from 'util/mm.jsx';
import './index.less'

export default class Home extends Component {
	render(){
		const { userCount, productCount, orderCount } = this.context;
		return (
			<div>
				<PageTitle title='首页' />
				<Row gutter={24}>
					<Col span={8}>
						<Link to="/user" className="countBox user">
							<p className="count">{userCount}</p>
							<p className="countName"><Icon type="user" /><span>用户总数</span></p>
						</Link>
					</Col>
					<Col span={8}>
						<Link to="/product" className="countBox product">
							<p className="count">{productCount}</p>
							<p className="countName"><Icon type="bars" /><span>商品总数</span></p>
						</Link>
					</Col>
					<Col span={8}>
						<Link to="/order" className="countBox order">
							<p className="count">{orderCount}</p>
							<p className="countName"><Icon type="check-square-o" /><span>订单总数</span></p>
						</Link>
					</Col>
				</Row>
			</div>
		)
	}
}
Home.contextTypes = {
	userCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	productCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	orderCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
