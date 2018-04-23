import React,{ Component } from 'react';
import { Form, Input, InputNumber, Icon, Cascader, Select, Button, Upload, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import PageTitle from 'component/page-title/index.jsx';
import RichEditor from 'component/rich-editor/index.jsx';
import MUtil from 'util/mm.jsx';

const FormItem = Form.Item;
const Option = Select.Option;

//上传图片类型限制
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
			id: '',
			previewVisible: false,
			previewImage: '',
			fileList: [],
			firstCategoryList: [],
			secondCategoryList: [],
			categoryId: '',
			name: '',
			subtitle: '',
			subImages: [],
			detail: '',
			defaultDetail: '',
			price: '',
			stock: '',
			status: 1,
			defaultCascader: '',
			initialValue: [],
		}
	}
	componentDidMount(){
		let id = this.props.match.params.id;
		//console.log(id);
		if(id){
			this.setState({
				id: id
			}, () => {
				MUtil.checkStatus().then(() => {
					MUtil.request({
						url: '/manage/product/detail.do',
						params: {
							productId: this.state.id
						}
					}).then((res) => {
						console.log('第一次res',res);
						let parentCategoryId = res.parentCategoryId,
						firstId = res.parentCategoryId,
						secondId = res.categoryId,
						parentIndex = '',
						firstName = '',
						secondName = '',
						productInfo = [],
						productInfo2 = [],
						initialValue = [],
						defaultCascader = '',
						fileList = [],
						subImages = [];
						if(res.subImages.indexOf(',') < 0 && res.subImages !== ''){
							subImages.push(res.subImages);
						}
						else{
							subImages = res.subImages.split(',');
						}
						//console.log('subImages',subImages);
						if(subImages.length){
							subImages.map((uri, index) => {
								let url = uri;
								if(uri.indexOf('/') < 0){
									url = res.imageHost + uri;
								}
								fileList.push({
									url: url,
									status: 'done',
									uid: index,
									name: uri
								})
							})	
						}
						res.defaultDetail = res.detail;
						res.fileList = fileList;
						res.subImages = subImages;
						this.setState(res, ()=>{
							MUtil.request({
								url: '/manage/category/get_category.do',
								params: {
									categoryId: 0
								}
							}).then((parentres) => {
								//先取得一级品类名
								parentres.map((item, index) => {
									if(item.id === firstId){
										firstName = item.name;
										parentIndex = index;
									}
									productInfo.push({
										value: item.id,
										label: item.name,
										isLeaf: false,
									});
								});
								this.setState({
									defaultCascader: firstName,
									firstCategoryList: productInfo
								}, () => {
									if(parentCategoryId){//如果有二级品类
										initialValue.push(firstId, secondId);
										this.setState({
											initialValue: initialValue
										}, () => {
											MUtil.request({
												url: '/manage/category/get_category.do',
												params: {
													categoryId: firstId
												}
											}).then((childres) => {
												childres.map((item, index) => {
													if(item.id === secondId){
														secondName = item.name;
													}
													productInfo2.push({
														value: item.id,
														label: item.name		
													})
												});
												productInfo[parentIndex].children = productInfo2;
												console.log('productInfo',productInfo);
												this.setState({
													defaultCascader: firstName+'/'+secondName,
													firstCategoryList: productInfo
												});
											}).catch((err) => {
												console.log(err);
											})	
										});
									}else{
										initialValue.push(secondId);
										this.setState({
											initialValue: initialValue
										})
									}

								});
								
							}).catch((err) => {
								console.log(err);
							})		
						})
					}).catch((err) => {
						console.log(err);
					})
				});		
			})
		}else{
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
	}
	//转化subImages为逗号拼接字符串
	getSubImages(){
		if(this.state.subImages.length > 1){
			return this.state.subImages.join(',');
		}else if(this.state.subImages.length === 1){
			return this.state.subImages[0]
		}else{
			return ''
		}
	}
	//提交表单
	handleSubmit(e){
		e.preventDefault();
		const { getFieldValue } = this.props.form;
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const { categoryId, name, subtitle, detail, price, stock, status, id } = this.state;
				let product = {};
				if(id){
					product = {
						categoryId,
						name,
						subtitle,
						subImages: this.getSubImages(),
						detail,
						price,
						stock,
						status,
						id
					}	
				}else{
					product = {
						categoryId,
						name,
						subtitle,
						subImages: this.getSubImages(),
						detail,
						price,
						stock,
						status,
					}	
				}
				
				MUtil.checkStatus().then(() => {
					MUtil.request({
						type: 'post',
						url: '/manage/product/save.do',
						data: product
					}).then((res) => {
						message.info(res);
						this.props.history.push('/product');
					}).catch((err) => {
						console.log(err);
					})
				});
			}
		});
	}
	//取消上传
	uploadhandleCancel(){
		this.setState({ previewVisible: false })
	}
	//上传图片预览
	uploadhandlePreview(file){
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}
	//上传图片
	uploadhandleChange({ file, fileList, e }){
		this.setState({ fileList },() => {
			let subImages = [];
			this.state.fileList.map((item, index) => {
				if(item.response === undefined){
					if(item.url === undefined){
						return false
					}else{
						subImages.push(item.url);
					}
				}else{
					subImages.push(item.response.data.url);
				}
			});
			this.setState({ subImages })
		})
	}
	//异步加载二级分类
	loadData(selectedOptions){
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
			targetOption.loading = false;
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
			}else{
				console.log('没有二级菜单')
			}
			this.setState({
				firstCategoryList: resArr
			})
		}).catch((err) => {
			console.log(err);
		})	
	}
	//联级选择的每次选择时触发
	onCascaderChange(value, selectedOptions){
			this.setState({
				categoryId: value[value.length-1],
			}, () => {
				console.log('categoryId',this.state.categoryId);
			})
	}
	//设置name
	onProductNameChange(e){
		this.setState({
			name: e.target.value
		})
	}
	//设置subtitle
	onProductInfoChange(e){
		this.setState({
			subtitle: e.target.value
		})
	}
	//设置price
	onProductPriceChange(e){
		this.setState({
			price: e.target.value
		})
	}
	//设置stock
	onProductStockChange(e){
		this.setState({
			stock: e.target.value
		})
	}
	// 价格自定义验证
	priceValidator(rule, value, callback){
		var v = parseInt(value);
		if(value<0){
			callback('价格不能是负数!');
		}else if(value === undefined){
			callback('请输入正确的价格!');
		}else{
			callback();
		}
	}
	//富文本传递内容
	onDetailValueChange(value){
		this.setState({
			detail: value
		}, () => {
			console.log(this.state.detail)
		})

	}
	render(){
		const { previewVisible, previewImage, fileList, firstCategoryList, secondCategoryList,
				name, subtitle, subImages, detail, price, stock, status, defaultDetail, defaultCascader, initialValue } = this.state;
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
		//var placeholderCascader = this.props.match.params.id?defaultCascader:"请选择品类";
		var productTitle = this.props.match.params.id?'商品管理 -- 修改商品':"商品管理 -- 添加商品";
		return (
			<div>
				<PageTitle title={productTitle} />
				<Form hideRequiredMark onSubmit={(e) => this.handleSubmit(e)}>
					<FormItem colon={false} label="商品名称" {...formItemLayout1}>
						{
							getFieldDecorator('productName', {
								initialValue: name,
								rules: [{ required: true, whitespace: true, message: '请输入商品名称!'}]
							})(
								<Input placeholder="请输入商品名称" onChange={(e) => this.onProductNameChange(e)}/>
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品描述" {...formItemLayout1}>
						{
							getFieldDecorator('productInfo', {
								initialValue: subtitle,
								rules: [{ required: true, whitespace: true, message: '请输入商品描述!'}]
							})(
								<Input placeholder="请输入商品描述" onChange={(e) => this.onProductInfoChange(e)}/>
							)
						}
					</FormItem>
					<FormItem colon={false} label="所属分类" {...formItemLayout3}>
						<FormItem className="selectFormItem">
							{
								getFieldDecorator('ProductCateId', {
									initialValue: initialValue,
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
								initialValue: price,
								rules: [{ required: true, validator: (rule, value, callback) => this.priceValidator(rule, value, callback)}]
							})(
								<Input 
									type="number" 
									placeholder="价格" 
									addonAfter="元" 
									onChange={(e) => this.onProductPriceChange(e)}
								/>
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品库存" {...formItemLayout2}>
						{
							getFieldDecorator('productStock', {
								initialValue: stock,
								rules: [{ required: true, pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入商品库存!'}]
							})(
								<Input type="number" placeholder="库存" addonAfter="件" onChange={(e) => this.onProductStockChange(e)} />
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
										multiple
										name="upload_file"
										action="/manage/product/upload.do"
										listType="picture-card"
										fileList={fileList}
										onPreview={(file) => this.uploadhandlePreview(file)}
										onChange={({file, fileList, e}) => this.uploadhandleChange({file, fileList, e})}
										beforeUpload={beforeUpload}
									>
										{fileList.length >= 5 ? null : uploadButton}
									</Upload>
									<Modal visible={previewVisible} footer={null} onCancel={() => this.uploadhandleCancel()}>
										<img style={{ width: '100%' }} src={previewImage} />
									</Modal>
								</div>
							)
						}
					</FormItem>
					<FormItem colon={false} label="商品详情" {...formItemLayout3}>
						{
							getFieldDecorator('productDetail', {
								rules: [{ /*required: true, message: '请输入商品详情!'*/}]
							})(
								<RichEditor 
									onDetailValueChange={(value) => this.onDetailValueChange(value)}
									defaultDetail={defaultDetail}
								/>
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





