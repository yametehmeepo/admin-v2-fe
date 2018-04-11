# admin-v2-fe  

happy mmall 后台管理系统实战  

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
