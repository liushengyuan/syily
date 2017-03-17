define(['app', 'IScroll'], function(app, IScroll){
  
  app.factory("PullToRefreshService",[
    "$rootScope", "$http", "$log", "globalContants", "$httpParamSerializerJQLike",
   function($rootScope, $http, $log, globalContants, $httpParamSerializerJQLike){

    var IScrollPullUpDown = null;
    var pullDownAction = null;
    var pullUpAction = null;

    // Functions to simulate "refresh" and "load" on pull-down/pull-up
    var generatedCount=0;
    pullDownAction = function(theScroller) {
      setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
        console.log("下拉");
        var el, li, i;
        el = document.getElementById('thelist');

        for (i=0; i<3; i++) {
          li = document.createElement('li');
          li.innerText = 'Generated row ' + (++generatedCount);
          el.insertBefore(li, el.childNodes[0]);
        }
        theScroller.refresh();    // Remember to refresh when contents are loaded (ie: on ajax completion)
      }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
    }
    pullUpAction = function(theScroller) {
      setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
        console.log("上拉");
        var el, li, i;
        el = document.getElementById('thelist');

        for (i=0; i<3; i++) {
          li = document.createElement('li');
          li.innerText = 'Generated row ' + (++generatedCount);
          el.appendChild(li, el.childNodes[0]);
        }
        theScroller.refresh();    // Remember to refresh when contents are loaded (ie: on ajax completion)
      }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
    }

    IScrollPullUpDown = function (wrapperName,iScrollConfig,pullDownActionHandler,pullUpActionHandler) {
      var iScrollConfig,pullDownActionHandler,pullUpActionHandler,pullDownEl,pullDownOffset,pullUpEl,scrollStartPos;
      var pullThreshold=5;
      var me=this;
      //动态改变图标的角度-hcm
      function rotateOfTrends (angle){
        this.style.webkitTransform = "rotate("+angle+"deg)";
      }
      
      //获取class的样式-hcm
      function styleVal(obj,attributeName){
        if(obj.currentStyle){
          return obj.currentStyle[attributeName];
        }else{
          return document.defaultView.getComputedStyle(obj,null)[attributeName];
        }
      }

      function showPullDownElNow(className) {
        // Shows pullDownEl with a given className
        pullDownEl.style.transitionDuration='';
        pullDownEl.style.marginTop='';
        pullDownEl.className = 'pullDown '+className;
      }
      var hidePullDownEl = function (time,refresh) {
        // Hides pullDownEl
        pullDownEl.style.transitionDuration=(time>0?time+'ms':'');
        pullDownEl.style.marginTop='';
        pullDownEl.className = 'pullDown scrolledUp';

        // If refresh==true, refresh again after time+10 ms to update iScroll's "scroller.offsetHeight" after the pull-down-bar is really hidden...
        // Don't refresh when the user is still dragging, as this will cause the content to jump (i.e. don't refresh while dragging)
        if (refresh) setTimeout(function(){me.myScroll.refresh();},time+10);
      }

      // 控制上拉加载显示隐藏
      this.hidePullUpEl = function(){
        if(pullUpActionHandler && pullUpEl){
          pullUpEl.parentNode.removeChild(pullUpEl);
          pullUpEl = null;
          return true;
        }
        return false;
      }

      this.showPullUpEl = function(){
        if (pullUpActionHandler && !pullUpEl) {
          var wrapperObj = wrapperName;
          var scrollerObj = wrapperObj.children[0];
          pullUpEl=document.createElement('div');
          pullUpEl.className='pullUp';
          pullUpEl.innerHTML='<span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多</span>';
          scrollerObj.appendChild(pullUpEl);
        }
      }

      this.init = function() {
        // var wrapperObj = document.querySelector('#'+wrapperName);
        var wrapperObj = wrapperName;
        var scrollerObj = wrapperObj.children[0];

        if (pullDownActionHandler) {
          // If a pullDownActionHandler-function is supplied, add a pull-down bar at the top and enable pull-down-to-refresh.
          // (if pullDownActionHandler==null this iScroll will have no pull-down-functionality)
          pullDownEl=document.createElement('div');
          pullDownEl.className='pullDown scrolledUp';
          pullDownEl.innerHTML='<span class="pullDownIcon"></span><span class="pullDownLabel">下拉可以刷新</span><i></i>';
          scrollerObj.insertBefore(pullDownEl, scrollerObj.firstChild);
          pullDownOffset = pullDownEl.offsetHeight;
        }
        if (pullUpActionHandler) {
          // If a pullUpActionHandler-function is supplied, add a pull-up bar in the bottom and enable pull-up-to-load.
          // (if pullUpActionHandler==null this iScroll will have no pull-up-functionality)
          pullUpEl=document.createElement('div');
          pullUpEl.className='pullUp';
          pullUpEl.innerHTML='<span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多</span>';
          scrollerObj.appendChild(pullUpEl);
        }

        me.myScroll = new IScroll(wrapperObj,iScrollConfig);

        me.myScroll.on('refresh',function() {
          if ((pullDownEl)&&(pullDownEl.className.match('loading'))) {
            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉可以刷新';
            if (this.y>=0) {
              // The pull-down-bar is fully visible:
              // Hide it with a simple 250ms animation
              hidePullDownEl(250,true);

            } else if (this.y>-pullDownOffset) {
              // The pull-down-bar is PARTLY visible:
              // Set up a shorter animation to hide it

              // Firt calculate a new margin-top for pullDownEl that matches the current scroll position
              pullDownEl.style.marginTop=this.y+'px';

              // CSS-trick to force webkit to render/update any CSS-changes immediately: Access the offsetHeight property...
              pullDownEl.offsetHeight;

              // Calculate the animation time (shorter, dependant on the new distance to animate) from here to completely 'scrolledUp' (hidden)
              // Needs to be done before adjusting the scroll-positon (if we want to read this.y)
              var animTime=(250*(pullDownOffset+this.y)/pullDownOffset);

              // Set scroll positon to top
              // (this is the same as adjusting the scroll postition to match the exact movement pullDownEl made due to the change of margin-top above, so the content will not "jump")
              this.scrollTo(0,0,0);

              // Hide pullDownEl with the new (shorter) animation (and reset the inline style again).
              setTimeout(function() { // Do this in a new thread to avoid glitches in iOS webkit (will make sure the immediate margin-top change above is rendered)...
                hidePullDownEl(animTime,true);
              },0);

            } else {
              // The pull-down-bar is completely off screen:
              // Hide it immediately
              hidePullDownEl(0,true);
              // And adjust the scroll postition to match the exact movement pullDownEl made due to change of margin-top above, so the content will not "jump"
              this.scrollBy(0,pullDownOffset,0);
            }
            if (document.querySelector("#trends") && !document.querySelector("#friend_my")) {//如果进入的是trends页面，则移除.pullDown-trends元素的loading,并且转换icon的展示-hcm
              angular.element(document.querySelector(".pullDown-trends")).removeClass("loading");
              document.querySelector(".pullDownIcon1").style.display = "none";
              document.querySelector(".pullDownIcon").style.display = "inline-block";
            };
          }
          if ((pullUpEl)&&(pullUpEl.className.match('loading'))) {
            pullUpEl.className = 'pullUp';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
          }
        });

        me.myScroll.on('scrollStart',function() {
          scrollStartPos=this.y; // Store the scroll starting point to be able to track movement in 'scroll' below
        });
          
        me.myScroll.on('scroll',function() {
          if (pullDownEl||pullUpEl) {
            if((scrollStartPos==0)&&(this.y==0)) {
              // 'scroll' called, but scroller is not moving!
              // Probably because the content inside wrapper is small and fits the screen, so drag/scroll is disabled by iScroll
              
              // Fix this by a hack: Setting "myScroll.hasVerticalScroll=true" tricks iScroll to believe
              // that there is a vertical scrollbar, and iScroll will enable dragging/scrolling again...
              this.hasVerticalScroll=true;
              
              // Set scrollStartPos to -1000 to be able to detect this state later...
              scrollStartPos=-1000;
            } else if ((scrollStartPos==-1000) && 
                   (((!pullUpEl)&&(!pullDownEl.className.match('flip'))&&(this.y<0)) ||
                        ((!pullDownEl)&&(!pullUpEl.className.match('flip'))&&(this.y>0)))) {
              // Scroller was not moving at first (and the trick above was applied), but now it's moving in the wrong direction.
              // I.e. the user is either scrolling up while having no "pull-up-bar",
              // or scrolling down while having no "pull-down-bar" => Disable the trick again and reset values...
              this.hasVerticalScroll=false;
              scrollStartPos=0;
              this.scrollBy(0,-this.y, 0);  // Adjust scrolling position to undo this "invalid" movement
            }
          }
      
          if (pullDownEl) {
            if (this.y > pullDownOffset+pullThreshold && !pullDownEl.className.match('flip')) {
              showPullDownElNow('flip');
              if (document.querySelector("#trends") && !document.querySelector("#friend_my")) {//如果进入的是trends页面,将icon的展示进行转换且不用恢复高度-hcm
                document.querySelector(".pullDownIcon1").style.display = "inline-block";
                document.querySelector(".pullDownIcon").style.display = "none";
              }else{
                this.scrollBy(0,-pullDownOffset, 0);  // Adjust scrolling position to match the change in pullDownEl's margin-top
              }
              pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开立即刷新';
            } else if (this.y < 0 && pullDownEl.className.match('flip')) { // User changes his mind...
              hidePullDownEl(0,false);
              if (document.querySelector("#trends") && !document.querySelector("#friend_my")) {
                document.querySelector(".pullDownIcon1").style.display = "none";
                document.querySelector(".pullDownIcon").style.display = "inline-block";
              }else{
                this.scrollBy(0,pullDownOffset, 0); // Adjust scrolling position to match the change in pullDownEl's margin-top
              }

              pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉可以刷新';
            }
            if (document.querySelector("#trends") && !document.querySelector("#friend_my")) {//如果进入的是trends页面,将icon随着下拉的距离而变换角度-hcm
              var viewport = document.querySelector(".pullDownIcon");
              var viewport1 = document.querySelector(".pullDownIcon1");
              var isHidden = styleVal(viewport1,"display");
              if (isHidden == "block") {
                rotateOfTrends.call(viewport1,-(this.y)*5);
              }else{
                rotateOfTrends.call(viewport,-(this.y)*5);
              }
            }
          }
          if (pullUpEl) {
            if (this.y < (this.maxScrollY - pullThreshold) && !pullUpEl.className.match('flip')) {
              pullUpEl.className = 'pullUp flip';
              pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开加载更多';
            } else if (this.y > (this.maxScrollY + pullThreshold) && pullUpEl.className.match('flip')) {
              pullUpEl.className = 'pullUp';
              pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
            }
          }
        });     
          
        me.myScroll.on('scrollEnd',function() {
          if ((pullDownEl)&&(pullDownEl.className.match('flip'))) {
            showPullDownElNow('loading');
            pullDownEl.querySelector('.pullDownLabel').innerHTML = '正在加载数据...';
            pullDownActionHandler(this);  // Execute custom function (ajax call?)
            if (document.querySelector("#trends") && !document.querySelector("#friend_my")) {//如果进入的是trends页面,则将icon的角度还原并且进行加载动画
              var viewport = document.querySelector(".pullDownIcon");
              var viewport1 = document.querySelector(".pullDown-trends");
              var viewport3 = document.querySelector(".pullDownIcon1");
              angular.element(viewport1).addClass("loading");
              var isHidden = styleVal(viewport1,"display");
              rotateOfTrends.call(viewport3,(this.y)*5);
              rotateOfTrends.call(viewport,(this.y)*5);
            }
          }
          if ((pullUpEl)&&(pullUpEl.className.match('flip'))) {
            pullUpEl.className = 'pullUp loading';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载数据...';
            pullUpActionHandler(this);  // Execute custom function (ajax call?)
          }
          if (scrollStartPos=-1000) {
            // If scrollStartPos=-1000: Recalculate the true value of "hasVerticalScroll" as it may have been
            // altered in 'scroll' to enable pull-to-refresh/load when the content fits the screen...
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
          }
        });
      }
      //window.addEventListener('load', function() {init()}, false);
      // init();
      // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    };    



    /*
     * iscroll封装调用示例
    var scroller1 = new IScrollPullUpDown('wrapper',{
      probeType:2,
      bounceTime: 250,
      bounceEasing: 'quadratic',
      mouseWheel:false,
      scrollbars:true,
      fadeScrollbars:true,
      interactiveScrollbars:false
    },pullDownAction,pullUpAction);
    */
    
    return {
      IScrollPullUpDown : IScrollPullUpDown,
      pullDownAction : pullDownAction,
      pullUpAction : pullUpAction
    }

  }]);

});