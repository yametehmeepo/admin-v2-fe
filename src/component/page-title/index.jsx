import React,{ Component } from 'react';

export default class PageTitle extends Component {
	componentWillMount(){
		document.title = this.props.title;
	}
	render(){
		return (
			<div className="pageTitleWrap">
				<h1 className="pageTitle">{this.props.title}</h1>
				{this.props.children}
			</div>
		)
	}
}

