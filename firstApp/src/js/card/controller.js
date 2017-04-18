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
        
        //颜色渐变
        $scope.colorGrad = function(){
          $scope.mygradient =1;
          $scope.imgUrl = "";
        }
        //正常
        $scope.normal = function(){
          $scope.mygradient =0;
          $scope.imgUrl = "";
          $scope.image = "";
          $scope.foreground = "#fff";
          $scope.background ="#000";
        }
        //七彩
        $scope.imgGrade = function(){
          $scope.imgUrl = "../img/t4.jpg";
        }
        //logo
        $scope.logoChange = function(){
          $scope.image = "../img/top2.png";
        }
        //变色
        $scope.colorChange = function(){
          $scope.foreground = "#fff";
          $scope.background ="#551A8B";
          $scope.mygradient =0;
          $scope.imgUrl = "";
        }
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
