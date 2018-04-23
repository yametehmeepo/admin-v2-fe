import React,{ Component } from 'react';
import {  Form, Input, Cascader, Select, Button, Upload, Modal, message, Row, Col } from 'antd';
import PageTitle from 'component/page-title/index.jsx';
import MUtil from 'util/mm.jsx';

const FormItem = Form.Item;

class ProductDetail extends Component {
	constructor(){
		super();
		this.state = {
			id: '',
			previewVisible: false,
			previewImage: '',
			fileList: [],
			firstCategoryList: [],
			categoryId: '',
			name: '',
			subtitle: '',
			subImages: [],
			detail: '',
			price: '',
			stock: '',
			status: 1,
			initialValue: [],
		}
	}
	componentDidMount(){
		let id = this.props.match.params.id;
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
					let parentCategoryId = res.parentCategoryId,
					firstId = res.parentCategoryId,
					secondId = res.categoryId,
					parentIndex = '',
					firstName = '',
					secondName = '',
					productInfo = [],
					productInfo2 = [],
					initialValue = [],
					fileList = [],
					subImages = [];
					if(res.subImages.indexOf(',') < 0 && res.subImages !== ''){
						subImages.push(res.subImages);
					}
					else{
						subImages = res.subImages.split(',');
					}
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
	}
	//取消预览
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
	render(){
		const { previewVisible, previewImage, fileList, firstCategoryList,
				name, subtitle, subImages, detail, price, stock, status, initialValue } = this.state;
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
		return (
			<div>
				<PageTitle title='商品详情' />
				<div>
					<FormItem colon={false} label="商品名称" {...formItemLayout1}>
						<Input value={name} placeholder="请输入商品名称" readOnly />
					</FormItem>
					<FormItem colon={false} label="商品描述" {...formItemLayout1}>
						<Input value={subtitle} placeholder="请输入商品描述" readOnly/>
					</FormItem>
					<FormItem colon={false} label="所属分类" {...formItemLayout3}>
						<Cascader
							placeholder="请选择品类"
							disabled
							value={initialValue}
							options={firstCategoryList}
						/>
					</FormItem>
					<FormItem colon={false} label="商品价格" {...formItemLayout2}>
						<Input value={price} type="number" placeholder="价格" addonAfter="元" readOnly />
					</FormItem>
					<FormItem colon={false} label="商品库存" {...formItemLayout2}>
						<Input value={stock} type="number" placeholder="库存" addonAfter="件" readOnly />
					</FormItem>
					<FormItem colon={false} label="商品图片" {...formItemLayout3}>
						<div className="uploadWrap">
							<Upload
								disabled
								listType="picture-card"
								fileList={fileList}
								onPreview={(file) => this.uploadhandlePreview(file)}
							/>
							<Modal visible={previewVisible} footer={null} onCancel={() => this.uploadhandleCancel()}>
								<img style={{ width: '100%' }} src={previewImage} />
							</Modal>
						</div>
					</FormItem>
					<FormItem colon={false} label="商品详情" {...formItemLayout3}>
						<div className="detailContent" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>
					</FormItem>
				</div>
			</div>
		)
	}
}

export default ProductDetail;





