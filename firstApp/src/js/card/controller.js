define(["cardMod"], function(module){
  module.controller('cardCtrl',
  	['$scope','$state','md5','$stateParams','$window',
  	'globalContants','$timeout','RPCService', 'PullToRefreshService', 'RPCService',
  	function($scope,$state,md5,$stateParams,
  		$window,globalContants,$timeout,RPCService, PullToRefreshService,RPCService){
      /*基础参数*/
		 $scope.setting=false;//设置的样式控制字段
      

    }
 ])
 /* 生成二维码*/
   module.controller('createCtrl',
  	['$scope','$state','md5','$stateParams','$window',
  	'globalContants','$timeout','RPCService', 'PullToRefreshService', 'RPCService',
  	function($scope,$state,md5,$stateParams,
  		$window,globalContants,$timeout,RPCService, PullToRefreshService,RPCService){
        /*基础参数*/
      	$scope.text = $stateParams.text?$stateParams.text:'nihao';
        $scope.image = "../img/top2.png";
        // $scope.image = "";

    }
 ])
   /*文本二维码*/
   module.controller('textCtrl',
  	['$scope','$state','md5','$stateParams','$window',
  	'globalContants','$timeout','RPCService', 'PullToRefreshService', 'RPCService',
  	function($scope,$state,md5,$stateParams,
  		$window,globalContants,$timeout,RPCService, PullToRefreshService,RPCService){
      /*基础参数*/
		$scope.text="";//设置的样式控制字段
      	$scope.goCreate = function(){
      		if(!$scope.text){
      			alert("输入内容为空");
      			return;
      		}
      		$state.go("creat",{text:$scope.text});
      	}

    }
 ])
});
