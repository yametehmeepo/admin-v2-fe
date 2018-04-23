import React,{ Component } from 'react';
import { Form, Icon, Input, Button, Select, message } from 'antd';
import MUtil from 'util/mm.jsx';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchListForm extends Component {
	handleSubmit(e){
		const { searchText, selectType, searchTriggerChange, searchTextChange, searchTrigger, searchHandler } = this.props;
		console.log('searchTrigger',searchTrigger);
		e.preventDefault();
		searchTriggerChange(true);
		this.props.form.validateFields((err, values) => {
			if (!err) {
				//searchTextChange('');
				var searchtext = this.props.form.getFieldValue('searchText').trim();
				if(searchtext === ''){
					message.error('输入不能为空');
					this.props.form.resetFields('searchText');
				}else{
					this.props.form.resetFields('searchText');
					var params = {};
					if(selectType === 'productId'){
						params = {
							productId: searchText,
						}
					}else{
						params = {
							productName: searchText
						}
					}
					MUtil.checkStatus().then(() => {
						searchHandler({
							url: '/manage/product/search.do',
							params,
						});
					})
				}
			}
		});
	}
	onInputChange(e, value){
		this.props.searchTextChange(e.target.value.trim());
	}
	onSelectChange(value){
		this.props.selectTypeChange(value);
	}
	onCancelSeach(){
		this.props.cancelSeach();
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const { searchTrigger } = this.props;
		//console.log('searchTrigger',searchTrigger)
		var selectValue = "按商品id查询";
		return (
			<div className="searchProduct">
				<Form layout="inline" onSubmit={(e) => this.handleSubmit(e)}>
					<FormItem>
						{
							getFieldDecorator('searchType', {
								initialValue: selectValue
							})(
								<Select onChange={(value) => this.onSelectChange(value)} style={{width: 150}}>
							        <Option value="productId">按商品id查询</Option>
							        <Option value="productName">按商品名称查询</Option>
							    </Select>
							)
						}
					</FormItem>
					<FormItem>
						{
							getFieldDecorator('searchText', {
								rules: [{
									required: true, message: '请输入关键字!'
								}]
							})(
								<Input name="searchInput" onChange={(e, value) => this.onInputChange(e, value)} placeholder="关键字"  style={{width: 160}}/>
							)
						}
					</FormItem>
					<FormItem>
						<Button htmlType="submit" type='default' style={{width: 52, padding: '0 10px'}}>查询</Button>
						<Button 
							type='default' 
							disabled={!searchTrigger}
							style={{marginLeft: 10, padding: '0 10px'}} 
							onClick={() => this.onCancelSeach()}
						>
							取消查询
						</Button>
					</FormItem>
				</Form>
			</div>
		)
	}
}

const SearchList = Form.create()(SearchListForm);
export default SearchList;
