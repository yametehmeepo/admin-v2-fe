# admin-v2-fe  

### happy mmall 后台管理系统实战  

**技术栈: React16 + React-Router4 + antd + axios + less**   

[后台接口文档](https://gitee.com/imooccode/happymmallwiki/wikis)  

### 重点:  
**0.需要优化的地方**   
a)应该用`Redux`统一管理状态的, 关于`Redux`我本身理解的还是不够, 实践结束需要好好整理这方面的知识, 以备下次实践能顺利的用`Redux`管理状态  
b)从商品管理的开发开始, 请求后台接口非常频繁, 代码中有大量的`.then`和`setState`后的回调里再请求数据, 代码看着非常笨重, 优化起来还没什么思路, 先把坑放着, 看看后面会不会找到精简代码优化代码的办法  


**1.通用布局部分采用antd搭建, 再一次加强对antd的各个组件的使用**  
组件 `Menu` 的 `defaultOpenKeys` 和 `defaultSelectedKeys` 属性常规时候很好用  
在点击路由跳转的时候active样式也显示正常, 但是这个项目反复测试发现这两个属性会存在bug:  
**在非默认选择的路由时**  
比如`defaultSelectedKeys`是在第一个上, 点击商品管理(/product)active切换过来  
再刷新页面的时候(F5)active又选择在`defaultSelectedKeys`(也就是第一个)上了  
所以需要用`selectedKeys`这个属性, 通过`state`管理当前选中项是哪一个  

`Form` 非常好用的表单组件, 自带的校验规则超级棒  

### 目前还有一个不满意的地方:  
`Sider`组件的`breakpoint`属性只能设置一个  
如果是手机端我是想要实现`collapsedWidth`为0 出现特殊`trigger`的  但是没实现出来, 后面找到办法再补充上来  

**2.对webpack的使用又多了一些经验**  
因为这次搭建项目没有用`dva`或者`create-react-app`脚手架, `webpack` 的配置完全是跟着教程老师讲解做的  
学习到了`resolve` `devServer` `module`的用法  
在`package.json` 的 `scripts` 字段学习到配置缩写的运行命令  
  
**3.js中常用的一些函数整合到一个文件中**  
以前封装localStorage方法时单独写一个js文件, 发送axios请求或许都不封装在单独文件直接在生命中期中写  
结果就是代码不简洁易读, 现在把这一类的方法全部写在util里的js中, 用到的时候import就可以直接用了很方便  

**3.登录模块以及判断登录状态**  
因为后台或许会提供判断登录状态的信息, 现在只用前端技术去模拟对登录状态的判断  
本地存储知识再次巩固, 还有刷新时对登录状态进行判断, 重定向路由再次体会其中的逻辑处理  

**4.axios发送请求后台接收不到参数的解决办法**  
修改`axios/lib/default.js`  
<pre><code>if (isObject(data)) { 
	setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8'); 
	let keys2 = Object.keys(data);
	return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&')); 
}
</code></pre>  
或者  
<pre><code>1.import qs from 'qs'  <font color=gray>//axios自带qs</font>  
2.axios.post(url,qs.stringify({a:1,b:2}))	
</code></pre>  

**5.axios二次封装(用`Promise`对象)**  
之前一直没有封装常用方法的习惯, 导致有些组件里调用axios的代码非常多  
将来后台接口格式换一下或者`ajax`库换成`fetch`之类的改起来就会非常麻烦  
统一将一些常用方法定义在一个文件里, 这里就是**util/mm.jsx**   
`axios`本身是返回`promise`对象的, 但是我这里一开始就很困惑, `axios.get()`后面的`.then()`到底写在`mm.jsx`里   
还是写在调用它的组件的生命周期里, 因为要是写在组件里, 那每次发送请求都要判断用户的登录状态, 没登录的话就要跳转到登录页, 这样的话, 好多请求都要重复写这个登录状态的判断, 我觉得写在封装文件里比较好。  
那么写在封装文件里, 直接写 `return axios.get().....` 组件里调用它, 就不能用.then()去处理获取到的data  
原因应该是这个返回对象不是一个promise对象不能用.then() 。 所以在封装文件里需要用  
<pre><code>return new Promise((resolve, reject) => {
axios.get(url).then(res=>{
	resolve(res.data.data);
}).catch(err=>{
	reject(err);
})
})</code></pre>
这个`resolve` 和 `reject` 就是替换正常写法的return xxx  
它俩返回的就是promise对象, 所以可以后面.then()接着处理数据了  

