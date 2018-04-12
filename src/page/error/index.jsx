import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from 'component/page-title/index.jsx';

export default class ErrorPage extends Component {
	render(){
		return (
			<div>
				<PageTitle title='出错啦!' />
				<p className="error"><Link to="/">点我返回</Link></p>
			</div>
		)
	}
}

