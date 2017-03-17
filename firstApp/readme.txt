一.访问后台方法
示例：
1.RPCService需要注入到controller
2.第一个参数名是后台模块名
3.参数以数组方式作为第二个参数传入
4.第三个参数为回调函数，回调函数接受两个值，第一个值为data为后台返回值，第二个参数status，为http响应编码
RPCService.getRPC("loginService.findModules", [null], null);
5.appConstants.js中追加了openId，需要用到的时候去那里边取，所有的一级页面加载的时候，为openId赋值，id值默认为
customerid的值，同志们你们看可好？（wh）
二.弹出框调用方法：
	1. 只有确定的弹窗 $scope.popSample.showPop('显示内容',callback});
		（第一个参数为显示内容，第二个为点击确定执行的函数）
	2. 有确定和取消的弹窗 $scope.popSure.showPop('显示内容',callback});
		（第一个参数为显示内容，第二个为点击确定执行的函数）
三.使用公共参数
	1，应用一旦加载立即执行application/appRun.js中的方法为application/appConstants.js中部分参数初始化
		id：用户的ID
		openId：微信提供的用户的唯一标示
		activateStatus：用户的机会状态
		headimgurl：用户的头像
		nikename：用户昵称
	2，在要使用application/appConstants.js中的公共参数control，server，directive中引用依赖application/appConstants.js中
	的globalContants，像使用对象一样取得需要的参数，如：globalContants.openId
	3，WeixinJSBridge.call('closeWindow'); 关闭微信内置浏览器，返回聊天界面，手机测试过好用，在微信测试工具上不能用，网页上也不
	好用。（wh）