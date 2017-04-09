define(["indexMod"], function(module){
  /*首页*/
  module.controller('indexCtrl',
  	['$scope','$state','$stateParams','RPCService','wechatService','$rootScope',
  	function($scope,$state,$stateParams,RPCService,wechatService,$rootScope){
      RPCService.getCurrentPoint(function(point){
        RPCService.getRPC('userService/getOrgByLngAndLat',
                  [point.lng,point.lat,1,10],
                  function(data){
                       $scope.station = data.list[0];
                  },
                  function(err){
                    console.log('发生错误：'+JSON.stringify(err))
                  },'single');
      });
      $scope.stationPop = false;//弹窗样式
      $scope.inputValue = "";//输入框的值
      //获取油站油枪
      $scope.selectStation = function(){
        
        var chars = ['0','1','2','3','4','5','6','7','8','9'];

        function generateMixed() {
             var res = "";
             for(var i = 0; i < 4 ; i ++) {
                 var id = Math.ceil(Math.random()*35);
                 res += chars[id];
             }
             console.log(res+"!!!!!!!!!!!!随机数");
           }
           generateMixed();
        alert( new Date().getTime())
        $scope.stationPop = true;
        wechatService.findOilGunByOrg($scope);
      }
      //选择油枪编号
      $scope.changeInputValue = function(e){
        $scope.stationPop = false;
        $scope.inputValue=e;
        //暂时写死的数据
        wechatService.getOrderItem($scope);
      }
      //选择具体的油品号
      $scope.select = function(e){
        $scope.stationInfo = $scope.priceList[e];
      }
      //下一步
      $scope.goNext = function(){
        if($scope.inputValue==""||$scope.station.id==""){
          $rootScope.popSample.showPop("油枪编号为空哦!");
          return ;
        }
        if(!$scope.stationInfo){
          $rootScope.popSample.showPop("请选择具体油品编号");
          return;
        }
        $state.go('automatic-pay',{stationInfo:$scope.stationInfo})
      }
    }
 ])
  /*支付ctrl*/
  module.controller('payCtrl', ['$scope','$stateParams','RPCService','$state','$rootScope','wechatService',
    function($scope,$stateParams,RPCService,$state,$rootScope,wechatService){
    /*获取消费订单信息*/
    $scope.stationInfo = $stateParams.stationInfo;
    if($scope.stationInfo.trStatue==0){
      $scope.trStatue="待支付";
    }else if($scope.stationInfo.trStatue==1){
      $scope.trStatue="支付成功";
      
    }else if($scope.stationInfo.trStatue==2){
       $scope.trStatue="支付失败";
    }
   /* 去支付*/
   $scope.goPay = function(){
    wechatService.goPay($scope);
   }
  }])
});
