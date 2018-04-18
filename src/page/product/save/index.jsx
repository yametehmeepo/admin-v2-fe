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
				var resArr = [];
				res.map((item, index) => {
					resArr.push({
						value: item.id,
						label: item.name,
						isLeaf: false,
					})
				})
				//console.log(resArr);
				this.setState({
					firstCategoryList: resArr
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
	loadData(selectedOptions){
		console.log('loadData-selectedOptions',selectedOptions);
		const targetOption = selectedOptions[selectedOptions.length - 1];
    		targetOption.loading = true;
		var v = targetOption.value;

		var i = null;
		this.state.firstCategoryList.map((item, index) => {
			if(item.value === v){
				i = index;
				return false;
			}
		});
		MUtil.request({
			url: '/manage/category/get_category.do',
			params: {
				categoryId: v
			}
		}).then((res) => {
			console.log('res',res);
			targetOption.loading = false;
			console.log('loading-false');
			var childrenArr = [],
				resArr = this.state.firstCategoryList;
			if(res.length>0){
				console.log('有二级菜单')
				res.map((item, index) => {
					childrenArr.push({
						value: item.id,
						label: item.name,
					});
					resArr[i].children = childrenArr;
				})
				//console.log('有二级菜单>resArr',resArr)
			}else{
				console.log('没有二级菜单')
				console.log('没有二级菜单>resArr',resArr)
			}
			this.setState({
				firstCategoryList: resArr
			})
		}).catch((err) => {
			console.log(err);
		})	
	}
	onCascaderChange(value, selectedOptions){
		if(value.length === 1){
			this.setState({
				firstCategoryID: value[0],
				secondCategoryID: ''
			}, () => {
				console.log('firstCategoryID',this.state.firstCategoryID);
				console.log('secondCategoryID',this.state.secondCategoryID);
			})
		}else{
			this.setState({
				firstCategoryID: value[0],
				secondCategoryID: value[1]
			}, () => {
				console.log('firstCategoryID',this.state.firstCategoryID);
				console.log('secondCategoryID',this.state.secondCategoryID);
			})
		}
		//console.log('onCascaderChange-value',value);
		//console.log('onCascaderChange-selectedOptions',selectedOptions);
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
								getFieldDecorator('ProductCateId', {
									rules: [{ required: true, message: '请选择品类!'}]
								})(
									<Cascader
										placeholder="请选择品类"
										options={firstCategoryList}
										loadData={(selectedOptions) => this.loadData(selectedOptions)}
										onChange={(value, selectedOptions) => this.onCascaderChange(value, selectedOptions)}
										changeOnSelect
									/>
								)
							}
						</FormItem>
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