<pre>这里记录一下当前对登录状态的理解。
用户登录求求发送到服务器后, 服务器判断账户和密码都对的情况下要记录该用户的登录ID(应该是**JSESSIONID**吧)
登录状态有一个有效期, 超过一定时间服务端就对删除这个**JSESSIONID**。 当这个**JSESSIONID**被删除后, 用户再操作管理系统
遇到发送ajax请求时, 后端就会返回一个未登录的status, 前端就要进行跳转登录页的操作</pre>  

**6.antd里的Table组件**  
Table组件在写用户列表时用到的, 非常好用, 但是API有些多, 后面还需要多练习使用, 主要的还是`columns`、`dataSource`、`pagination`、`loading` 这几个属性比较常用, 尤其是`pagination`在`List`组件里也有该属性。 

对请求返回的用户数据进行优化处理。  
当请求pageNum不存在, 也就是请求错误的列表页以及请求地址出错的情况下, table数据显示"没有请求到任何数据"(默认是No Data), `pagination`不显示  

在开发商品管理时, 因为之前的用户列表开发使用`Table`组件, 发现用户列表和商品管理页面布局和数据加载方式很相似, 就决定整合`Table`组件为新的组件`TableList`  
通过向`TableList`传递props来实现请求地址和列表内容渲染的区分, 整合过程中又对Table组件的相关API进行了查阅, 这里记录的要点是:  
`Table`组件可以有两种写法, 一种是在Table上传递`columns`和`dataSource`两个属性, 另一种则是把`columns`的属性通过  
<pre><code>&lt;Column&gt;
&lt;Column&gt;
&lt;Column&gt;</code></pre>的方式, 把每一列的相关数据传递到每一个`Column`中。  
这次整合采用了第一种办法。  
商品管理页在整合TableList时遇到了一些麻烦: **上/下架**的按钮事件是写在父组件`Product`中, 而点击完**上/下架**需要更新列表, 这时候需要重新请求productlist的数据, 但是需要的参数`pageNum`和'dataSource'都定义在`Table`组件里, 本来想着的是点击完**上/下架**后调用`Table`组件的`componentDidMount`生命周期来重新渲染, 一开始没想出来怎么去调用子组件的生命周期, 最后导致只能采取把这两个state放到父组件去处理, 越改发现需要更多相关的改动, 无奈prduct页就没有采用整合办法。  
后面查到可以用`this.refs.xx`的办法去调用子组件的方法, 就回过头来改, 发现可以调用子组件的生命周期, 特此记录一下。  
最基础的`this.refs.xx`竟然没想起来实在不应该  

**7.encodeURIComponent和decodeURIComponent**  
`encodeURIComponent`是十六进制的转义序列变为正常字符串  
`decodeURIComponent`是正常字符串变为十六进制的转义序列

