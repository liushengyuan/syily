/*
 * angular-qrcode v6.2.1
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

angular.module('monospaced.qrcode', [])
  .directive('qrcode', ['$window', function($window) {

    var canvas2D = !!$window.CanvasRenderingContext2D,
        levels = {
          'L': 'Low',
          'M': 'Medium',
          'Q': 'Quartile',
          'H': 'High'
        },
        bgImage=new Image();
        draw = function(context, qr, modules, tile ,background, foreground,imgurl,mygradient,canvas,background2) {
          /*添加图片*/
          var img = imgurl;
          bgImage.src=imgurl;
          var pat="";
          if(!imgurl){
            forother();
            return;
          }
          bgImage.onload = function(){
            pat=context.createPattern(bgImage,"no-repeat");
            forother();
          }

          function forother(){
            for (var row = 0; row < modules; row++) {
              for (var col = 0; col < modules; col++) {
                var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                    h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
                // 添加图片
                if(img){
                  context.fillStyle=qr.isDark(row, col)?pat:foreground;
                }else{
                  //颜色渐变
                  if(mygradient==1){
                    var gradient=canvas.getContext('2d').createLinearGradient(0,0,170,0);
                    gradient.addColorStop(0,background);
                    gradient.addColorStop(0.5,background2);
                    gradient.addColorStop(0,background);
                    context.fillStyle = qr.isDark(row, col)?gradient:foreground;
                  }else{
                    context.fillStyle=qr.isDark(row, col) ? background : foreground;
                  }
                }
                context.fillRect(Math.round(col * tile),
                                 Math.round(row * tile), w, h);
                // context.flush();
                // File f = new File("E:\\QRCodeTest\\a.jpg");  
                // if(!f.exists()) f.createNewFile();  
                // ImageIO.write(bi, "jpg", f);
              }
            }
          }
          
        };

    return {
      restrict: 'E',
      template: '<img ng-if="image" src="{{image}}" style="position: absolute;width: 30px; height: 30px;z-index:101;margin-left: 5.3rem;margin-top: 5.8rem;" /><canvas class="qrcode"></canvas>',
      scope: {  
                image: '='  
            },  
      link: function(scope, element, attrs) {
        var domElement = element[0],
            $canvas = element.find('canvas'),
            canvas = $canvas[0],
            context = canvas2D ? canvas.getContext('2d') : null,
            download = 'download' in attrs,
            href = attrs.href,
            link = download || href ? document.createElement('a') : '',
            trim = /^\s+|\s+$/g,
            error,
            version,
            errorCorrectionLevel,
            data,
            size,
            modules,
            tile,
            qr,
            $img,
            imgurl,
            background,
            foreground,
            mygradient,
            background2,
            setVersion = function(value) {
              version = Math.max(1, Math.min(parseInt(value, 10), 40)) || 5;
            },
            setErrorCorrectionLevel = function(value) {
              errorCorrectionLevel = value in levels ? value : 'M';
            },

          

            setData = function(value) {
              if (!value) {
                return;
              }

              data = value.replace(trim, '');
              qr = qrcode(version, errorCorrectionLevel);
              qr.addData(data);

              try {
                qr.make();
              } catch(e) {
                error = e.message;
                return;
              }

              error = false;
              modules = qr.getModuleCount();
            },
            setSize = function(value) {
              size = parseInt(value, 10) || modules * 2;
              tile = size / modules;
              canvas.width = canvas.height = size;
            },
           
            render = function() {
              if (!qr) {
                return;
              }

              if (error) {
                if (link) {
                  link.removeAttribute('download');
                  link.title = '';
                  link.href = '#_';
                }
                if (!canvas2D) {
                  domElement.innerHTML = '<img src width="' + size + '"' +
                                         'height="' + size + '"' +
                                         'class="qrcode">';
                }
                scope.$emit('qrcode:error', error);
                return;
              }

              if (download) {
                domElement.download = 'qrcode.png';
                domElement.title = 'Download QR code';
              }

              if (canvas2D) {
                draw(context, qr, modules, tile,background,foreground,imgurl,mygradient,canvas,background2);

                if (download) {
                  domElement.href = canvas.toDataURL('image/png');
                  return;
                }
              } else {
                domElement.innerHTML = qr.createImgTag(tile, 0);
                $img = element.find('img');
                $img.addClass('qrcode');

                if (download) {
                  domElement.href = $img[0].src;
                  return;
                }
              }

              if (href) {
                domElement.href = href;
              }
            };

        if (link) {
          link.className = 'qrcode-link';
          $canvas.wrap(link);
          domElement = domElement.firstChild;
        }

        setVersion(attrs.version);
        setErrorCorrectionLevel(attrs.errorCorrectionLevel);
        setSize(attrs.size);

        attrs.$observe('version', function(value) {
          if (!value) {
            return;
          }

          setVersion(value);
          setData(data);
          setSize(size);
          render();
        });

        attrs.$observe('errorCorrectionLevel', function(value) {
          if (!value) {
            return;
          }

          setErrorCorrectionLevel(value);
          setData(data);
          setSize(size);
          render();
        });

        attrs.$observe('data', function(value) {
          if (!value) {
            return;
          }

          setData(value);
          setSize(size);
          render();
        });

        attrs.$observe('size', function(value) {
          if (!value) {
            return;
          }

          setSize(value);
          render();
        });

        attrs.$observe('href', function(value) {
          if (!value) {
            return;
          }

          href = value;
          render();
        });

        attrs.$observe('background', function(value) {
          if (!value) {
            background="#fff";
            render();
          }

          background = value;

          render();
        });

        attrs.$observe('background2', function(value) {
          if (!value) {
            background2="#fff";
            render();
          }

          background2 = value;

          render();
        });

        attrs.$observe('foreground', function(value) {
          if (!value) {
            foreground="#000";
            render();
          }

          foreground = value;
          render();
        });

        attrs.$observe('imgurl', function(value) {
          if (!value) {
            imgurl="";
          }

          imgurl = value;
          render();
        });

        attrs.$observe('mygradient', function(value) {
          if (!value) {
            mygradient=0;
            
          }

          mygradient = value;
          render();
        });

      }
    };
  }]);
