define(["wechatMod"], function(module){
  //console.log('----welcomeService----');
  module.factory('wechatService',['RPCService','$window','$state','Upload','globalContants','$http',
        function(RPCService,$window,$state,Upload,globalContants,$http){
            //获取油枪编号
            function findOilGunByOrg($scope){
                RPCService.getRPC('userService/findOilGunByOrg',
                          [$scope.station.id],
                          function(data){
                               /*$scope.station = data.list[0];*/
                               $scope.gun = data.list;

                          },
                          function(err){
                            console.log('发生错误：'+JSON.stringify(err))
                          },'single');
            }
            //获取详细订单
            function getOrderItem($scope){
              RPCService.getRPC('userService/findNotPayMendOrders',
                          [100548,1],
                          function(data){
                            if(data){
                              $scope.priceList =data.list;
                            }
                          },
                          function(err){
                            console.log('发生错误：'+JSON.stringify(err))
                          },'single');
            }
            //去支付
            function goPay($scope){
                var params =[$scope.stationInfo.stationCode,$scope.stationInfo.nozzleNum,
                $scope.stationInfo.workdate,$scope.stationInfo.turnNum,$scope.stationInfo.posId,
                $scope.stationInfo.fdcsSeq,$scope.stationInfo.posId,$scope.stationInfo.posId,$scope.stationInfo.posId,
                ]
               RPCService.getRPC('userService/synScanPayResult',
                [100548,1],
                function(data){
                  if(data){
                    $scope.priceList =data.list;
                  }
                },
                function(err){
                  console.log('发生错误：'+JSON.stringify(err))
                },'single');
            }
            return{
                findOilGunByOrg:findOilGunByOrg,
                getOrderItem:getOrderItem,
                goPay:goPay,
            }
        }]);
});