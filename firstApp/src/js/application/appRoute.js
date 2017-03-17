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

	    $urlRouterProvider.otherwise("/choose-oil-num");
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
	      controller: 'scrollCtrl'
	    }) 
		.state('welcome', {
	      url: '/welcome',
	      templateUrl : 'tpls/welcome.html',
	      controller:'welcomeCtrl',
	    })
	   	/* 支付 */
		.state('automatic-pay', {
	      url: '/automatic-pay',
	      params:{stationInfo:null},
	   	  templateUrl : 'tpls/automatic-payments.html',
	   	  controller: 'payCtrl'
	   	})
	   	/* 油站选择 */
		.state('gasstation-choose', {
	      url: '/gasstation-choose',
	   	  templateUrl : 'tpls/gasstation-choose.html',
	   	  // controller: 'tagFriendCtrl'
	   	})
	   	/* 支付成功 */
		.state('pay-success', {
	      url: '/pay-success',
	   	  templateUrl : 'tpls/pay-success.html',
	   	  // controller: 'tagFriendCtrl'
	   	})
	   	/* 选择油面号 */
		.state('choose-oil-num', {
	      url: '/choose-oil-num',
	   	  templateUrl : 'tpls/wechat-pay.html',
	   	  controller: 'wechatPayCtrl'
	   	});
	    hammerDefaultOptsProvider.set({
	        recognizers: [[Hammer.Tap, {time: 250}], 
	        			  [Hammer.Swipe, {time: 250}], 
	        			  [Hammer.Pan, {time: 250}]]
	    });
    }]);
 });
