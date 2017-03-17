define(['app'], function(app){
  
  app.factory("RPCService",[
    "$rootScope", "$http", "$log", 
    "globalContants", "$httpParamSerializerJQLike", '$timeout',
   function($rootScope, $http, $log, globalContants, $httpParamSerializerJQLike, $timeout){

    var actionNameKey;
    var paramsKey;
    var callbackKey;
    var callbackErrKey;
    var path;
    var dataResult = [];
    var rpcSuccessed = false;
    var totalPageCount = 0;
    //查询页码
    var pageNo = 1;
    //每页长度
    var pageLength = 5;
    
    var scrollerState = {
      theScroller : null,
      pullRefreshObj: null,
      TabID: null,
      TabArray: [],
      setTheScroller : function(theInstance){
        scrollerState.theScroller = theInstance;
      },
      setPullRefreshObj: function(pullInstance,limitUp){
        scrollerState.pullRefreshObj = pullInstance;
        //为导航栏渐变颜色使用
        var MouseWheelHandler = function(e) {
          var scroll = -(scrollerState.pullRefreshObj.myScroll.y)//element[0].scrollY ;
          var navGradualEle = document.querySelector('.navigation-Gradual');
          navGradualEle.style.background = "rgba(1,1,1,"+(scroll/100)+")"
        }
        if(limitUp){
          scrollerState.pullRefreshObj.myScroll.on("scroll",MouseWheelHandler);
        }
          
      },
      factoryCurrentTabId: function(){
        var currentTap = scrollerState.TabArray[0];
        scrollerState.TabArray.shift();
        return currentTap;
      }
    }

    /**
     * 单次请求后台接口
     * 参数1: 模块地址XXX.XXX
     * 参数2: 参数列表JSON形式
     * 参数3: 成功回调函数
     * 参数4: 失败回调函数
     * 参数5: 请求类型为
     *   "single"代表单次请求不弹出等待框
     *   "scroll"代表接下来页面要加载无限滚动组件
     */
    var rpc = function(actionName, params, callback, callbackErr, reqType){
        var isIgnoreLoadingBar = false;
        //当用户点击按钮访问接口时未响应成功时，禁用按钮
        $rootScope.clickBtnStatus = false;
        //判断是不是单次请求
        if(reqType && reqType == "single"){
          $rootScope.waitingDiv = false;
          isIgnoreLoadingBar = true;
        } else {
          $rootScope.waitingDiv = true;
          isIgnoreLoadingBar = false;
        }
        
        //重置第一次请求为未执行
        rpcSuccessed = false;

        //如果是滚动功能记录回调函数为滚动提供支撑
        if(reqType && reqType == "scroll"){
          totalPageCount = 0;
          actionNameKey = actionName;
          paramsKey = params;
          callbackKey = callback;
          callbackErrKey = callbackErr;
          //查询页码
          pageNo = paramsKey.page;
          //每页长度
          pageLength = paramsKey.pageSize;
        }

        //拼接请求地址
        var func = actionName;
        path = globalContants.serviceUrl+"/d/dwr/"+func;

        //合并请求参数
        var param = params.join();
        console.log("params",params);
        /*每个接口添加用户名密码，服务器用来判断是否登录*/
        // param.userNamePass = globalContants.userNamePass;
        $log.debug(param);

        var req = {
            method: 'post',
            url: path,
            data: $httpParamSerializerJQLike({ps:'['+param+']'}),
            // responseType: "json",
            ignoreLoadingBar: isIgnoreLoadingBar,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
          };

          $http(req).then(function(response){
            //totalPageCount = data.data.totalPageCount;
    	    var data=eval("obj="+response.data+";"), status=response.status, 
           headers=response.headers, config=response.config, statusText=response.config;
            if (typeof callback == "function") {
              callback(data, status);
            }
            dataResult = data;
            rpcSuccessed = true;
            $rootScope.waitingDiv = false;
            //当用户点击按钮访问接口时响应成功时，开启按钮
            $rootScope.clickBtnStatus = true;
            $timeout(function () {               
              if(scrollerState.TabID){
                var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
                if(tapIscrollObj){
                  tapIscrollObj.refresh();
                }
              } else {
                if(scrollerState.theScroller){
                  scrollerState.theScroller.refresh();
                }
              }
            }, 1000);
            

            /** 处理当没记录时隐藏上拉加载 */
            if(data && data.data && data.data.hasOwnProperty("totalPageCount")){
              console.log("总页数：" + data.data.totalPageCount);
              if(data.data.totalPageCount <= 1){
                if(scrollerState.TabID){
                  var PullRefreshIscrollObj = iScrollMap.get(scrollerState.TabID + "PullRefreshIScroll");
                  if(PullRefreshIscrollObj){
                    var hidePullStatus = PullRefreshIscrollObj.hidePullUpEl();
                    if(!hidePullStatus){
                      $timeout(function(){
                        PullRefreshIscrollObj.hidePullUpEl();
                      }, 100);
                    }
                  }
                } else {
                  if(scrollerState.pullRefreshObj){
                    var hidePullStatus = scrollerState.pullRefreshObj.hidePullUpEl();
                    if(!hidePullStatus){
                      $timeout(function(){
                        scrollerState.pullRefreshObj.hidePullUpEl();
                      }, 100);
                    }
                  }
                }

              } else {
                if(scrollerState.TabID){
                  var PullRefreshIscrollObj = iScrollMap.get(scrollerState.TabID + "PullRefreshIScroll");
                  if(PullRefreshIscrollObj){
                    PullRefreshIscrollObj.showPullUpEl();
                  }
                } else {
                  if(scrollerState.pullRefreshObj){
                    scrollerState.pullRefreshObj.showPullUpEl();
                  }
                }
              }
            }
          }).catch(function(response){
        	  var data=eval("obj="+response.data+";"), status=response.status, 
              headers=response.headers, config=response.config, statusText=response.config;
            if (typeof callbackErr == "function") {
              callbackErr(data, status);
            }
            dataResult = data;
            $rootScope.waitingDiv = false;
            //当用户点击按钮访问接口时响应失败时，开启按钮
            $rootScope.clickBtnStatus = true;
            $timeout(function () {               
              if(scrollerState.TabID){
                var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
                if(tapIscrollObj){
                  tapIscrollObj.refresh();
                }
              } else {
                if(scrollerState.theScroller){
                  scrollerState.theScroller.refresh();
                }
              }
            }, 1000);

            if(scrollerState.TabID){
              var PullRefreshIscrollObj = iScrollMap.get(scrollerState.TabID + "PullRefreshIScroll");
              if(PullRefreshIscrollObj){
                var hidePullStatus = PullRefreshIscrollObj.hidePullUpEl();
                if(!hidePullStatus){
                  $timeout(function(){
                    PullRefreshIscrollObj.hidePullUpEl();
                  }, 100);
                }
              }
            } else {
              if(scrollerState.pullRefreshObj){
                var hidePullStatus = scrollerState.pullRefreshObj.hidePullUpEl();
                if(!hidePullStatus){
                  $timeout(function(){
                    scrollerState.pullRefreshObj.hidePullUpEl();
                  }, 100);
                }
              }
            }
          });
        
    };
    

    /**
     * 滚动查询对象需要实例化才能使用
     * items负责存储累加的查询结果
     * busy负责存储是否繁忙需要继续加载与否的状态
     * after 存储是否显示加载中的特效
     */
    var ScroolQuery = function() {
        this.items = [];
        this.busy = false;
        this.after = false;
    };

    /* 原型方法供页面指令调用加载下一页 */
    ScroolQuery.prototype.nextPage = function() {
        if (this.busy || !rpcSuccessed) {
          $timeout(function () {               
            if(scrollerState.TabID){
              var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
              if(tapIscrollObj){
                tapIscrollObj.refresh();
              }
            } else {
              if(scrollerState.theScroller){
                scrollerState.theScroller.refresh();
              }
            }
          }, 1000);
          return
        };

        // 保存当前被实例化的滚动对象
        var objInts = this;
        //默认设置为繁忙不加载
        this.busy = true;
        this.after = true;
        //this.items = dataResult;
        
        //从全局中查询总页数
        totalPageCount = globalContants.totalPageCount;

        //自动累加下一页起始下标
        pageNo += 1;

        //item长度小于期望的记录页数倍数长度结束查询
        if(pageNo > totalPageCount){
          this.after = false;
          rpcSuccessed = false;
          $timeout(function () {               
            if(scrollerState.TabID){
              var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
              if(tapIscrollObj){
                tapIscrollObj.refresh();
              }
            } else {
              if(scrollerState.theScroller){
                scrollerState.theScroller.refresh();
              }
            }
          }, 1000);

          if(scrollerState.TabID){
            var PullRefreshIscrollObj = iScrollMap.get(scrollerState.TabID + "PullRefreshIScroll");
            if(PullRefreshIscrollObj){
              PullRefreshIscrollObj.hidePullUpEl();
            }
          } else {
            if(scrollerState.pullRefreshObj){
              scrollerState.pullRefreshObj.hidePullUpEl();
            }
          }
          return false;
        }

        paramsKey.page = pageNo;
        //paramsKey[1] += paramsKey[1] + 6;

        var param = paramsKey;

        var req = {
            method: 'post',
            url: path,
            data: $httpParamSerializerJQLike(param),
            responseType: "json",
            ignoreLoadingBar: false,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
          };

        $http(req).then(function(response){
          //data = eval("obj="+data+";");
        	var data=eval("obj="+response.data+";"), status=response.status, 
            headers=response.headers, config=response.config, statusText=response.config;
          if (typeof callbackKey == "function") {
            callbackKey(data, status);
          }
          objInts.busy = false;
          objInts.after = false;
          $timeout(function () {               
            if(scrollerState.TabID){
              var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
              if(tapIscrollObj){
                tapIscrollObj.refresh();
              }
            } else {
              if(scrollerState.theScroller){
                scrollerState.theScroller.refresh();
              }
            }
          }, 1000);
        }).catch(function(response){
        	var data=eval("obj="+response.data+";"), status=response.status, 
            headers=response.headers, config=response.config, statusText=response.config;
          if (typeof callbackErrKey == "function") {
            callbackErrKey(data, status);
          }
          objInts.busy = false;
          objInts.after = false;
          $timeout(function () {               
            if(scrollerState.TabID){
              var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
              if(tapIscrollObj){
                tapIscrollObj.refresh();
              }
            } else {
              if(scrollerState.theScroller){
                scrollerState.theScroller.refresh();
              }
            }
          }, 1000);
        });
    };

    /* 获取URL中的参数 */
    var GetQueryString = function (para,s) {
        if (!para){
          return
        }
        
        var str = s ? s : document.location.href;
        var m = new RegExp("[\\?&]"+para+"=([^&]*)","i");
        var r = str.match(m)
        return r ? unescape(r[1]) : "";
        //return r?decodeURIComponent(r[1]):""
    }

    /**
     * 为Run中获取OPENID单独开辟方法
     */
    var rpcOpenId = function(actionName, params, callback, callbackErr){
        $rootScope.waitingDiv = true;
        //拼接请求地址
        var func = actionName;
        var idPath = globalContants.serviceUrl+"/api/"+func;

        //JSON请求参数
        var param = params;
        $log.debug(param);

        var req = {
            method: 'post',
            url: idPath,
            data: $httpParamSerializerJQLike(param),
            responseType: "json",
            ignoreLoadingBar: true,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
          };

        $http(req).then(function(response){
          //data = eval("obj="+data+";");
        	 var data=eval("obj="+response.data+";"), status=response.status, 
             headers=response.headers, config=response.config, statusText=response.config;
          $rootScope.waitingDiv = false;
          if (typeof callback == "function") {
            callback(data, status);
          }
          $timeout(function () {             
            if(scrollerState.TabID){
              var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
              if(tapIscrollObj){
                tapIscrollObj.refresh();
              }
            } else {
              if(scrollerState.theScroller && actionName != "smallball/friendsCircle!getViewRemark.do"){
                scrollerState.theScroller.refresh();
              }
            }
          }, 1000);
        }).catch(function(response){
        	var data=eval("obj="+response.data+";"), status=response.status, 
            headers=response.headers, config=response.config, statusText=response.config;
          $rootScope.waitingDiv = false;
          if (typeof callbackErr == "function") {
            callbackErr(data, status);
          }
          $timeout(function () {               
            if(scrollerState.TabID){
              var tapIscrollObj = iScrollMap.get(scrollerState.TabID + "IScroll");
              if(tapIscrollObj){
                tapIscrollObj.refresh();
              }
            } else {
              if(scrollerState.theScroller){
                scrollerState.theScroller.refresh();
              }
            }
          }, 1000);
        });
        
    };

    /**
     * 仿照JAVA中的HashMap的实现
     */
    var HashMap = function() {
        /** Map 大小 * */
        var size = 0;
        /** 对象 * */
        var entry = new Object();
        /** 存 * */
        this.put = function(key, value) {
          if (!this.containsKey(key)) {
            size++;
          }
          entry[key] = value;
        };
        /** 取 * */
        this.get = function(key) {
          if (this.containsKey(key)) {
            return entry[key];
          } else {
            return null;
          }

        };
        /** 删除 * */
        this.remove = function(key) {
          if (delete entry[key]) {
            size--;
          }
        };

        /** 是否包含 Key * */
        this.containsKey = function(key) {
          return (key in entry);
        };

        /** 是否包含 Value * */
        this.containsValue = function(value) {
          for ( var prop in entry) {
            if (entry[prop] == value) {
              return true;
            }
          }
          return false;
        };

        /** 所有 Value * */

        this.values = function() {
          var values = new Array(size);
          for ( var prop in entry) {
            values.push(entry[prop]);
          }
          return values;
        };

        /** 所有 Key * */
        this.keys = function() {
          var keys = new Array(size);
          for ( var prop in entry) {
            keys.push(prop);
          }
          return keys;
        };

        /** Map Size * */

        this.size = function() {
          return size;
        };
    };
    
    /*判断用户是否登录
     *param 调用接口的返回值
     */
    //检查当前用户是否重新登录
    var restartLogin = function(param,$scope,$state){
      //用户未登录
      if(param &&　param.result==0){
        if(param.message.indexOf('登录') > 0 ){
            $scope.popSample.showPop("网络连接已超时，请重新登录.",function(){
                      $state.go("login");
            })
        }
      } 
    }
    //接口错误的回调函数
    var errorCallback = function($scope,$state){
        $scope.popSample.showPop("发生未知错误，重新登录.",function(){
            $state.go("login");
        }) 
    }


    var iScrollMap = new HashMap();

    //获取定位
    var getCurrentPoint = function(callback){
        if(typeof(callback)!='function'){
          console.error("getCurrentPoint:传入的参数不是方法");
          return;
        }
        var point =  JSON.parse(window.sessionStorage.getItem('point'));
        if(point){
          callback(point);
        }else{
          require(["bmap"], function(BMap){
            var geo = new BMap.Geolocation();
            geo.getCurrentPosition(function(param){
              window.sessionStorage.setItem('point',JSON.stringify(param.point));
              callback(param.point);
            });
          });
        }
    }
    return {
      getRPC: rpc,
      getScrollRPC: ScroolQuery,
      getUrlParam:GetQueryString,
      getRpcId: rpcOpenId,
      HashMap: HashMap,
      restartLogin: restartLogin,
      errorCallback: errorCallback,
      scrollerState: scrollerState,
      setTheScroller: scrollerState.setTheScroller,
      setPullRefreshObj: scrollerState.setPullRefreshObj,
      iScrollMap: iScrollMap,
      getCurrentPoint:getCurrentPoint
    }

  }]);

});