**8.web-storage-cache库**  
这个插件是在[segmentfault](https://segmentfault.com/)网站搜到的, 起因是我在本地模拟管理登录状态时, 想通过给`localStorage`添加过期时间  
然后每次向后台发送请求时,去判断登录状态是否失效, 是的话就弹出提示然后跳转登录页  
这个库就是**WQTeam**用户封装的库, github地址是:  https://github.com/WQTeam/web-storage-cache  
具体API可以参考这个网站。  

**现在通过向后台发送请求用户数据的方式判断用户登录状态, 不采用localStorage的方式模拟登录状态了**  

**9.正则表达式**  
正则表达式很好用, 目前对这一块理解记忆的很不够, 先占坑, 项目实战结束后抓紧填坑  

**10.`Modal`组件**  
`Modal`组件 之前一直是用作弹窗显示, 比如之前的新闻实战项目点击右上角可以弹出注册和登录面板  
这里本来需求是弹出一个确认框, 如果不用antd组件的话我会用 `window.confirm()` 去写, 但是总感觉样式不好看和目前的管理系统不搭  
然后就发现原来`Modal`组件里面有一种用法就是类似`window.confirm()`, 这里记一下用法:  
**注: 使用 `confirm()` 可以快捷地弹出确认框。`onCancel/onOk` 返回 `promise` 可以延迟关闭**  
<pre><code>confirm({
	title: 'Do you want to delete these items?',
	content: 'When clicked the OK button, this dialog will be closed after 1 second',
	onOk() {
	  return new Promise((resolve, reject) => {
	    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
	  }).catch(() => console.log('Oops errors!'));
	},
	onCancel() {},
});</code></pre>  

**11.ES6方式向子组件传递函数**  
需要注意的是`()=>this.fatherFunction()` 这种方式不要漏掉参数 要写成`(param)=>this.fatherFunction(param)`  

**12.完善优化搜索功能**   
教程中只有一个查询按钮, 点击后可以按Id或者商品名称查询商品, 如果没有关键字则请求全部商品并渲染, 还存在一个bug:  当选择**按商品名称查询** 然后输入框为空, 点击查询出现数据加载不到显示异常的问题。 我的设计方案是多添加了一个取消查询按钮, 点击可以重新获取整个商品列表, 在点击取消查询后该按钮不可点击, 防止多余请求。  

**13.Form里多个Select分别验证**  
本来antd有一个`Cascader`级联选择的组件可以用作一级和二级商品的联级选择, 我打算一开始用两个`Select`来实现联级选择的, 最开始卡住的地方是这两个`Select`的表单验证必选, 我最开始错误的写法是将两个`Select`写在一个`FormItem`的`getFieldDecorator`里的控件参数的。 导致Form的自带验证对于这两个`Select`不好使。  经过查询Form的其中一个例子写法得知, 我这种需求需要把两个`Select`分别写在`FormItem`里, 代码如下:   
<pre><code>&lt;FormItem colon={false} label="所属分类" {...formItemLayout3}&gt;
	&lt;FormItem className="selectFormItem"&gt;
		{
			getFieldDecorator('firstProductCateId', {
				initialValue: '',
				rules: [{ required: true, message: '请选择一级品类!'}]
			})(
				&lt;Select style={{ width: 160, marginRight: 15 }} onChange={(v) => this.firstCategoryChange(v)}&gt;
					&lt;Option value=""&gt;请选择一级品类&lt;/Option&gt;
					{
						firstCategoryList.map((item, index) => (
							&lt;Option value={item.id} key={index}&gt;{item.name}&lt;/Option&gt;
						))
					}
				&lt;/Select&gt;
			)
		}
	&lt;/FormItem&gt;
	{
		secondCategoryList.length ?
		&lt;FormItem className="selectFormItem"&gt;
			{
				getFieldDecorator('secondProductCateId', {
					initialValue: '',
					rules: [{ required: true, message: '请选择二级品类!'}]
				})(
					&lt;Select style={{ width: 160 }} onChange={(v) => this.secondCategoryChange(v)}&gt;
						&lt;Option value=""&gt;请选择二级品类&lt;/Option&gt;
						{
							secondCategoryList.map((item, index) => (
								&lt;Option value={item.id} key={index}&gt;{item.name}&lt;/Option&gt;
							))
						}
					&lt;/Select&gt;
				)
			}
		&lt;/FormItem&gt;	
		: null
	}
&lt;/FormItem&gt;</code></pre>

**这里需要注意几点：**   
1.`initialValue`一定要是空字符串, 才能匹配到`Select`里`value=''`的`Option`, 也就是显示出默认选项"请选择一级品类"和"请选择二级品类"  
2.联级效果采用的是判断是否有第二项来进行加载。  

**14.Cascader联级选择**  
本以为用`Cascader`做品类的选择, 并带有点击加载附属品类的功能会比上面提到的用两个`Select`简单, 实际操作起来发现有难点, 主要原因是一级和二级品类不是事先定义好的, 是需要从后台获取数据的, 而且有些一级分类没有二级分类, 这就要求`Cascader`可以只选择一级也可以两个品类级别都选择。异步读取是通过`loadData(selectedOptions)`函数, 当`isLeaf: false` 就会触发`loadData` 从而在`loadData`方法中请求下一级数据。 正在加载的小圈圈是通过`selectedOptions`参数: <pre><code>const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;</code></pre>

通过`loading`值去显示或隐藏加载小圈圈。`Cascader`的表单验证用自带的就可以   

修改已有商品时, 需要通过`productId`获取该商品的数据。 没有二级品类的话, 直接将`categoryId`的值push进一个空数组`initialValue`中, 有二级品类的话, 需要将`parentCategoryId`和`categoryId`的值push到空数组`initialValue`中然后设置state。 因为`form`中的`Cascader`的默认值需要在`getFieldDecorator`中通过`initialValue`属性赋值的。
去antd官网多看看`Cascader`的API使用例子: `默认值通过数组的方式指定`。   

**15.Upload上传图片**   
组件用例介绍部分列出的案例都很好用, 我用的时候如果不考虑上传图片到服务器的具体过程的话, 其他功能都能满足, 但是实际情况是需要一个服务器地址用来保存上传的图片, 这里要用到`action`属性, 这是必选参数:上传地址。 我这里出现一个情况, 点击上传`console`报错500, 我一开始以为跨域的原因, 后来发现我所使用的后台接口地址, 需要一个**文件参数名**, 通过给`Upload`添加`name="upload_file"`属性才可以成功上传到后台。 找到这个原因是通过对比我自己上传图片发送的请求地址`Request Payload` 参数里(headers最下面), 里面有一个`Content-Disposition`, 我这里显示是`form-data; name="file"; filename="1111111.png"` 而教程的预览地址是`form-data; name="upload_file"; filename="1111111.png"
`就发现了不一样的`name`属性, 最后试着添加了一样的`name`属性就可以上传了。 回过头又去查阅了一下`Upload`的API, 找到了关于`name`属性的解释, 以后做上传文件的时候一定要注意到这个属性是否和后台提供的参数名一样。 

默认上传图片一定要是下面这个格式, 否则会加载不了:  
<pre><code>{
	uid: -1,
	name: 'xxx.png',
	status: 'done',
	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}</code></pre> 

**16.Form表单验证rules里的pattern属性**   
`pattern`属性是用来通过正则表达式验证控件的输入值, 要注意的是,pattern: 后面的正则表达式不要用引号包起来  

**17.向state(数组)中push一个对象**  
切记不能直接用`this.state.arr.push({a:1})`这种方式去push,因为它返回的是数组长度。要先`let newarr = this.state.arr`定义一个变量存储`state`的数组, 然后向`newarr`中`push` 这样再把`newarr`赋给`arr`  

**18.simditor富文本插件**  
`[simditor](http://simditor.tower.im/)`这个插件是跟着教程学着将其用到自己项目中, 官方文档需要多看看, 主要是初始化和获取值是如何实现的, 而且本插件依赖`jQuery`在模版`index.html`中需要引入jQuery的js文件, 否则会提示`$`未定义, 监听富文本内容事件是通过`jQuery`的`.on('valuechanged', (e) => {})`实现的, 在后面的回调函数里将值传递到使用它的父组件中

**19.react-router v4 可选参数**   
`path`的写法`path="/product/save/:id?"`  要注意到后面的问号, 代表可选参数, 否则访问`/product/save/` 加载不了组件  

**20.修改商品**   
数据回填的时候, 一共有这几个数据需要回填: `商品名称`,  `商品描述`,  `所属分类`,  `商品价格`,  `商品库存`,  `商品图片`,  `商品详情`  
其中`所属分类`, `商品图片`,  `商品详情` 这三部分较复杂。 如果用`Cascader`实现品类分级的话,参照**14**条去做, 如果是`Select`做的话会相对简单些。 `商品图片`一定要参照**15**条的格式写。  `商品详情`则是通过向`RichEditor`组件传值`defaultDetail` 然后在`RichEditor`组件的`componentWillReceiveProps`生命周期中判断新旧`defaultDetail`不一样的时候通过`setValue`方法将传递进来的`defaultDetail`设置成富文本的值。之所以不用`detail`而是用`defaultDetail`是因为如果用`detail`会造成, 富文本每次编辑都会通过`detail`重新设置富文本内容, 导致光标始终在文字前面。  

**21.修改商品的上传图片**   
这部分在商品管理开发完成后最后测试的时候发现了bug, 修改一个商品时, 之前上传过的图片不能正常显示出来。 原因是`Upload`的上传图片的数据格式比较复杂, 有效的图片地址是`fileList.response.data.url`的值, 而最后提交的时候上传图片的参数是`subImages` 所以从`fileList`转换到`subImages`费了一番功夫。 最后提交的时候需要将`subImages`的数组转化成字符串, 用的是`getSubImages`方法, 提交时候的参数: 修改商品的话就参数多一个`id`, 其它部分的参数和新增商品一样  

**22.**   


**23.**   