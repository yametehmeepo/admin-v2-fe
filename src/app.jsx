import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom'; 
import BasicLayout from 'component/layout/index.jsx';
import Login from 'page/login/index.jsx';
import Home from 'page/home/index.jsx';
import Product from 'page/product/index.jsx';
import ProductCatagory from 'page/product-catagory/index.jsx';
import Order from 'page/order/index.jsx';
import User from 'page/user/index.jsx';
import ErrorPage from 'page/error/index.jsx';
//import MUtil from 'util/mm.jsx';
//import './reset.css';
import 'antd/dist/antd.css';
//import '../test/css/icon.less'
import './index.css';

class App extends React.Component {
	render(){
		return (
			<Router>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/" render={(props)=>(
						<BasicLayout>
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/product" component={Product} />
								<Route exact path="/product-catagory" component={ProductCatagory} />
								<Route exact path="/order" component={Order} />
								<Route exact path="/user" component={User} />
								<Route component={ErrorPage} />
							</Switch>
						</BasicLayout>
					)} />
				</Switch>
			</Router>
		)
	}
}

ReactDOM.render(	
	<App />,
	document.getElementById('app')
)
