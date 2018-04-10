import React,{ Component } from 'react';

export default class PageTitle extends Component {
	render(){
		return (
			<h1 className="pageTitle">{this.props.title}</h1>
		)
	}
}

