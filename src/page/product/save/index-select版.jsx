import React,{ Component } from 'react';
import { Form, Input, Icon, Cascader, Select, Button, Upload, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import PageTitle from 'component/page-title/index.jsx';
import MUtil from 'util/mm.jsx';

const FormItem = Form.Item;
const Option = Select.Option;

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';//image/*
  if (!isJPG) {
    message.error('只可以上传图片文件!');
  }
  return isJPG;
}

class ProductSaveForm extends Component {
	constructor(){
		super();
		this.state = {
			previewVisible: false,
			previewImage: '',
			fileList: [],
			firstCategoryList: [],
			secondCategoryList: [],
			firstCategoryID: '',
			secondCategoryID: '',
		}
	}
	componentDidMount(){
		MUtil.checkStatus().then(() => {
			MUtil.request({
				url: '/manage/category/get_category.do',
				params: {
					categoryId: 0
				}
			}).then((res) => {
				//console.log(res);
				this.setState({
					firstCategoryList: res
				}, () => {
					console.log('firstCategoryList', this.state.firstCategoryList);
				})
			}).catch((err) => {
				console.log(err);
			})
		});
	}
	handleSubmit(e){
		e.preventDefault();
		const { getFieldValue } = this.props.form;
				//console.log('productName', getFieldValue('productName'));
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('表单验证通过', values);
			}
		});
	}
	uploadhandleCancel(){
		this.setState({ previewVisible: false })
	}
	uploadhandlePreview(file){
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}
	uploadhandleChange({ fileList }){
		this.setState({ fileList })
	}
	firstCategoryChange(value){
		//console.log('firstCategoryChange',value);
		this.setState({
			firstCategoryID: value,
			secondCategoryID: '',
			secondCategoryList: [],
		}, () => {
			console.log('firstCategoryID',this.state.firstCategoryID);
			console.log('secondCategoryID',this.state.secondCategoryID);
			if(this.state.firstCategoryID !== ''){
				MUtil.request({
					url: '/manage/category/get_category.do',
					params: {
						categoryId: value
					}
				}).then((res) => {
					//console.log(res);
					this.setState({
						secondCategoryList: res
					})
				}).catch((err) => {
					console.log(err);
				})		
			}
		})
	}
	secondCategoryChange(value){
		//console.log('secondCategoryChange',value);
		this.setState({
			secondCategoryID: value
		}, () => {
			console.log('firstCategoryID',this.state.firstCategoryID);
			console.log('secondCategoryID',this.state.secondCategoryID);
		})
	}
	render(){
		const { previewVisible, previewImage, fileList, firstCategoryList, secondCategoryList } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout1 = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 10 },
			},
		};
		const formItemLayout2 = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
		};
		const formItemLayout3 = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 20 },
			},
		};
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">上传图片</div>
			</div>
		);
		var firstValue = '请选择一级品类';
		var secondValue = '请选择二级品类';
		return (
			<div>
				<PageTitle title="商品管理 -- 添加商品" />
				<Form hideRequiredMark onSubmit={(e) => this.handleSubmit(e)}>
					<FormItem colon={false} label="商品名称" {...formItemLayout1}>
						{
							getFieldDecorator('productName', {
								rules: [{ required: true, message: '请输入商品名称!'}]
							})(
								<Input placeholder="请输入商品名称" />
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品描述" {...formItemLayout1}>
						{
							getFieldDecorator('productInfo', {
								rules: [{ required: true, message: '请输入商品描述!'}]
							})(
								<Input placeholder="请输入商品描述" />
							)
						}
					</FormItem>
					<FormItem colon={false} label="所属分类" {...formItemLayout3}>
						<FormItem className="selectFormItem">
							{
								getFieldDecorator('firstProductCateId', {
									initialValue: '',
									rules: [{ required: true, message: '请选择一级品类!'}]
								})(
									<Select style={{ width: 160, marginRight: 15 }} onChange={(v) => this.firstCategoryChange(v)}>
										<Option value="">请选择一级品类</Option>
										{
											firstCategoryList.map((item, index) => (
												<Option value={item.id} key={index}>{item.name}</Option>
											))
										}
									</Select>
								)
							}
						</FormItem>
						{
							secondCategoryList.length ?
							<FormItem className="selectFormItem">
								{
									getFieldDecorator('secondProductCateId', {
										initialValue: '',
										rules: [{ required: true, message: '请选择二级品类!'}]
									})(
										<Select style={{ width: 160 }} onChange={(v) => this.secondCategoryChange(v)}>
											<Option value="">请选择二级品类</Option>
											{
												secondCategoryList.map((item, index) => (
													<Option value={item.id} key={index}>{item.name}</Option>
												))
											}
										</Select>
									)
								}
							</FormItem>	
							: null
						}
					</FormItem>
					<FormItem colon={false} label="商品价格" {...formItemLayout2}>
						{
							getFieldDecorator('productPrice', {
								rules: [{ required: true, message: '请输入商品价格!'}]
							})(
								<Input type="number" placeholder="价格" addonAfter="元"/>
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品库存" {...formItemLayout2}>
						{
							getFieldDecorator('productStock', {
								rules: [{ required: true, message: '请输入商品库存!'}]
							})(
								<Input type="number" placeholder="库存" addonAfter="件"/>
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品图片" {...formItemLayout3}>
						{
							getFieldDecorator('productImg', {
								rules: [{ /*required: true, message: '请上传图片!'*/ }]
							})(
								<div className="uploadWrap">
									<Upload
										action="//jsonplaceholder.typicode.com/posts/"
										listType="picture-card"
										fileList={fileList}
										onPreview={(file) => this.uploadhandlePreview(file)}
										onChange={({fileList}) => this.uploadhandleChange({fileList})}
										beforeUpload={beforeUpload}
									>
										{fileList.length >= 3 ? null : uploadButton}
									</Upload>
									<Modal visible={previewVisible} footer={null} onCancel={() => this.uploadhandleCancel()}>
										<img style={{ width: '100%' }} src={previewImage} />
									</Modal>
								</div>
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品详情" {...formItemLayout2}>
						{
							getFieldDecorator('productDetail', {
								rules: [{ /*required: true, message: '请输入商品详情!'*/}]
							})(
								<div>
									<span>商品详情</span>
								</div>
							)
						}
					</FormItem>
					<FormItem colon={false} label=" " {...formItemLayout3}>
						<Button type='primary' htmlType="submit">提 交</Button>
					</FormItem>
				</Form>
			</div>
		)
	}
}

const ProductSave = Form.create()(ProductSaveForm);
export default ProductSave;





