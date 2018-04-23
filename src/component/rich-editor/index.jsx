import React,{ Component } from 'react';
import Simditor from 'simditor';
import 'simditor/styles/simditor.css';

export default class RichEditor extends Component {
	componentDidMount(){
		let el = this.textarea;
		this.simditor = new Simditor({
			textarea: $(el),
			upload: {
				url: '/manage/product/richtext_img_upload.do',
				fileKey: 'upload_file',
				leaveConfirm: '图片正在上传, 确定要离开页面吗?'
			}
		});
		this.simditor.on('valuechanged', (e) => {
			this.props.onDetailValueChange(this.simditor.getValue());
		})
	}
	componentWillReceiveProps(nextProps){
		//console.log('defaultDetail',nextProps.defaultDetail)
		if(this.props.defaultDetail !== nextProps.defaultDetail){
			this.simditor.setValue(nextProps.defaultDetail);
		}
	}
	render(){
		return (
			<div className="richeditor">
				<textarea ref={ textarea => this.textarea = textarea}></textarea>
			</div>
		)
	}
}

