define(["cardMod"], function(module){
  //console.log('----welcomeService----');
  module.factory('cardService',['$window','$state',function($window,$state){
  	 	//颜色渐变
        function colorGrad($scope){
          $scope.mygradient =1;
          $scope.imgUrl = "";
        }
        //正常
        function normal($scope){
          $scope.mygradient =0;
          $scope.imgUrl = "";
          $scope.image = "";
          $scope.foreground = "#fff";
          $scope.background ="#000";
        }
        //七彩
        function imgGrade($scope){
          $scope.imgUrl = "../img/t4.jpg";
        }
        //logo
        function logoChange($scope){
          $scope.image = "../img/top2.png";
        }
        //变色
        function colorChange($scope){
          $scope.foreground = "#fff";
          $scope.background ="#551A8B";
          $scope.mygradient =0;
          $scope.imgUrl = "";
        }
        return{
        	colorChange:colorChange,
        	logoChange:logoChange,
        	imgGrade:imgGrade,
        	normal:normal,
        	colorGrad:colorGrad
        }
  }])
});