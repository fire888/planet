export default ILLUSTRATIONS_InitStart


var canvases = {
    'dr01': {
      canvas: null,
      ctx: null,
      sprites: [],
      imgs: {
        'back': {
           src: 'assets/ill_01_back.png',
           data: null
        },
        'wire': {
          src: 'assets/ill_02_wire.png',
          data: null 
       }      
      }
    },
    'dr02': {
      canvas: null,
      ctx: null,
      sprites: [],
      imgs: {
        'back': {
           src: 'assets/ill_02_back.png',
           data: null
        },
        'wire': {
           src: 'assets/ill_02_wire.png',
           data: null 
        },
        'wire_blur': {
           src: 'assets/ill_02_wire_blur.png',
           data: null
        } 
      }
    },
    'dr03': {
      canvas: null,
      ctx: null,
      sprites: [],
      imgs: {
        'back': {
           src: 'assets/ill_03_back.png',
           data: null
        },
        'wire': {
           src: 'assets/ill_02_wire.png',
           data: null 
        },
        'wire_blur': {
           src: 'assets/ill_02_wire_blur.png',
           data: null
        } 
      }
    },
    'dr04': {
      canvas: null,
      ctx: null,
      sprites: [],
      imgs: {
        'back': {
           src: 'assets/ill_04_back.png',
           data: null
        },
        'wire': {
          src: 'assets/ill_02_wire.png',
          data: null 
       }     
      }
    },
    'dr05': {
      canvas: null,
      ctx: null,
      sprites: [],
      imgs: {
        'back': {
           src: 'assets/ill_05_back.png',
           data: null
        },
        'wire': {
          src: 'assets/ill_02_wire.png',
          data: null 
       }      
      }
    }
  };
  
  var sprites_Data = { 
    'LeftNORM': {
      start: {
        xMin: 0,
        xMax: 50,
        yMin: 50,
        yMax: 200,
      },
      finish: {
        xMin: 600,
        xMax: 400
      },
      spd: {
        xMin: 1.5,
        xMax: 2.5,
        yMin: 0,
        yMax: 0
      },
      color: 'rgba(255, 255, 0, 1.0)'
    } 
  }
  
  
  
  /*******************************************************************/
  
  var actionsLoad = [], loaded = 0;
  
  function ILLUSTRATIONS_InitStart () {
    loadAssetsImgs( function () {
      initCanvases();
      startAnimationCanvases();
    } );
  }
  
  var interval 
  
  function startAnimationCanvases() {
    interval = setInterval( drawFrameCanvases, 30 )
  }
  
  function drawFrameCanvases() {
    for ( let key in canvases ) {
      updateCanvas( canvases[ key ] )
    }
  }
  
  
  
  /*******************************************************************/
  
  function loadAssetsImgs ( onload ) {
    for ( let key in canvases ) {
      for  ( let keyNameImg in canvases[ key ].imgs ) {
        actionsLoad.push( function() {
          canvases[ key ].imgs[ keyNameImg ].data = new Image();
          canvases[ key ].imgs[ keyNameImg ].data.src = canvases[ key ].imgs[ keyNameImg ].src;
          canvases[ key ].imgs[ keyNameImg ].data.onload = function () {
            loaded ++
            actionsLoad[ loaded ]()
          } 
        } )     
      }    
    }
    actionsLoad.push( function() { onload() } )
    actionsLoad[ 0 ]() 
  }
  
  function initCanvases() {
    for ( let key in canvases ) {
      canvases[ key ].canvas = document.getElementById( key );
      canvases[ key ].ctx = canvases[ key ].canvas.getContext('2d'); 
      initSprites( key );
    }
  }
  
  function updateCanvas ( item ) {
    item.ctx.clearRect( 0, 0, item.canvas.width, item.canvas.height )
    item.ctx.globalCompositeOperation = 'source-over';
    item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );
    updateSprites( item )
    if ( item.imgs[ 'wire' ] ) {
      item.ctx.drawImage( item.imgs[ 'wire' ].data, 100, 100 );
    }  
    item.ctx.globalCompositeOperation = 'destination-in';
    item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );  
  }
  
  
  
  /******************************************************************/
  
  function initSprites ( v ) {
    if ( v == 'dr01' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )       
    }
    if ( v == 'dr02' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )       
    }
    if ( v == 'dr03' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )      
    }
    if ( v == 'dr04' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )      
    }
    if ( v == 'dr05' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )      
    }
  }
  
  function createDataSprites ( name, count ) {
    var arr = []
    for ( var i = 0; i < count; i ++ ) {
      let s = {}
      setStartParams( s, name )
      arr.push( s )
    }
    return arr
  }
  
  function setStartParams( s, name ) {
    var _pro = sprites_Data[ name ]
    s.type = name  
    s.x = Math.random() * _pro.start.xMax + _pro.start.xMin;
    s.y = Math.random() * _pro.start.yMax + _pro.start.yMin; 
    s.spdX = Math.random() * _pro.spd.xMax + _pro.spd.xMin; 
    s.spdY = Math.random() * _pro.spd.yMax + _pro.spd.yMin; 
    s.color = _pro.color; 
  }
  
  function updateSprites ( item ) {
    for ( let i = 0; i < item.sprites.length; i ++ ) {
      for ( let ii = 0; ii < item.sprites[ i ].length; ii ++ ) {
        drawSprite( item, item.sprites[ i ][ ii ] )
      }
    }
  }
  
  function drawSprite ( dataCan, sprite ) {
    if ( sprite.x > sprites_Data[ sprite.type ].finish.xMin ) {
      setStartParams( sprite, sprite.type )
    }
    sprite.x += sprite.spdX;
    sprite.y += sprite.spdY;
    dataCan.ctx.fillStyle = sprite.color;
    dataCan.ctx.fillRect( sprite.x, sprite.y, 20, 20  );
  }
  
  