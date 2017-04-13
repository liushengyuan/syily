define([ 'app' ], function(app) {
	/** 备用滚动指令 */
	app.directive('whenScrolled', function() { 
	  return function(scope, elm, attr) { 
	    var raw = elm[0]; 
	    elm.bind('scroll', function() { 
	      if (raw.scrollTop+raw.offsetHeight >= raw.scrollHeight) { 
	        scope.$apply(attr.whenScrolled); 
	      } 
	    }); 
	  }; 
	});

	/* 基于Iscroll5的下拉刷新，上拉加载 */
	app.directive('pullToRefresh', function() {
	  return {
	    restrict: 'A',
	    scope: {
	    	pullDownFun: '&',
	    	pullUpFun: '&',
	    	limitUp:"=",
	    	gradient:'='
	    },//隔离作用域
	    controller: ['$scope', '$rootScope', '$attrs', '$element', '$timeout', 
	    'PullToRefreshService', 'RPCService', 'globalContants', 
	    function($scope, $rootScope, $attrs, $element, $timeout, PullToRefreshService, 
	    	RPCService, globalContants) {
	    	console.log("IScroll Init");

	    	var generatedCount=0;
	    	
    	    var pullDownAction = function(theScroller) {
    	      
    	      if(RPCService.scrollerState.TabID){
    	      	//var TabID = RPCService.scrollerState.factoryCurrentTabId();
		    	RPCService.iScrollMap.put(RPCService.scrollerState.TabID + "IScroll", theScroller);
		 	  } else {
		 	  	RPCService.setTheScroller(theScroller);
		 	  }
		 	  
		      setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
		        console.log("下拉");
		        $scope.pullDownFun();
		        // theScroller.refresh();    // Remember to refresh when contents are loaded (ie: on ajax completion)
		      }, 200); // <-- Simulate network congestion, remove setTimeout from production!
		    }
		    if($scope.limitUp){
		    	var pullUpAction = "";
		    }else{
			    var pullUpAction = function(theScroller) {
			      if(RPCService.scrollerState.TabID){
			      	//var TabID = RPCService.scrollerState.factoryCurrentTabId();
			    	RPCService.iScrollMap.put(RPCService.scrollerState.TabID + "IScroll", theScroller);
			 	  } else {
			 	  	RPCService.setTheScroller(theScroller);
			 	  }

			      setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
			        console.log("上拉");
			        $scope.pullUpFun();
			        // theScroller.refresh();    // Remember to refresh when contents are loaded (ie: on ajax completion)
			      }, 200); // <-- Simulate network congestion, remove setTimeout from production!
			    }
			    
		    }
		    
			function iScrollClick(){
				// workaround click bug iscroll #674
				if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
				if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
				if (/Silk/i.test(navigator.userAgent)) return false;
				if (/Android/i.test(navigator.userAgent)) {
				  var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
				  return parseFloat(s[0]+s[3]) < 44 ? false : true}
			}

	    	var wrapperId = $attrs.id;
	    	var scroller;
	    	//console.log("--------" + $element[0]);
	    	$element.ready(function(){
	    		
		    	$timeout(function(){

			    	scroller = new PullToRefreshService.IScrollPullUpDown($element[0] ,{
				          probeType:2,
				          bounceTime: 250,
				          preventDefault:  false,
						  tap: false,
						  click: false,
				          bounceEasing: 'quadratic',
				          mouseWheel:false,
				          scrollbars:false,
				          fadeScrollbars:true,
				          interactiveScrollbars:false
				        }, pullDownAction, pullUpAction);
			    	console.log("IScroll Instance Finsh");
			    	scroller.init();
			    	
			    	if(RPCService.scrollerState.TabID){
			    		var TabID = RPCService.scrollerState.factoryCurrentTabId();
			    		RPCService.iScrollMap.put(TabID + "PullRefreshIScroll", scroller);
			    	} else {
			    		var gradient = $scope.gradient;//为导航栏渐变颜色使用
			    		RPCService.setPullRefreshObj(scroller,gradient);
			    		
			    	}
			    	scroller.myScroll.refresh();
			    	//this.scrollObj = scroller;
					$element.on('touchmove', function (e) { e.preventDefault(); });
			    	
			    	$scope.$parent.$broadcast('to-child');
			    	
		    	});
	    	});

	    	//父控制器中监听事件
			// $scope.$on('to-parent',function(){
			//     //父控制器执行操作
			//     console.log("-----parent");
			// })

			//子控制器中监听事件
			$scope.$on('to-child',function(){
			    //子控制器执行操作
			    console.log("-----children");
			    var totalPage = globalContants.totalPageCount;
			     console.log("-----children"+totalPage);
		     	//totalPage && totalPage <= 1
			    if(!totalPage||totalPage <=1 ){
			    	if(RPCService.scrollerState.TabID){
	                  var PullRefreshIscrollObj = RPCService.iScrollMap.get(RPCService.scrollerState.TabID + "PullRefreshIScroll");
	                  if(PullRefreshIscrollObj){
	                    PullRefreshIscrollObj.hidePullUpEl();
	                  }
	                } else {
	                  if(RPCService.scrollerState.pullRefreshObj){
	                    RPCService.scrollerState.pullRefreshObj.hidePullUpEl();
	                  }
	                }
			    }
			    $timeout(function(){
			    	console.log("-----children exe");
			    	scroller.myScroll.refresh();
			    }, 200);
			})

	    }]
	  };
	});

	app.directive('repeatFinish',function(){
	    return {
	    	require: "^pullToRefresh",
	        link: function(scope,element,attr,refreshCtrl){
	            console.log(scope.$index)
	            if(scope.$last == true){
	                console.log('ng-repeat执行完毕')
	                //向父控制器传递事件
	                //scope.$emit('to-parent');
	                //向子控制器传递事件
	                scope.$parent.$broadcast('to-child');
	            }
	        }
	    }
	});

	/** 弹窗指令 --只有确定*/
	app.directive('compop', function(){
		return{
			restrict:'E',
			templateUrl:'tpls/popup/popup2.html'
		}
	});

	/** 弹窗指令 --有确定和取消*/ 
	app.directive('compopsure', function(){
		return{
			restrict:'E',
			templateUrl:'tpls/popup/popup1.html'
		}
	});
	/** 手机弹窗指令 --有拨号和取消*/ 
	app.directive('phonepopsure', function(){
		return{
			restrict:'E',
			templateUrl:'tpls/popup/popup-phone.html'
		}
	});

	/** 加载请求等待页面指令 */
	app.directive('waitRpc', function(){
		return{
			restrict:'E',
			templateUrl:'tpls/popup/loading.html'
		}
	});

	/** 返回指令 */
	app.directive('onBack', ["$window", "$log", function($window,$log){
		var link = ["$scope","$element","$attrs","$state",function($scope, $element, $attrs,$state){
			/*控制安卓返回按钮*/
			var lastValue ,stateGoRoute , stateGoParams, androidOnBack = new Array(),paramOnBack = new Array();
			$element.on("click", function(){
				//$window.history.back();
				/*获取存在session中的路由*/
	            console.log("----window---"+window.sessionStorage.getItem('formArray'));
	            //判断是否有值
	            if(window.sessionStorage.getItem('formArray')){
	            	//将字符串转换成数组
		            androidOnBack = eval("("+window.sessionStorage.getItem('formArray')+")");
	                paramOnBack = eval("("+window.sessionStorage.getItem("paramArray")+")");
		            if(androidOnBack&&androidOnBack.length != 0){
		            	//每次点击只取数组最后一个值，赋给$state.go
		                lastValue = androidOnBack[androidOnBack.length-1];
		                stateGoRoute = lastValue.split("#")[0];//路由
		                stateGoParams = lastValue.split("#")[1].replace(/[&]/g,",");//参数
		                var stateGoParams1 = paramOnBack[paramOnBack.length-1];
		                console.log(stateGoRoute+"----<--------stateGo-------->-------"+stateGoParams1);
		                $state.go(stateGoRoute,stateGoParams1);
		            }else{
		                //console.log("------内层-------点击两下关闭App---------");
		            }
	            }
			})
		}]

		return{
			restrict:'A',
			controller: link
		}
	}]);
	/* 公用tab标签指令 */
	app.directive('pubTabs', function() {
	  return {
	    restrict: 'E',
	    transclude: true,
	    scope: {
	    	divClass: '@',
	    	ulClass: '@',
	    	liClass: '@',
	    	method: '&',
	    	activei:'=',
	    	saveSwiper:'=',
	    },//隔离作用域
	    controller: ['$scope', 'RPCService','$timeout', function($scope, RPCService,$timeout) {

	      var panes = $scope.panes = [];
	      $scope.elements = [];
	      $scope.swiper = [];
	      $scope.saveSwiper = function(swiper){
            $scope.swiper = swiper;
	      };
	      $scope.activei = function(){
	      	var index = $scope.swiper.activeIndex;
            var pane = panes[index];
	      	$scope.select(pane);
	      };

	      $scope.change = function(pane,$index){
            $scope.swiper.slideTo($index);
	      };
	      $scope.select = function(pane) {
	        angular.forEach(panes, function(pane) {
	          pane.selected = false;
	        });
	        $timeout(function(){
	           pane.selected = true;
	        });
	        if(pane.liType){
	        	RPCService.scrollerState.TabID = pane.liType;
		        $scope.method()(pane.liType);
                var elem= document.querySelectorAll(".tab-pane");
                var list,objul,myDefault;
                var count = 0;
                var addListener = setInterval(function(){//监听是否出现li元素，若出现，如有复制页面则将复制页面删除
                  count++;
                  // console.log(list,count);
                  objul=elem[pane.liType-1].querySelectorAll("ul").length == 2?elem[pane.liType-1].querySelectorAll("ul")[1]:elem[pane.liType-1].querySelectorAll("ul")[0];
                  myDefault = elem[pane.liType-1].querySelectorAll(".my-default");
                  if(myDefault && myDefault.length == 2){//判断如果没有数据时移除"没有数据提醒"
                    angular.element(myDefault[0]).remove();
                    clearInterval(addListener);
                  }else if(objul) {//当有数据存在时移除复制的数据
                  	var list=objul.getElementsByTagName("li");
                    if (list.length > 0) {
                      if (elem[pane.liType-1].children.length > 1) {
                	    angular.element(elem[pane.liType-1].children[0]).remove();
                      }
                      clearInterval(addListener);
                    }else if(count == 10){
                      clearInterval(addListener);
                    }
                  }
                },100);
                if ($scope.elements.length > 0) {//给当前页面的左右两页追加页面
                  if ((pane.liType - $scope.elements.length) == 1) {
                  	if ($scope.elements[pane.liType-2].querySelectorAll("ul").length != 0) {
		              angular.element(elem[pane.liType - 2]).prepend($scope.elements[pane.liType-2]);
                  	}
		          }else{
		          	if ((pane.liType - $scope.elements.length) < 0) {
		          	  angular.element(elem[pane.liType]).prepend($scope.elements[pane.liType]);
		          	}
		          	if (pane.liType != 1) {
		          	  angular.element(elem[pane.liType-2]).prepend($scope.elements[pane.liType-2]);
		          	}
		          }
                }
		        
		        $timeout(function(){//复制当前页面
		          var element = angular.element(elem[pane.liType-1].children[0]).clone();
		          var pullUp = element[0].querySelector(".pullUp");
                  var pullDown = element[0].querySelector(".pullDown");
                  element[0].style.zIndex = 123;
                  if (!element[0].querySelector("ul")) {
                    element[0].style.display = "none";
                  }
                  angular.element(pullUp).empty();
                  angular.element(pullDown).empty();
                  if ($scope.elements.length < pane.liType) {
                  	$scope.elements.push(element[0]);
                  }
		        },300);
	        }
	      };

	      this.addPane = function(pane) {
	        if ($scope.panes.length === 0) {
	          $scope.select(pane);
	        }
	        if(pane.liType){
	        	RPCService.scrollerState.TabArray.push(pane.liType);
	        }
	        
	        $scope.panes.push(pane);
	      };
	    }],
	    templateUrl: 'tpls/public/tabsLabel.html'
	  };
	});

	app.directive('pubPane', function() {
	  return {
	    require: '^pubTabs',
	    restrict: 'E',
	    transclude: true,
	    scope: {
	      title: '@',
	      liType: '@',
	      pubCls:'@'
	    },
	    link: function(scope, element, attrs, tabsCtrl) {
	      tabsCtrl.addPane(scope);
	    },
	    templateUrl: 'tpls/public/tabPane.html'
	    
	  };
	});

	/* cavas图片指令 */
	app.directive('canvasImg', ['$window', function($window) {

	    var canvas2D = !!$window.CanvasRenderingContext2D;

	    return {
	      restrict: 'A',
	      template: function(elem, attr){
	      	var cssVal = "";
	      	if(attr.css){
	      		cssVal = attr.css;
	      	}
	      	return '<canvas class="' + cssVal + '"></canvas>';
	      },
	      link: function(scope, element, attrs) {
	        var domElement = element[0],
	            $canvas = element.find('canvas'),
	            canvas = $canvas[0],
	            context = canvas2D ? canvas.getContext('2d') : null;

	            canvas.width = domElement.offsetWidth;
	            canvas.height = domElement.offsetHeight;

	            var img = new Image();
	            //img.width = domElement.offsetWidth;
	            //img.height = domElement.offsetHeight;
	  			img.onload = function(){
	  				if(context){
	  					context.drawImage(img, 0, 0, img.width, img.height,
	  						0, 0, canvas.width, canvas.height);

	  				}
	  			}

	        attrs.$observe('imgSrc', function(value) {
	          if (!value) {
	            return;
	          }
	          img.src = value;
	        });
	      }
	    };
	}]);

	/* 获取ng-bind中包含html代码的内容 */
	app.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // In case value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
    /* 公用密码弹窗输入框指令 */
    app.directive('gridPassword', function(){
		// Runs during compile
		return {
			restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
			scope: {
				hide: '=isShow'
			},
			controller: ['$scope','RPCService','globalContants','$rootScope',function($scope,RPCService,globalContants,$rootScope) {
				$scope.inputpass = {
					inputA:'',
					inputB:'',
					inputC:'',
					inputD:'',
					inputE:'',
					inputF:'',
					clickFunction: function(){
						var password = this.inputA+this.inputB+this.inputC+this.inputD+this.inputE+this.inputF;
						$rootScope.gridPassword.sure(password);
					}
				}

			}],
			templateUrl: 'tpls/popup/popup_paypass.html',
		};
	});
    app.directive('changeFocus', function(){
		return {
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			link: function($scope, iElm, iAttrs, controller) {
				var active = 0;

				var inputs = iElm.find('input');
				angular.forEach(inputs, function(value, key){
					angular.element(value).on("click", function(){
						inputs[active].focus();
					});

					angular.element(value).on("focus", function(){
						angular.element(value).on('keyup', listenKeyUp);
					});

					angular.element(value).on("blur", function(){
						angular.element(value).off('keyup', listenKeyUp);
					});
				})


				/**
			     * 监听键盘的敲击事件
			     */
			    function listenKeyUp() {
			        if(isNaN(this.value)){
			        	this.value = '';
			        	if (active < 5) {
			                active += 1;
			            }
			        }
			        if (!isNaN(this.value) && this.value.length != 0) {
			            if (active < 5) {
			                active += 1;
			            }
			            inputs[active].focus();
			        } else if (this.value.length == 0) {
			            if (active > 0) {
			                active -= 1;
			            }
			            inputs[active].focus();
			        }
			    }
			}
		}
	});
    //angular-swiper 滑动分页版
    app.directive('swiperContainer', function() { 
	    
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                onReady: '&',
                slidesPerView: '=',
                slidesPerColumn: '=',
                spaceBetween: '=',
                parallax: '=',
                parallaxTransition: '@',
                paginationIsActive: '=',
                paginationClickable: '=',
                showNavButtons: '=',
                showScrollBar: '=',
                loop: '=',
                autoplay: '=',
                initialSlide: '=',
                containerCls: '@',
                wrapperCls: '@',
                paginationCls: '@',
                slideCls: '@',
                direction: '@',
                swiper: '=',
                overrideParameters: '=',
                freeMode:'=',
                resistanceRatio:'=',
            },
            controller: ['$scope','$element','$timeout', function($scope, $element, $timeout) {
                // var uuid = createUUID();

                // $scope.swiper_uuid = uuid;

                // directive defaults
                var params = {
                    slidesPerView: $scope.slidesPerView || 1,
                    slidesPerColumn: $scope.slidesPerColumn || 1,
                    spaceBetween: $scope.spaceBetween || 0,
                    direction: $scope.direction || 'horizontal',
                    loop: $scope.loop || false,
                    initialSlide: $scope.initialSlide || 0,
                    showNavButtons: false,
                    freeMode: $scope.freeMode || false,
                    resistanceRatio:$scope.resistanceRatio || 0,
                };

                if (!angular.isUndefined($scope.autoplay) && typeof $scope.autoplay === 'number') {
                    params = angular.extend({}, params, {
                        autoplay: $scope.autoplay
                    });
                }

                if ($scope.paginationIsActive === true) {
                    params = angular.extend({}, params, {
                        paginationClickable: $scope.paginationClickable || true,
                        pagination: '#paginator-'// + $scope.swiper_uuid
                    });
                }

                if ($scope.showNavButtons === true) {
                    params.nextButton = '#nextButton-';// + $scope.swiper_uuid;
                    params.prevButton = '#prevButton-';// + $scope.swiper_uuid;
                }

                if ($scope.showScrollBar === true) {
                    params.scrollbar = '#scrollBar-';// + $scope.swiper_uuid;
                }

                if ($scope.overrideParameters) {
                    params = angular.extend({}, params, $scope.overrideParameters);
                }

                $timeout(function() {
                    var swiper = null;

                    if (angular.isObject($scope.swiper)) {
                        $scope.swiper = new Swiper($element[0].firstChild, params);
                        swiper = $scope.swiper;
                    } else {
                        swiper = new Swiper($element[0].firstChild, params);
                    }

                    //If specified, calls this function when the swiper object is available
                    if (!angular.isUndefined($scope.onReady)) {
                        $scope.onReady({
                            swiper: swiper
                        });
                    }
                });
            }],

            link: function(scope, element) {

                //var uuid = scope.swiper_uuid;

                var paginatorId = "paginator-";// + uuid;
                var prevButtonId = "prevButton-";// + uuid;
                var nextButtonId = "nextButton-";// + uuid;
                var scrollBarId = 'scrollBar-'; //+ uuid;

                var containerElement = element[0];

                angular.element(containerElement.querySelector('.swiper-pagination'))
                    .attr('id', paginatorId);

                angular.element(containerElement.querySelector('.swiper-button-next'))
                    .attr('id', nextButtonId);

                angular.element(containerElement.querySelector('.swiper-button-prev'))
                    .attr('id', prevButtonId);

                angular.element(element[0].querySelector('.swiper-scrollbar'))
                    .attr('id', scrollBarId);
            },

            template: '<div class="swiper-container {{containerCls}}">' +
                '<div class="parallax-bg" data-swiper-parallax="{{parallaxTransition}}" ng-show="parallax"></div>' +
                '<div class="swiper-wrapper {{wrapperCls}}" ng-transclude></div>' +
                // '<div class="swiper-pagination {{paginationCls}}"></div>' +
                // '<div class="swiper-button-next" ng-show="showNavButtons"></div>' +
                // '<div class="swiper-button-prev" ng-show="showNavButtons"></div>' +
                // '<div class="swiper-scrollbar" ng-show="showScrollBar"></div>' +
                '</div>'
        };
    });
    //angular-swiper 滑动分页版
    app.directive('swiperSlide', function() { 
	    return {
            restrict: 'E',
            require: '^swiperContainer',
            transclude: true,
            scope: {
              sliderCls: '@',
            },
            template: '<div class="swiper-slide {{sliderCls}}" ng-transclude></div>',
            replace: true
        };
    });
	//获取星级评论
	app.directive('divStar',function(){
		return{
			restrict: 'E',
		    scope:{
		      starParam: '='
		    },
		    templateUrl: 'tpls/public/star.html',
		}
	});
	//滑动切换页面
	app.directive('pageSlide', [function () {
		return {
			restrict: 'A',
			controller: ['$scope', '$element', '$rootScope','$timeout','$state','$window',function ($scope, $element, $rootScope,$timeout,$state,$window) {
			    var startX,startY,endX,endY;
			    var startT = 0; //记录手指按下去的时间
			    var pageWidth = window.innerWidth; //页面宽度
                var moveLength = 0;  // 手指当前滑动的距离
			    var viewport = $element[0];
			    var direction = null;//手指滑动方向
			    var member = null;//页面标注
			    var pre = null;//滑动所执行的方法
			    var isTwoPage = false;//判断当前页是否有两页
			    var isMove = false;//判断是否滑动
			    var isTwinkle = false,isTwinkle2 = false;//识别find_index、my-coach-index页做特殊处理(滑动返回后页面闪一下isTwinkle isTwinkle2区别在于对待不同的页面),识别isTrends页做特殊处理(滑动返回时错位闪屏)
			    var winWidth = 0;//识别ios右边距
			    var pageIsLoaded = false;
			    var ua = navigator.userAgent.toLowerCase();
			    if (/iphone|ipad|ipod/.test(ua)) {//初始化动画class
			      $scope.pageClass1 = "z_ios pre next1";
			    }else{
			      $scope.pageClass1 = "z_ios pre_android next1_android";
			    }
			    $timeout(function(){//等待页面渲染完成后才可以进行跳转页面(滑动跳转除外)
			       pageIsLoaded = true;
	               console.log("页面渲染完成！！！！！！~");
	            });
			    if (!$rootScope.keyframes) {
			    	var rule = ["@keyframes slideInRight {from{ transform:translate3d("+pageWidth+"px,0,0);}to{ transform: translate3d(0,0,0); }}","@keyframes slideInLeft {from{ transform:translate3d("+(-pageWidth)+"px,0,0); }to{ transform: translate3d(0,0,0); }}"];
                    for (var i = 0; i < 2; i++) {
                      var style = document.createElement('style');
					  style.type = 'text/css';
					  style.innerHTML = '';
					  document.getElementsByTagName('head')[0].appendChild(style);
					  var stylesheet = document.styleSheets[document.styleSheets.length-1];
					  stylesheet.insertRule(rule[i],0);//写入样式
	                }
	                $rootScope.keyframes = true;	
			    }
			    //进入页面时,建立touch监听,并延时,防止页面为加载完成便滑动卡在边缘
			    this.addListener = function(scope){
			    	if (scope.member) {//如果元素内没有member属性,则不进行滑动监听
					    viewport.addEventListener('touchstart',touchstartHandler);
						viewport.addEventListener('touchmove',touchmoveHandler);
						viewport.addEventListener('touchend',touchendHandler);
			    	}
			    }
			    
			    
			    function touchstartHandler (e){
			      if (!isMove) {
                    // console.log("touch开始");
			        var touch = e.touches[0];
			        startX = touch.pageX;
			        startY = touch.pageY;
			        moveLength = 0;
			        viewport.style.webkitTransition = ""; //取消动画效果
			        if (document.activeElement.tagName != "BODY" && e.target != document.activeElement) {//当聚焦的元素不为body时使钙元素失去焦点,特殊情况除外 如赛事详情
			          document.activeElement.blur();
			          return;
			        }
			        startT = new Date().getTime(); //记录手指按下的开始时间
			      }else{
                    touchendHandler(e);
			      }
			    }
			    $rootScope.findIndexHeaderTop = true;   
	 	    	$rootScope.findIndexHeaderButtom = false;
			    function touchmoveHandler(e){
			      if (startT) {
                    // console.log("touch移动");
                    var touch = e.touches[0];
                    var deltaX = endX = touch.pageX - startX;
                    var deltaY = endY = touch.pageY - startY;
                    moveLength = deltaX;
                    var translate = deltaX;
                    if(deltaY>40){
	 	    			$scope.findIndexHeaderTop = false;   
	 	    			$scope.findIndexHeaderButtom = true;
	 	    			$scope.$apply();
	 	    		}
	 	    		if(deltaY<0){
	 	    			$scope.findIndexHeaderTop = true;   
	 	    			$scope.findIndexHeaderButtom = false;
	 	    			$scope.$apply();
	 	    		}
	 	    		// console.log($rootScope.findIndexHeaderTop+"----"+$rootScope.findIndexHeaderButtom);
                    if(Math.abs(deltaY) < Math.abs(deltaX)){//判断当水平反向滑动距离大于垂直滑动时页面跟随手指移动
                      direction = deltaX>0?"right":"left";
                      $rootScope.direc = direction;
                      if (deltaX > 0 && isTwoPage) {
                        transform.call(viewport,translate);
                        isMove = true;
                      }
                    }
                    if (window.innerWidth)//获取浏览器视图窗口宽度
                      winWidth = window.innerWidth;
                    else if ((document.body) && (document.body.clientWidth))
                      winWidth = document.body.clientWidth;
                      // console.log("浏览器视图窗口宽度为："+winWidth,touch.clientX);
                    if (/iphone|ipad|ipod/.test(ua) && touch.clientX > winWidth - 4) {
                      // console.log("触碰到地址栏了");
                      touchendHandler(e);
                    }
			      }
			    }
			    function touchendHandler(e){
			    	// console.log("touch结束");
			    	var translate = 0;
			    	var isAndroid = /android/.test(ua);
			    	//计算手指在屏幕上停留的时间
                    var deltaT = new Date().getTime() - startT;
                    startT = 0; //清除手指刚开始按下去的时间
			    	if (isMove) {//判断是否滑动,是的话如果滑动时间小于0.3s则换页,否则就去判断滑动距离是否大于页面的50%,是的话换页,否则会到当前页面
	    	          viewport.style.webkitTransition = "-webkit-transform 0.2s ease-in";//慢速滑动
			    	  if(deltaT < 300 && endY < endX){ //如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
	    	            viewport.style.webkitTransition = "-webkit-transform 0.2s linear";//快速滑动
                        slideToPrePage();
		    		  }else if (Math.abs(moveLength)/pageWidth < 0.5){//如果滑动距离小于页面的50%,则返回到当前页面,否则跳入上一页面
		                translate = 0;
		              }else{
	                    slideToPrePage();
		              }
		              if (isTwinkle2) {
		              	viewport.style.webkitTransition = "-webkit-transform 0.2s ease-in,opacity 0.5s linear 0.2s";
		              }
		              $timeout(function(){//使动画充分应用
		                transform.call(viewport,translate);
		              });
		              isMove = false;
					}
					function slideToPrePage(){
					  if (direction == "right" && isTwoPage) {
	                    viewport.removeEventListener('touchstart',touchstartHandler);
				          viewport.removeEventListener('touchmove',touchmoveHandler);
				          viewport.removeEventListener('touchend',touchendHandler);
	                      console.log("我是"+member);
			              translate = pageWidth;
	                      $rootScope.checkPageCss = 1;
	                      $timeout(function(){
	                      	console.log(typeof pre);
	                      	if (typeof pre === "string") {
                               $state.go(pre);
	                      	}else{
	                      	  pre();
	                      	}
			              },200);
		              }
	                  if (isAndroid || !isTwinkle) {
                        viewport.style.zIndex = 123;//与新加载页面进行无缝衔接
		                $timeout(function(){
	                      viewport.style.webkitTransition='';
	                      viewport.style.transform = 'translate(0px, 0px)';
	                      viewport.children[0].style.right = '0';
	                      viewport.children[1].style.display = 'none';
	                      if (viewport.children[2]) {
                            viewport.children[2].style.display = 'none';
	                      }
		                },200);
	                  }
					}
			    }
			    function onBack(){
			      /*控制安卓返回按钮*/
				  var lastValue ,stateGoRoute , stateGoParams, androidOnBack = new Array(),paramOnBack = new Array();
				  /*获取存在session中的路由*/
			      //判断是否有值
			      if(window.sessionStorage.getItem('formArray')){
			        //将字符串转换成数组
		            androidOnBack = eval("("+window.sessionStorage.getItem('formArray')+")");
	                paramOnBack = eval("("+window.sessionStorage.getItem("paramArray")+")");
		            if(androidOnBack&&androidOnBack.length != 0){
		            	//每次点击只取数组最后一个值，赋给$state.go
		                lastValue = androidOnBack[androidOnBack.length-1];
		                stateGoRoute = lastValue.split("#")[0];//路由
		                stateGoParams = lastValue.split("#")[1].replace(/[&]/g,",");//参数
		                var stateGoParams1 = paramOnBack[paramOnBack.length-1];
		                $state.go(stateGoRoute,stateGoParams1);
		            }
	              }
			    }
			    function transform(translate){
		    	  this.style.webkitTransform = "translate("+translate+"px,0)";
		        }
		        this.addNext = function(scope,element,div){
		          if (scope.preUiSref) {//获取当前页面的返回上级页面的方法
		          	if (scope.preUiSref == "onBack") {
		          	  pre = onBack;
		          	  var androidOnBack = eval("("+window.sessionStorage.getItem('formArray')+")");
		          	  var stateGoRoute =  androidOnBack[androidOnBack.length-1].split("#")[0];
		          	  if (stateGoRoute == "find_index" || stateGoRoute == "trends" || stateGoRoute == "my_coach_index" || stateGoRoute == "myteams-details" || stateGoRoute == "add_teams" || stateGoRoute == "edit_teams") {
		          	  	isTwinkle = true;//处理find_index、trends、my_coach_index特殊情况
		          	  	if (stateGoRoute == "myteams-details" || stateGoRoute == "add_teams" || stateGoRoute == "edit_teams") {
		          	  		isTwinkle2 = true;
		          	  	}
		          	  }
		          	}else{
		          	  if (scope.preUiSref == "find_index" || scope.preUiSref == "trends" || scope.preUiSref == "my_coach_index" || scope.preUiSref == "myteams-details" || scope.preUiSref == "add_teams" || scope.preUiSref == "edit_teams") {
		          	  	isTwinkle = true;//处理find_index、trends、my_coach_index特殊情况
		          	  	if (scope.preUiSref == "myteams-details" || scope.preUiSref == "add_teams" || scope.preUiSref == "edit_teams") {
		          	  		isTwinkle2 = true;
		          	  	}
		          	  }
		          	  pre = scope.preUiSref;
		          	}
		          }else{
		          	pre = scope.pre;
		          }
		          if ($rootScope.view && $rootScope.view.length == 1) {//处理返回方法为pre的特殊情况
		          	if ($rootScope.view[0].id == "trends" || $rootScope.view[0].id == "find_index" || $rootScope.view[0].id == "my_coach_index" || $rootScope.view[0].id == "myteams-details" || $rootScope.view[0].id == "add_teams" || $rootScope.view[0].id == "edit_teams") {
		              isTwinkle = true;
		              if ($rootScope.view[0].id == "myteams-details" || $rootScope.view[0].id == "add_teams" || $rootScope.view[0].id == "edit_teams") {
		          	  	isTwinkle2 = true;
		          	  }
		          	}
		          }
                  member = scope.member;//获取页面标注,当其等于‘0’时就将此页面设置为滑动起始页面
                  var j = -1; //初始化j,用来获取前一个页面的缓存
                  var isExist = false;//判断当前页面在缓存页面中是否已经存在
                  var index = -1;//初始化当前页面在缓存页面中的索引
                  if (member == 0) {
                  	$rootScope.view = new Array();
					viewport.style.cssText = "overflow:hidden!important;";//若当前页为四大功能页，设置此属性防止上下拖动
                  }else  if (member == -1) {//嵌套路由页面之间互相跳转数组只记最后一个
                  	var uiRoutePage = ["activity_play","corps","arrangeBall","onlineorder","coach","ladderPplayer"];
                  	if (uiRoutePage.indexOf(element[0].id) != -1 && $rootScope.view[$rootScope.view.length - 1] && uiRoutePage.indexOf($rootScope.view[$rootScope.view.length - 1].id) != -1) {
                  		$rootScope.view[$rootScope.view.length - 1] = {'id':element[0].id,'element':div};
                  	}
                  }
                  if ($rootScope.view && $rootScope.view.length > 0) {//判断缓存页面是否存在,如果存在则判断当前页面是否已经录入缓存页面,录入的话则获得其索引算出在此页面的上级页面索引并将缓存页面中此页面之后的页面济宁删除
                  	j = $rootScope.view.length - 1;
                  	angular.forEach($rootScope.view,function(data,i){
                      if (data.id == element[0].id) {
                        isExist = true;
                        index = i;
                        for(var k = 0;k < $rootScope.view.length;k++){
						  if (k > index) {
							$rootScope.view.splice(k,1);
							k--;
						  }
						}
					    j = index - 1;
                      }
					});
					if (!isExist) {
					  if (!div) {
					    $rootScope.view.push({'id':element[0].id,'element':element[0]});
					  }else{
					    $rootScope.view.push({'id':element[0].id,'element':div});
					  }
					}
					if ($rootScope.view.length != 1) {//将当前页面的上级页面追加在当前页面的左侧
					  if (element[0].id == "paydetail-success" || element[0].id == "paydetail-coachvenue-success") {//支付成功后左侧页面为find_index
						  angular.element(viewport).prepend($rootScope.view[0].element);
						}else{
					      angular.element(viewport).prepend($rootScope.view[j].element);
						}
					  if (!/iphone|ipad|ipod/.test(ua)) {
					  	viewport.style.cssText = "position:fixed;";
					  }
					  viewport.children[0].style.cssText = "float:left;right:100%;position:absolute;height:100%;width:100%";
					  if (scope.member != -1) {
					    viewport.children[1].style.cssText = "float:left;height:100%;width:100%;overflow:hidden;";
					  }
					  isTwoPage = true;
					}
                  }else{
                    if (!div) {
					  $rootScope.view.push({'id':element[0].id,'element':element[0]});
					}else{
					  $rootScope.view.push({'id':element[0].id,'element':div});
					}
                  }
		        }
		        this.addStateListener = function(scope){
		          var head,div;
                  var listener = $rootScope.$on('$stateChangeStart', 
				  function(event, toState, toParams, fromState, fromParams){
				    var haveCss = false; 
                  	var uiRoutePage = ["赛事","战队","球馆","约球","教练","陪练","裁判"];
				    if (scope.member == 0 && (toState.name == "find_index" || toState.name == "messages_friend" || toState.name == "trends" || toState.name == "my_index" || toState.name == "my_coach_index" || toState.name == "login" || toState.name == "login_register" || toState.name == "welcome" || toState.name == "reset_password") || (uiRoutePage.indexOf(toParams.menuName) != -1 && uiRoutePage.indexOf(fromParams.menuName) != -1)) {
				      $rootScope.checkPageCss = 3;//如果遇到上述情况跳转页面不需要样式
				      if (uiRoutePage.indexOf(toParams.menuName) != -1 && uiRoutePage.indexOf(fromParams.menuName) != -1) {
				      	$rootScope.state[1] = toState.name;
				      }
				    }
				    console.log("$rootScope.checkPageCss $rootScope.state ````````"+$rootScope.checkPageCss,$rootScope.state);
				    if (pageIsLoaded) {//页面若没有渲染完成，则禁止跳转
						if ($rootScope.checkPageCss == 0 || $rootScope.checkPageCss == 2) {
						  event.preventDefault();//阻止模板解析
						  if (/android/.test(ua) && cordova.plugins.Keyboard.isVisible) {//解决跳转页面时有输入框的问题
                            $timeout(function(){
                              goPageForwardOrBack();
                            },1000);
						  }else{
						  	goPageForwardOrBack();
						  }
						  function goPageForwardOrBack(){
	    					  if (scope.member == 0) {//如果为起始页,则将数组清空
	    					  	$rootScope.state = new Array();
	    					  }
	                          // listenWatch();//添加动画
	    	         	      if ($rootScope.state && $rootScope.state.length > 0) {//如果数组不为空,则进行下列处理
	                            var index = $rootScope.state.indexOf(toState.name);
	                            var index1 = $rootScope.state.indexOf(fromState.name);
	                            if (index > -1) {//如果所跳转页面有记录,则进行下列操作
	                              if (index1 > index) {//如果跳转后页面index小于跳转前页面,则视为返回
	    		                    back();
	    		                  }
	                              for (var k = 0; k < $rootScope.state.length; k++) {
	                                if (k > index) {
	                            	  $rootScope.state.splice(k,1);
	                            	  k--;
	                                }
	                              }
	                            }else{//如果所跳转页面没有记录,则进行下列操作
	                        	  if (toState.name == "find_index" || toState.name == "messages_friend" || toState.name == "trends" || toState.name == "my_index" || toState.name == "welcome" || toState.name == "login_register" ||　toState.name == "my_coach_index") {//如果跳转后页面为四大功能,则视为返回
	    	                        back();
	    	                      }else{
	    	                        if (index1 > -1) {//否则视为前进
	    	                      	  for (var k = 0; k < $rootScope.state.length; k++) {
	                            	    if (k > index1) {
	                        			  $rootScope.state.splice(k,1);
	                        			  k--;
	                        		    }
	                            	  }
	    	                        }
	    	                        $rootScope.state.push(toState.name);
	    	                      }
	                            }
	    	         	      }else{//如果数组为空,则添加数据
	    	         	        $rootScope.state = new Array();
	    	         	        $rootScope.state.push(toState.name);
	    	         	      }
	    	         	      if (!haveCss) {//判断是否为返回页面,如果返回则参数为true
	                            $rootScope.checkPageCss = 0;//判断是否应该将pageclass的值置空(如果返回上级页面则置空,如果进入下级页面则不置空)
	                            var contentOfHead = JSON.parse($window.localStorage.getItem('contentOfHead')),leftButton = "",content = "",rightButton = "",rightButton1 = "",isTwoButton;
	    	        		    for (var i = 0; i < contentOfHead.length; i++) {
	                                if (toState.name == contentOfHead[i].state) {
	                                  if (contentOfHead[i].rightbutton.length != 0) {
	    	  	                        for (var j = 0; j < contentOfHead[i].rightbutton.length; j++) {
	    	  	                          if (j == 0) {
	    	  	                        	 rightButton = contentOfHead[i].rightbutton[0];
	    	  	                          }else{
	    	  	                        	 rightButton1 = contentOfHead[i].rightbutton[1];
	    	  	                         }
	    	  	                        }
	                                  }
	                                  content = contentOfHead[i].content;
	                                  leftButton = contentOfHead[i].leftbutton?'<i class="icon-left-nav"></i>':"";
	                                }
	                              }
	      	        		    if (uiRoutePage.indexOf(toParams.menuName) != -1 || toState.name == "teams-leaderboard" || toState.name == "find-getgreatdelivery" || toState.name == "venueSearch" || toState.name == "selectImage" || toState.name == "QRcode") {
	      	        		    	var instruction = "",Fontstyle,searchButton = toParams.menuName == "约球"?'</span><span >发起约球</span>':'<span class="icona-search"></span>';
	      	        		    	switch(toState.name){
	      	        		    	  case"teams-leaderboard":instruction = "排行榜"; break;
	      	        		    	  case"find-getgreatdelivery":instruction = "优惠大派送";Fontstyle="style='font-size:2.6vh !important;'"; break;
	      	        		    	  case"QRcode":instruction = "二维码"; break;
	      	        		    	}
	      	        		    	div = document.createElement('div');
	      	        		    	div.className='hahaha '+$scope.pageClass1;
	      	        		    	div.style.cssText = "left:100%;position:absolute;width: 100%;height:100%;z-index:100;";
	                                div.innerHTML='<div ui-view="content" class="sixFunction-content ng-scope"><div class="base-main base-bg ng-scope ng-isolate-scope" page-slide-remove-data="" member="-1" pre="goBackFromSix()" id="corps"><div class="base-wrapper merchant_index value-wrapper-continter base-continter-ontnav corps-wapper"><pub-tabs div-class="corps-pubdiv" ul-class="corps-pubul" li-class="corps-publi" save-swiper="saveSwiper" activei="activei" method="getCorpList" class="ng-isolate-scope"><div class="tabbable corps-pubdiv" ng-class="divClass"></div></pub-tabs></div></div></div>';
	                                head=document.createElement('header');
	      				            head.className='base-nav-content nav-find-position';
	      				            head.style.cssText = "background: #1f1f1f;";
	      					        head.innerHTML= toState.name == "teams-leaderboard" || toState.name == "find-getgreatdelivery" || toState.name == "venueSearch" || toState.name == "selectImage" || toState.name == "QRcode"?'<div class="nav-ctop"></div><div class="base-nav-bar base-sixfunction-nav"><div class="base-navleft "><i class="icon-left-nav"></i></div><label class="base-nav-center sixFunction-nav-center sixFunction-base-click sixFunction-nav-click"><span class="ng-binding"'+Fontstyle+'>'+instruction+'</span></label></div>'
	      					        :'<div class="nav-ctop"></div><div class="base-nav-bar base-sixfunction-nav"><div class="base-navleft "><i class="icon-left-nav"></i></div><label class="base-nav-center sixFunction-nav-center sixFunction-base-click sixFunction-nav-click"><span class="ng-binding">'+toParams.menuName+'</span><i class="icon-arrow"></i></label><div class="base-nav-right ">'+searchButton+'</div></div>';
	      					        angular.element(div).prepend(head);
	      					        angular.element(document.body).prepend(div);
	      	        		    }else{
	      	        		    	isTwoButton = rightButton1 == ""?'<div class="base-nav-bar">':'<div class="base-nav-bar base-nav-right-twoicon">';
	          	        		    head=document.createElement('header');
	          				        head.className= toState.name == "teams-leaderboard" || toState.name == "myteams-details" || toState.name == "corps-details" || toState.name == "add_teams" || toState.name == "edit_teams"?'base-nav-content teams-header '+$scope.pageClass1:'base-nav-content '+$scope.pageClass1;
	          				        head.style.cssText = "left:100%;position:absolute";
	          					    head.innerHTML='<div class="nav-ctop"></div>'+isTwoButton+
	          					                   '<div class="base-navleft ">'+leftButton+'</div>'+
	          					                   '<label class="base-nav-center">'+content+'</label>'+
	          					                   '<div class="base-nav-right">'+rightButton+rightButton1+'</div></div>';
	          					    angular.element(document.body).prepend(head);
	      	        		    }
	    	        		    if (/iphone|ipad|ipod/.test(ua)) {
	    	        		      angular.element(viewport).removeClass("z_ios next1");
	    	        		      viewport.style.webkitAnimationPlayState = "running";
	    	        		      var doc = div == null?head:div;
	    	        		      angular.element(doc).removeClass("z_ios next1");
	    	        		      doc.style.webkitAnimationPlayState = "running";
	                 	          goPage(toState.name,toParams);
	    		         	    } else if (/android/.test(ua)) {
	    		         	      angular.element(viewport).removeClass("z_ios next1_android");
	    		         	      viewport.style.webkitAnimationPlayState = "running";
	    		         	      var doc = div == null?head:div;
	    		         	      angular.element(doc).removeClass("z_ios next1_android");
	    		         	      doc.style.webkitAnimationPlayState = "running";
	                 	          goPage(toState.name,toParams);
	    		         	    }
	    	         	      }
						  }
		         	      function back(){
		         	      	$rootScope.checkPageCss = 2;//判断是否应该将pageclass的值置空(如果返回上级页面则置空,如果进入下级页面则不置空)
		         	      	if (fromState.name == "selectImage" && toState.name == "trends" || toState.name == "welcome" || fromState.name == 'edit_teams' && toState.name == 'myteams-details' || fromState.name == 'management_teams' && toState.name == 'my_group' || fromState.name == 'coachInviteSet' && toState.name == 'my_coach_index') {//跨页跳转时用angular动画
					          angular.element(viewport.children[0]).remove();
	                          $scope.pageClass1 = "next3_android";
	                          goPage(toState.name,toParams,fromState.name);
					        }else{
	  				          if (/iphone|ipad|ipod/.test(ua)) {
	  				            angular.element(viewport).removeClass("z_ios pre");
	  				            viewport.style.webkitAnimationPlayState = "running";
	                            goPage(toState.name,toParams);
	  				          } else if (/android/.test(ua)) {
	  					        if(toState.name == "inviteOrder" || toState.name == "my_active" || toState.name == "my_order"){//"我的"页签特殊处理(页面内容与头部标题分离)
	  	                          viewport.style.cssText = "z-index:123;";
	  					        }
	  					        angular.element(viewport).removeClass("z_ios pre_android");
	  		        	  	    viewport.style.cssText = "-webkit-animation-play-state:running;z-index:123;";
	  			           	    goPage(toState.name,toParams);
	  				          }
					        }
					        haveCss = true;
		         	      }
		         	      function goPage(toStateName,toParams,fromStateName){//解除阻止模板解析，跳入下级页面
		         	      	var time = /iphone|ipad|ipod/.test(ua)?200:250;
		         	      	if (fromState.name == "selectImage" && toState.name == "trends" || toState.name == "welcome" || fromState.name == 'edit_teams' && toState.name == 'myteams-details' || fromState.name == 'management_teams' && toState.name == 'my_group' || fromState.name == 'coachInviteSet' && toState.name == 'my_coach_index') {
  		         	      	  goPageFunction();
		         	      	}else{
		         	      	  $timeout(function(){
		         	      	  	goPageFunction();
		         	      	  },time);
		         	      	}
		         	        function goPageFunction(){
		         	          listener();//取消路由跳转监听
  						      listener = null;
  				         	  $state.go(toStateName,toParams);
		         	        }
		         	      }
						}else{
							listener();//取消路由跳转监听
							listener = null;
						}
				    }else{
				    	event.preventDefault();
				    }
				    viewport.removeEventListener('touchstart',touchstartHandler);//取消touch时间监听
				    viewport.removeEventListener('touchmove',touchmoveHandler);
				    viewport.removeEventListener('touchend',touchendHandler);
				  });
		        }
		        /*
		        处于滑动状态时当前页面需要改动的样式
		        1.去掉overflow:hidden;
		        2.float:left;
		        3.float:left;position:absolute;left:100%
		        */
			}]
		};
	}]);
    //去掉未加载的数据并复制页面
	app.directive('pageSlideRemoveData', [function () {
		return {
			require: '^pageSlide',
			restrict: 'A',
			scope:{
				pre:'&',
				preUiSref:'@',
				member:'@',
			},
			link: function (scope, element, attrs,pageCtrl) {
				var ua = navigator.userAgent.toLowerCase();
				var head = document.querySelector("body > header");
				var div = document.querySelector(".hahaha");
				var reDoc = div == null?head:div;
				angular.element(reDoc).remove();
				var viewport = document.querySelectorAll(".page")[0];
				var viewport1 = document.querySelectorAll(".page")[1];
				if(/iphone|ipad|ipod/.test(ua) && viewport1 && (element[0].id == "find_index" || element[0].id == "my_coach_index" || element[0].id == "myteams-details" || element[0].id == "add_teams" || element[0].id == "edit_teams") && (scope.$root.checkPageCss == 1 || scope.$root.checkPageCss == 2)){//ios find_index、my-coach-inde、myteams-details特殊处理
                  if (element[0].id == "myteams-details" || element[0].id == "add_teams" || element[0].id == "edit_teams") {//解决isTwinkle2的bug
                    setTimeout(function(){
                      viewport.style.zIndex = "123";
                    });
                  }else{
                  	angular.element(viewport1).after(viewport);
                  	viewport1.style.position = "fixed";
                  } 
                }
				setTimeout(function(){//复制当前页面
                  var div = null;
                  if (scope.member == -1) {
                  	var title = angular.element(document.querySelector(".sixFunction-title")).clone();
                  	var content = angular.element(document.querySelector(".sixFunction-content")).clone();
                    var ul = content[0].querySelector("#ul");
                    if (/iphone|ipad|ipod/.test(ua)) {
				      angular.element(ul).empty();//找到当前页面
				    }
                  	div=document.createElement("div");
                  	angular.element(div).prepend(content);
                  	angular.element(div).prepend(title);
                  }
                  var elem = angular.element(element).clone();
                  var ul = elem[0].querySelector("#ul");
                  if (/iphone|ipad|ipod/.test(ua)) {
				    angular.element(ul).empty();//找到当前页面
				  }
				  pageCtrl.addNext(scope,elem,div);
                });
				scope.$root.checkPageCss = 0;
				pageCtrl.addListener(scope);
				pageCtrl.addStateListener(scope);
			}
		};
	}]);
    //缩放图片
	app.directive('ngPinchZoom', [function () {
		return {
			restrict: 'A',
			scope:{
				swipes:'@',
			},
			link: function (scope, element, attrs) {
			    var elWidth, elHeight;

			    // mode : 'pinch' or 'swipe'
			    var mode = '';

			    // distance between two touche points (mode : 'pinch')
			    var distance = 0;
			    var initialDistance = 0;

			    // image scaling
			    var scale = 1;
			    var relativeScale = 1;
			    var initialScale = 1;
			    var maxScale = parseInt(attrs.maxScale, 10);
			    if (isNaN(maxScale) || maxScale <= 1) {
			      maxScale = 3;
			    }

			    // position of the upper left corner of the element
			    var positionX = 0;
			    var positionY = 0;

			    var initialPositionX = 0;
			    var initialPositionY = 0;

			    // central origin (mode : 'pinch')
			    var originX = 0;
			    var originY = 0;

			    // start coordinate and amount of movement (mode : 'swipe')
			    var startX = 0;
			    var startY = 0;
			    var moveX = 0;
			    var moveY = 0;
                
                var pageWidth = window.innerWidth/2; //页面宽度
                var moveLength = 0;
                scope.$watch('swipes',function(){//swipes,如果发生改变则将图片大小置为1
                  var goBack = function(){
                	scale = 1;
			        positionX = 0;
			        positionY = 0;
			        transformElement();
                  }
                  goBack();
		        });
                
			    var image = new Image();
			    image.onload = function() {
			      elWidth = element[0].clientWidth;
			      elHeight = element[0].clientHeight;

			      element.css({
			        '-webkit-transform-origin' : '0 0',
			        'transform-origin'         : '0 0'
			      });

			      element.on('touchstart', touchstartHandler);
			      element.on('touchmove', touchmoveHandler);
			      element.on('touchend', touchendHandler);
			    };

			    if (attrs.ngSrc) {
			      image.src = attrs.ngSrc;
			    } else {
			      image.src = attrs.src;
			    }

			    /**
			     * @param {object} evt
			     */
			    function touchstartHandler(evt) {
			      var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

			      startX = touches[0].clientX;
			      startY = touches[0].clientY;
			      initialPositionX = positionX;
			      initialPositionY = positionY;
			      moveX = 0;
			      moveY = 0;
			    }

			    /**
			     * @param {object} evt
			     */
			    function touchmoveHandler(evt) {
			      var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;

			      if (mode === '') {
			        if (touches.length === 1 && scale > 1) {

			          mode = 'swipe';

			        } else if (touches.length === 2) {

			          mode = 'pinch';

			          initialScale = scale;
			          initialDistance = getDistance(touches);
			          originX = touches[0].clientX -
			                    parseInt((touches[0].clientX - touches[1].clientX) / 2, 10) -
			                    element[0].offsetLeft - initialPositionX;
			          originY = touches[0].clientY -
			                    parseInt((touches[0].clientY - touches[1].clientY) / 2, 10) -
			                    element[0].offsetTop - initialPositionY;

			        }
			      }

			      if (mode === 'swipe') {
			        evt.preventDefault();

			        moveX = touches[0].clientX - startX;
			        moveY = touches[0].clientY - startY;
                    
			        positionX = initialPositionX + moveX;
			        positionY = initialPositionY + moveY;

			        transformElement();
                    
                    moveLength = touches[0].clientX - startX;//得到滑动的距离
			      } else if (mode === 'pinch') {
			        evt.preventDefault();

			        distance = getDistance(touches);
			        relativeScale = distance / initialDistance;
			        scale = relativeScale * initialScale;

			        positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
			        positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

			        transformElement();

			      }
			      // if (touches.length === 1) {
			      // 	moveLength = touches[0].clientX - startX;
			      // 	console.log("moveLength:"+moveLength,pageWidth);
			      // }
			    }
			    /**
			     * @param {object} evt
			     */
			    function touchendHandler(evt) {
			      var touches = evt.originalEvent ? evt.originalEvent.touches : evt.touches;
                  
			      if (mode === '' || touches.length > 0) {
				      return;
			      }else if (mode === 'swipe' && Math.abs(moveLength) > pageWidth){
                    scale = 0.9;
			      }//如果是滑动且滑动距离大于页面宽度的二分之一，则复原

			      if (scale < 1) {

			        scale = 1;
			        positionX = 0;
			        positionY = 0;

			      } else if (scale > maxScale) {

			        scale = maxScale;
			        relativeScale = scale / initialScale;
			        positionX = originX * (1 - relativeScale) + initialPositionX + moveX;
			        positionY = originY * (1 - relativeScale) + initialPositionY + moveY;

			      } else {

			        if (positionX > 0) {
			          positionX = 0;
			        } else if (positionX < elWidth * (1 - scale)) {
			          positionX = elWidth * (1 - scale);
			        }
			        if (positionY > 0) {
			          positionY = 0;
			        } else if (positionY < elHeight * (1 - scale)) {
			          positionY = elHeight * (1 - scale);
			        }

			      }

			      transformElement(0.1);
			      mode = '';
			    }

			    /**
			     * @param {Array} touches
			     * @return {number}
			     */
			    function getDistance(touches) {
			      var d = Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
			                        Math.pow(touches[0].clientY - touches[1].clientY, 2));
			      return parseInt(d, 10);
			    }

			    /**
			     * @param {number} [duration]
			     */
			    function transformElement(duration) {
			      var transition  = duration ? 'all cubic-bezier(0,0,.5,1) ' + duration + 's' : '';
			      var matrixArray = [scale, 0, 0, scale, positionX, positionY];
			      var matrix      = 'matrix(' + matrixArray.join(',') + ')';
			      element.css({
			        '-webkit-transition' : transition,
			        transition           : transition,
			        '-webkit-transform'  : matrix + ' translate3d(0,0,0)',
			        transform            : matrix
			      });
			    }
		    }
		};
	}]);
	//导航栏渐变
	app.directive('navGradual',function(){
		return{
			restrict:'A',
			link:function(scope, element, attrs){
				console.log(element[0]);
				element[0].addEventListener('scroll',function(){
					var navGradual = document.querySelector(".navigation-Gradual");
				 	console.log(navGradual);
				},false);
				// angular.element(element[0]).on('scroll',function(event){  
				//  	var navGradual = document.querySelector(".navigation-Gradual");
				//  	console.log(navGradual);
			 //    });
			}
		}
	});
	/** 新返回指令 */
	app.directive('goBack', ["$window", "$log", function($window,$log){
		var link = ["$scope","$element","$attrs","$state",function($scope, $element, $attrs,$state){
			/*控制安卓返回按钮*/
			var lastValue ,stateGoRoute , stateGoParams, androidOnBack = new Array(),paramOnBack = new Array();
			$element.on("click", function(){
				$state.go("home")
			})
		}]

		return{
			restrict:'A',
			controller: link
		}
	}]);
});