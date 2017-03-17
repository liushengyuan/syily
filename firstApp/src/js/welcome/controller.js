define(["welMod"], function(module){
  module.controller('scrollCtrl',
  	['$scope','$state','md5','$stateParams','$window',
  	'globalContants','$timeout','RPCService', 'PullToRefreshService', 'RPCService',
  	function($scope,$state,md5,$stateParams,
  		$window,globalContants,$timeout,RPCService, PullToRefreshService,RPCService){

		/*var scroller1 = new PullToRefreshService.IScrollPullUpDown('wrapper',{
          probeType:2,
          bounceTime: 250,
          bounceEasing: 'quadratic',
          mouseWheel:false,
          scrollbars:true,
          fadeScrollbars:true,
          interactiveScrollbars:false
        },PullToRefreshService.pullDownAction, PullToRefreshService.pullUpAction);*/

      // RPCService.getCurrentPoint(function(point){
      //   RPCService.getRPC('userService/getOrgByLngAndLat',
      //             [point.lng,point.lat,1,10],
      //             function(data){
      //               console.log("success")
      //               // console.log(JSON.stringify(data))
      //             },
      //             function(err){
      //               console.log('发生错误：'+JSON.stringify(err))
      //             },'single');
      // });

    }
 ])
});
