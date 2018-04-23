import React,{ Component } from 'react';
import { Row, Col, Card, Form, Icon, Button, Input, message } from 'antd';
import MUtil from 'util/mm.jsx';

const FormItem = Form.Item;

class LoginForm extends Component {
	constructor(){
		super();
		this.state = {
			submiting: false,
			redirect: MUtil.getUrlParam('redirect') || '/'
		}
	}
	componentWillMount(){
		document.title = '登录 - HAPPY MMALL';
	}
	handleSubmit (e){
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			const username = this.props.form.getFieldValue('username');
			const password = this.props.form.getFieldValue('password');
			if (!err) {
				//console.log(username, password);
				this.setState({
					submiting: true
				});
				MUtil.loginRequest(username, password)
				.then(res=>{
					//console.log(res.data);
					this.setState({
						submiting: false
					});
					if(res.data.status === 1){
						message.error(res.data.msg);
					}
					if(res.data.status === 0){
						message.success('登录成功!');
						this.props.history.push(this.state.redirect);//this.state.redirect
					}
				})
				.catch(err=>{
					this.setState({
						submiting: false
					});
					//console.log(err);
					message.success('登录失败!');
				});
			}
		});
	}
	render(){
		//console.log('redirect: '+this.state.redirect);
		const { getFieldDecorator } = this.props.form;
		const { submiting } = this.state;
		return (
			<div className="loginPanel">
				<Row>
					<Col span={8} offset={8}>
						<Card title="欢迎登录 - MMALL管理系统" bordered={false} bodyStyle={{padding: '24px 24px 0'}}>
							<Form onSubmit={(e)=>this.handleSubmit (e)}>
								<FormItem>
									{
										getFieldDecorator('username', {
											initialValue: 'admin',
											rules: [{ required: true, message: '请输入用户名!'}]
										})(
											<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
										)
									}
								</FormItem>
								<FormItem>
									{
										getFieldDecorator('password', {
											initialValue: 'admin',
											rules: [{ required: true, message: '请输入密码!'}]
										})(
											<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
										)
									}
								</FormItem>
								<FormItem>
									<Button type="primary" htmlType="submit" size="large" className="login-form-button" loading={submiting}>登录</Button>
								</FormItem>
							</Form>	
						</Card>
					</Col>
				</Row>
			</div>
		)
	}
}
const Login = Form.create()(LoginForm);
export default Login;
