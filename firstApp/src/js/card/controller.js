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
  	'globalContants','$timeout','RPCService', 'PullToRefreshService', 'RPCService','cardService','Upload',
  	function($scope,$state,md5,$stateParams,
  		$window,globalContants,$timeout,RPCService, PullToRefreshService,RPCService,cardService,Upload){
        /*基础参数*/
      	$scope.text = $stateParams.text?$stateParams.text:'nihao';
        $scope.mygradient =0;//颜色渐变控制
        $scope.imgUrl = "";//图片背景控制
        $scope.image = "";//logo控制
        $scope.foreground = "#fff";//前景色控制
        $scope.background ="#000";//背景色控制
        $scope.background2 ="#000";
        $scope.selectStyle = -1;
        //点击logo 正常 等选项
        $scope.change =function(e,f){
          $scope.selectStyle = e;
          if(e==2){
            $scope.mygradient =0;
            $scope.imgUrl = "";
            $scope.image = "";
            $scope.foreground = "#fff";
            $scope.background ="#000";
          }
        }
        //具体选择某一项  比如蓝绿
        $scope.conChange = function(mygradient,background,background2,foreground,imgUrl){
          $scope.selectStyle = -1;
          $scope.mygradient = mygradient?mygradient:0;
          $scope.imgUrl = imgUrl?imgUrl:"";
          $scope.foreground = foreground?foreground:"#fff";
          $scope.background =background?background:"#000";
          $scope.background2 =background2?background2:"#000";
          console.log($scope.imgUrl)
        }
        //logo 选择
        $scope.changeLogo = function(e){
          $scope.selectStyle = -1;
          if(e==0){
            $scope.image = "../img/wx.png";//logo控制
          }else if (e==1){
            $scope.image = "../img/qq.png";//logo控制
          }
        }
       
        
        $scope.thumb="";
        //自定义上传logo
        $scope.up = function(file){
          if(!file ){
            return;
          }
          $scope.upload(file);
        }
       $scope.upload = function (file) {
        $scope.reader = new FileReader(); 
        $scope.reader.readAsDataURL(file[0]);
        $scope.reader.onload = function(ev) {
            $scope.$apply(function(){
                $scope.thumb = ev.target.result; //接收base64
            });
        }    
       
        $scope.fileInfo = file;
        Upload.upload({
            //服务端接收
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            //上传的同时带的参数
            data: {'username': $scope.username},
            //上传的文件
            file: file
        }).success(function (data, status, headers, config) {
            //上传成功
            console.log( config)
           
        }).error(function (data, status, headers, config) {
            //上传失败
            console.log('error status: ' + status);
        });
      };
       
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
