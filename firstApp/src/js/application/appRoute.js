define([ 'app' ], function(app) {

  app.config(["$stateProvider", "$urlRouterProvider", 
  	"hammerDefaultOptsProvider", "$urlMatcherFactoryProvider", "cfpLoadingBarProvider", 
  	function($stateProvider, $urlRouterProvider, hammerDefaultOptsProvider, $urlMatcherFactoryProvider, cfpLoadingBarProvider) {
  		//$urlMatcherFactoryProvider.strictMode(false);

  		cfpLoadingBarProvider.includeBar = true;
  		cfpLoadingBarProvider.includeSpinner = false;
  		/*cfpLoadingBarProvider.latencyThreshold = 500;
  		cfpLoadingBarProvider.spinnerTemplate = '<div class="loadding">' + 
													'<div class="white-bg1">' + 
													'</div>' + 
													'<div class="loading-2">' + 
														'<div class="load8">' + 
															'<div class="loader">Loading...</div>' + 
															'<div class="loader-img">' + 
																'<img src="img/jiazai_ico1.png">' + 
															'</div>' + 
														'</div>' + 
													'</div>' + 
												'</div>';*/

	    $urlRouterProvider.otherwise("/home");
	    $stateProvider
		/* 测试页面1*/
		.state('tpls1', {
	      url: '/tpls1',
	      templateUrl : 'tpls/tpls1.html',
	      controller: 'tplsCtrl'
	    }) 
	    /* 测试页面1*/
		.state('tpls2', {
	      url: '/tpls2',
	      templateUrl : 'tpls/tpls2.html',
	      // controller: 'scrollCtrl'
	    }) 
		.state('welcome', {
	      url: '/welcome',
	      templateUrl : 'tpls/welcome.html',
	      // controller:'welcomeCtrl',
	    })
	   	/* 名片 */
		.state('card', {
	      url: '/card',
	      params:{stationInfo:null},
	   	  templateUrl : 'tpls/card.html',
	   	  // controller: 'payCtrl'
	   	})
	   	/* 文本 网页 */
		.state('text-card', {
	      url: '/text-card',
	   	  templateUrl : 'tpls/text.html',
	   	  // controller: 'tagFriendCtrl'
	   	})
	   	/* 主页 */
		.state('home', {
	      url: '/home',
	   	  templateUrl : 'tpls/home.html',
	   	  controller: 'cardCtrl'
	   	})
	   	/* app */
		.state('app', {
	      url: '/app',
	   	  templateUrl : 'tpls/app.html',
	   	  // controller: 'wechatPayCtrl'
	   	})
	   	/*sms*/
	   	.state('sms', {
	      url: '/sms',
	   	  templateUrl : 'tpls/sms.html',
	   	  // controller: 'wechatPayCtrl'
	   	})
	   	/*phone*/
	   	.state('phone', {
	      url: '/phone',
	   	  templateUrl : 'tpls/phone.html',
	   	  // controller: 'wechatPayCtrl'
	   	});
	    hammerDefaultOptsProvider.set({
	        recognizers: [[Hammer.Tap, {time: 250}], 
	        			  [Hammer.Swipe, {time: 250}], 
	        			  [Hammer.Pan, {time: 250}]]
	    });
    }]);
 });
