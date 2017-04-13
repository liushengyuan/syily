requirejs.config({
    baseUrl: './',
    waitSeconds: 30,
    paths: {
        domready: 'public/js/domReady/domReady',
        angular: 'public/js/angular/angular',
        angularAnimate: 'public/js/angular-animate/angular-animate',
        angularUIRouterAnimateInOut: 'public/js/angular-ui-router-anim-in-out/anim-in-out',
        angularLoadBar: 'public/js/angular-loading-bar/loading-bar',
        angularUIRouter: 'public/js/angular-ui-router/angular-ui-router',
        angularResource: 'public/js/angular-resource/angular-resource',
        angularTouch: 'public/js/angular-touch/angular-touch',
    	angularSanitize: 'public/js/angular-sanitize/angular-sanitize',
        ngInfiniteScroll: 'public/js/ngInfiniteScroll/ng-infinite-scroll',
        angularCarousel: 'public/js/angular-carousel/angular-carousel',
        jquery: 'public/js/jquery/jquery',
        app: 'js/application/app',
        appRun: 'js/application/appRun',
        appRoute: 'js/application/appRoute',
        appService: 'js/application/appService',
        appDirective: 'js/application/appDirective',
        appConstants: 'js/application/appConstants',
        appController: 'js/application/appController',
        pullToRefreshService: 'js/application/pullToRefreshService',
        /*百度地图*/
        bmap:'http://api.map.baidu.com/getscript?v=2.0&ak=ws1sCbTnCigrSgle6uOER9NL&services=&t=20160224094302',
        /* 微信提供的js功能模块 */
        jweixin: 'public/js/jweixin/jweixin',
        angularQrcodeDep: 'public/js/qrcode-generator/qrcode',
        angularQrcode: 'public/js/angular-qrcode/angular-qrcode',
        /*swiper滑动样式*/
        swiper:'public/js/Swiper/swiper',
         /*上传图片*/
        ngFileUploadShim: 'public/js/ng-file-upload-shim/ng-file-upload-shim',
        ngFileUpload: 'public/js/ng-file-upload/ng-file-upload',
        /*md5加密*/
        angularMd5:'public/js/angular-md5/angular-md5',
        /*视频播放与扫一扫*/
        ngCordova: 'public/js/ngCordova/ng-cordova',
        ngVideo: 'public/js/ngvideo/ng-video',
        cordova: 'public/js/cordova/cordova.android',
        /*屏幕事件模块*/
        ngGestures: 'public/js/angular-gestures/gestures.min',
        hammer: 'public/js/hammerjs/hammer',
        /*滚动插件大师*/
        IScroll: 'public/js/iscroll/build/iscroll-probe',
        /* 模块引入文件 */
        includes: 'js/include/index',

        /*前页模块*/
        welMod: 'js/welcome/module',
        welCtrl: 'js/welcome/controller',
        welSevr: 'js/welcome/service',
        welDirect: 'js/welcome/directive',
        welIdx: 'js/welcome/index',
        /*前页模块*/
        indexMod: 'js/index/module',
        indexCtrl: 'js/index/controller',
        indexSevr: 'js/index/service',
        indexDirect: 'js/index/directive',
        indexIdx: 'js/index/index',
        /*二维码模块*/
        cardMod: 'js/card/module',
        cardCtrl: 'js/card/controller',
        cardSevr: 'js/card/service',
        cardDirect: 'js/card/directive',
        cardIdx: 'js/card/index',
               
    },
    shim: {
        angular: {
            deps: ['jquery','swiper'],
            exports: "angular"
        },
        bmap: {
            exports: "BMap"
        },
        /*'IScroll': {
             exports: 'IScroll'
        },*/
        'angularAnimate': {
            deps: ['angular']
        },
        'angularUIRouter': {
            deps: ['angular']
        },
        'angularLoadBar': {
            deps: ['angular', 'angularAnimate']
        },
        'angularUIRouterAnimateInOut': {
            deps: ['angular', 'angularAnimate', 'angularUIRouter']
        },
        'angularResource': {
            deps: ['angular']
        },
        'angularTouch': {
            deps: ['angular']
        },
        'angularMd5': {
            deps: ['angular']
        },
        'angularSanitize': {
            deps: ['angular']
        },
        'angularCarousel': {
            deps: ['angular', 'angularTouch']
        },
        'ngInfiniteScroll': {
             deps : ['angular']
        },
        'angularQrcode': {
            deps: ['angular', 'angularQrcodeDep']
        },
        'ngCordova': {
            deps : ['angular']
        },
        'ngVideo': {
            deps : ['angular']
        },
        'ngGestures': {
            deps : ['angular', 'hammer']
        },
        'ngFileUpload': {
            deps: ['angular', 'ngFileUploadShim']
        }
    }
});

require([
    "domready!", "angular","angularUIRouter", 
    "angularCarousel", "angularAnimate", "angularUIRouterAnimateInOut", 
    "angularResource", "angularTouch","angularMd5", 
    "angularSanitize", "angularLoadBar", "app", 
    "appController", "appRoute", "appRun", "pullToRefreshService",
    "appService", "appDirective", "appConstants", 
    "ngFileUpload", "angularQrcodeDep", "angularQrcode", 
    "ngInfiniteScroll", "ngCordova", "ngVideo", 
    "ngGestures"
    ], 
    function(document, angular){
        //angularjs 启动
        angular.bootstrap(document,['mobileApp']);
});