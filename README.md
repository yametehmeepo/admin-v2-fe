# admin-v2-fe  

### happy mmall 后台管理系统实战  

技术栈: React16 + React-Router4 + antd + less   

重点:  
**1.通用布局部分采用antd搭建, 再一次加强对antd的各个组件的使用**  
组件 `Menu` 的 `defaultOpenKeys` 和 `defaultSelectedKeys` 属性常规时候很好用  
在点击路由跳转的时候active样式也显示正常, 但是这个项目反复测试发现这两个属性会存在bug:  
**在非默认选择的路由时**  
比如`defaultSelectedKeys`是在第一个上, 点击商品管理(/product)active切换过来  
再刷新页面的时候(F5)active又选择在defaultSelectedKeys(也就是第一个)上了  
所以需要用`selectedKeys`这个属性, 通过state管理当前选中项是哪一个  

Form 表单的使用最舒服, 自带的校验规则超级棒  

目前还有一个不满意的地方:  
`Sider`组件的breakpoint只能设置一个  
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
<pre><code>
	if (isObject(data)) { 
		setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8'); 
		let keys2 = Object.keys(data);
		return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&')); 
	}
</code></pre>  
或者  
<pre><code>1.import qs from 'qs'  //axios自带qs
2.axios.post(url,qs.stringify({a:1,b:2}))	
</code></pre>

**5.axios二次封装(用`Promise`对象)**  
之前一直没有封装常用方法的习惯, 导致有些组件里调用axios的代码非常多  
将来后台接口格式换一下或者`ajax`库换成`fetch`之类的改起来就会非常麻烦  
统一将一些常用方法定义在一个文件里, 这里就是**util**下的**mm.jsx**   
`axios`本身是返回`promise`对象的, 但是我这里一开始就很困惑, `axios.get()`后面的`.then()`到底写在`mm.jsx`里   
还是写在调用它的组件的生命周期里, 因为要是写在组件里那每次发送请求都要判断用户的登录状态, 没登录的话就要跳转到登录页  
这样的话, 好多请求都要重复写这个登录状态的判断, 我觉得写在封装文件里比较好。  
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

<code>这里记录一下当前对登录状态的理解。
用户登录求求发送到服务器后, 服务器判断账户和密码都对的情况下要记录该用户的登录ID(应该是**JSESSIONID**吧)
登录状态有一个有效期, 超过一定时间服务端就对删除这个**JSESSIONID**。 当这个**JSESSIONID**被删除后, 用户再操作管理系统
遇到发送ajax请求时, 后端就会返回一个未登录的status, 前端就要进行跳转登录页的操作</code>  

**6.antd里的Table组件**  
Table组件在写用户列表时用到的, 非常好用, 但是API有些多, 后面还需要多练习使用, 主要的还是`columns`、`dataSource`、`pagination`、`loading`  
这几个属性比较常用, 尤其是`pagination`在`List`组件里也有该属性。  
对请求返回的用户数据进行的优化处理。  
当请求pageNum不存在, 也就是请求错误的列表页以及请求地址出错的情况下, table数据显示"没有请求到任何数据", `pagination`也不显示  

**7.encodeURIComponent和decodeURIComponent**  
`encodeURIComponent`是十六进制的转义序列变为正常字符串  
`decodeURIComponent`是正常字符串变为十六进制的转义序列

**8.web-storage-cache库**  
这个插件是在`segmentfault`网站搜到的, 起因是我在本地模拟管理登录状态时, 想通过给`localStorage`添加过期时间  
然后每次向后台发送请求时,去判断登录状态是否失效, 是的话就弹出提示然后跳转登录页  
这个库就是**WQTeam**用户封装的库, github地址是:  https://github.com/WQTeam/web-storage-cache  
具体API可以参考这个网站。  
**通过向后台发送请求用户数据的方式判断用户登录状态, 不采用localStorage的方式模拟登录状态了**  

**9.**  


