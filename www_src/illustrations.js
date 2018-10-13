

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
          src: 'assets/ill_01_img.png',
          data: null,
          x: 30,
          y: 0
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
           data: null,
           x: 120,
           y: 150 
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
           src: 'assets/ill_03_wire.png',
           data: null,
           x: 80,
           y: 70 
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
           src: 'assets/ill_04_wire.png',
           data: null,
           x: 80,
           y: 70 
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
           src: 'assets/ill_05_wire.png',
           data: null,
           x: 0,
           y: 65
        }
      }
    }
  }
  
var sprites_Data = { 
  'LeftNORM': {
    conus: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 80,
      yMax: 300
    },
    color: {
      r: '255',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  },
  'RightBAD': {
    conus: 1,
    start: {
      xMin: 310,
      xMax: 320,
      yMin: 180,
      yMax: 183,
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 110,
      yMax: 230 
    },
    color: {
      r: '255',
      g: '255',
      b: '255',
      opasity: 0.5
    }
  },
  'LeftCONUS': {
    conus: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 150,
      yMax: 205
    },
    color: {
      r: '255',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  },  
  'LeftCONUSred': {
      conus: 1,
      start: {
        xMin: -20,
        xMax: -10,
        yMin: 80,
        yMax: 300,
      },
      finish: {
        xMin: 160,
        xMax: 280,
        yMin: 150,
        yMax: 205
      },
      color: {
        r: '255',
        g: '0',
        b: '0',
        opasity: 1.0
      }
    },
    'LeftCONUSgreen': {
      conus: 1,
      start: {
        xMin: -20,
        xMax: -10,
        yMin: 80,
        yMax: 300,
      },
      finish: {
        xMin: 160,
        xMax: 280,
        yMin: 150,
        yMax: 205
      },
      color: {
        r: '0',
        g: '255',
        b: '0',
    opasity: 1.0
    }
  }, 
  'RightCONUS': {
    conus: 1,
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 150,
      yMax: 205
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: {
      r: '255',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  }, 
  'RightCONUSred': {
    conus: 1,
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 150,
      yMax: 205
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: {
      r: '255',
      g: '0',
      b: '0',
      opasity: 1.0
    }
  },
  'RightCONUSgreen': {
    conus: 1,
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 150,
      yMax: 205
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: {
      r: '0',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  },
  'RightCONUSSuperSpr': {
    conus: 1,
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 150,
      yMax: 205
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: {
      r: '0',
      g: '255',
      b: '255',
      opasity: 1.0
    }
  },
  'LeftCONUSSuperSpr': {
    conus: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 150,
      yMax: 205
    },
    color: {
      r: '0',
      g: '255',
      b: '255',
      opasity: 1.0
    }  
  },
  'TopCONUSSuperSpr': {
    conus: 1,
    start: {
      xMin: 300,
      xMax: 400,
      yMin: 200,
      yMax: 300,
    },
    finish: {
      xMin: 600,
      xMax: 600,
      yMin: 0,
      yMax: 600
    },
    color: {
      r: '0',
      g: '255',
      b: '255',
    opasity: 0.3
    }
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
      item.ctx.drawImage( item.imgs[ 'wire' ].data, item.imgs[ 'wire' ].x, item.imgs[ 'wire' ].y );
    }  
    item.ctx.globalCompositeOperation = 'destination-in';
    item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );  
  }
  
  
  
  /******************************************************************/
  
  function initSprites ( v ) {
    if ( v == 'dr01' ) {
      canvases[ v ].sprites.push( createDataSprites( 'TopCONUSSuperSpr', 30) )       
    }
    if ( v == 'dr02' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 70 ) )  
      canvases[ v ].sprites.push( createDataSprites( 'RightBAD', 10 ) )          
    }
    if ( v == 'dr03' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftCONUS', 70 ) )    
      canvases[ v ].sprites.push( createDataSprites( 'RightCONUS', 70 ) )    
    }
    if ( v == 'dr04' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftCONUS', 50 ) )        
      canvases[ v ].sprites.push( createDataSprites( 'LeftCONUSSuperSpr', 50 ) ) 
      canvases[ v ].sprites.push( createDataSprites( 'LeftCONUSgreen', 50 ) )  
      canvases[ v ].sprites.push( createDataSprites( 'RightCONUS', 50 ) )        
      canvases[ v ].sprites.push( createDataSprites( 'RightCONUSSuperSpr', 50 ) ) 
      canvases[ v ].sprites.push( createDataSprites( 'RightCONUSgreen', 50 ) )                   
    }
    if ( v == 'dr05' ) {
      canvases[ v ].sprites.push( createDataSprites( 'LeftCONUSSuperSpr', 300 ) )   
      canvases[ v ].sprites.push( createDataSprites( 'RightCONUSSuperSpr', 300 ) )            
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
    let time = Math.random() * 30 + 30; 
    s.type = name  
    s.x = Math.random() * ( _pro.start.xMax - _pro.start.xMin ) + _pro.start.xMin;
    s.y = Math.random() * ( _pro.start.yMax - _pro.start.yMin ) + _pro.start.yMin; 
    s.spdX = ( _pro.finish.xMin - s.x ) / time  
    s.spdY = ( (  _pro.finish.yMin - s.y ) + Math.random() * ( _pro.finish.yMax - _pro.finish.yMin ) * _pro.conus) / time //+  //( ( _pro.finish.yMax - _pro.finish.yMin ) / 2 + _pro.finish.yMin - s.y ) / time * _pro.conus
    s.color =  Object.assign( {}, _pro.color )
  }
  
  function updateSprites ( item ) {
    for ( let i = 0; i < item.sprites.length; i ++ ) {
      for ( let ii = 0; ii < item.sprites[ i ].length; ii ++ ) {
        drawSprite( item, item.sprites[ i ][ ii ] )
      }
    }
  }
  
  function drawSprite ( dataCan, sprite ) {
    let _pro = sprites_Data[ sprite.type ]
    if ( sprite.x > _pro.finish.xMin ) {
        setStartParams( sprite, sprite.type )
    }  
    sprite.x += sprite.spdX;
    sprite.y += sprite.spdY;
    dataCan.ctx.fillStyle =' rgba(' + sprite.color.r + ',' + sprite.color.g + ',' + sprite.color.b + ',' + sprite.color.opasity + ')'
    dataCan.ctx.fillRect( sprite.x, sprite.y, 10, 10  );
  }
  
  
  