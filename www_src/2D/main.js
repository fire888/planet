

import { CANVASES, sprites_TYPES, sprites_Imgs } from './data'

export { InitStart }


    
/*******************************************************************/
  
var actionsLoad = [], loaded = 0
  
function InitStart ( on ) {
  loadAssetsImgs( function () {
    initCanvases( CANVASES );
    startAnimationCanvases();
    on();
  } );
}
  
var interval 
  
function startAnimationCanvases() {
  interval = setInterval( drawFrameCanvases, 30 )
}
  
function drawFrameCanvases() {
  for ( let key in CANVASES ) {
    if ( checkVisible( CANVASES[ key ].canvas ) )
    updateCanvas( CANVASES[ key ] )
  }
}

function checkVisible( elm ) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
  
  
  
/*******************************************************************/
  
function loadAssetsImgs ( onload ) {
  for ( let key in CANVASES ) {
    for  ( let keyNameImg in CANVASES[ key ].imgs ) {
      actionsLoad.push( function() {
        CANVASES[ key ].imgs[ keyNameImg ].data = new Image();
        CANVASES[ key ].imgs[ keyNameImg ].data.src = CANVASES[ key ].imgs[ keyNameImg ].src;
        CANVASES[ key ].imgs[ keyNameImg ].data.onload = function () {
          loaded ++
          actionsLoad[ loaded ]()
        } 
      } )     
    }    
  }
  for ( let img in sprites_Imgs ) {
    actionsLoad.push( function() {
      sprites_Imgs[ img ].data = new Image();
      sprites_Imgs[ img ].data.src = sprites_Imgs[ img ].src
      sprites_Imgs[ img ].data.onload = function () {
        loaded ++
        actionsLoad[ loaded ]()
      }
    } )
  }
  actionsLoad.push( function() { onload() } )
  actionsLoad[ 0 ]() 
}
 


/*******************************************************************/

function initCanvases( canvases ) {
  for ( let key in canvases ) {
    canvases[ key ].canvas = document.getElementById( key );
    canvases[ key ].ctx = canvases[ key ].canvas.getContext('2d'); 
    initSprites( key, canvases[ key ] );
  }
}

function initSprites ( id, canvas ) {
  if ( id == 'dr01' ) {
    canvas.sprites.push( createDataSprites( 'LinesVert', 5 ) )   
    canvas.sprites.push( createDataSprites( 'LinesHor', 2 ) )      
  }
  if ( id == 'dr02' ) {
    canvas.sprites.push( createDataSprites( 'LeftNORMslow', 70 ) )  
    canvas.sprites.push( createDataSprites( 'RightBAD', 10 ) )          
  }
  if ( id == 'dr03' ) {
    canvas.sprites.push( createDataSprites( 'LeftCONUS', 70 ) )    
    canvas.sprites.push( createDataSprites( 'RightCONUS', 70 ) )    
  }
  if ( id == 'dr04' ) {
    canvas.sprites.push( createDataSprites( 'LeftCONUS', 50 ) )        
    canvas.sprites.push( createDataSprites( 'LeftCONUSred', 50 ) ) 
    canvas.sprites.push( createDataSprites( 'LeftCONUSgreen', 50 ) )  
    canvas.sprites.push( createDataSprites( 'RightCONUS', 50 ) )        
    canvas.sprites.push( createDataSprites( 'RightCONUSred', 50 ) ) 
    canvas.sprites.push( createDataSprites( 'RightCONUSgreen', 50 ) )                   
  }
  if ( id == 'dr05' ) {
    canvas.sprites.push( createDataSprites( 'LeftCONUSSuperSprT', 70 ) ) 
    canvas.sprites.push( createDataSprites( 'LeftCONUSSuperSprB', 70 ) )     
    canvas.sprites.push( createDataSprites( 'RightCONUSSuperSprT', 70 ) )   
    canvas.sprites.push( createDataSprites( 'RightCONUSSuperSprB', 70 ) )          
  }
}
  
function createDataSprites ( sprite_type, count ) {
  var arr = []
  for ( var i = 0; i < count; i ++ ) {
    let newSprite = {}
    setStartParamsSprite( newSprite, sprite_type )
    arr.push( newSprite )
  }
  return arr
}

function setStartParamsSprite( s, type ) {
  var _pro = sprites_TYPES[ type ]
  let time = Math.random() * 30 + 30; 
  s.type = type
  s.x = Math.random() * ( _pro.start.xMax - _pro.start.xMin ) + _pro.start.xMin;
  s.y = Math.random() * ( _pro.start.yMax - _pro.start.yMin ) + _pro.start.yMin; 
  s.spdX = ( _pro.finish.xMin - s.x ) / time * _pro.spd 
  s.spdY = ( (  _pro.finish.yMin - s.y ) + Math.random() * ( _pro.finish.yMax - _pro.finish.yMin ) * _pro.conus) / time * _pro.spd
  //s.color = _pro.color
}



/*****************************************************************/  
  
function updateCanvas ( item ) {

  item.ctx.clearRect( 0, 0, item.canvas.width, item.canvas.height )
  item.ctx.globalCompositeOperation = 'source-over';
  item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );
  updateSprites( item )
  if ( item.imgs[ 'wire' ] ) 
    item.ctx.drawImage( item.imgs[ 'wire' ].data, item.imgs[ 'wire' ].x, item.imgs[ 'wire' ].y, item.imgs[ 'wire' ].x2, item.imgs[ 'wire' ].y2, );    
  item.ctx.globalCompositeOperation = 'destination-in';
  item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );  
}

function updateSprites ( can ) {
  for ( let i = 0; i < can.sprites.length; i ++ ) {
    for ( let ii = 0; ii < can.sprites[ i ].length; ii ++ ) {
      drawSprite( can.ctx, can.sprites[ i ][ ii ] )
    }
  }
}
  
function drawSprite ( ctx, sprite ) {
  let _pro = sprites_TYPES[ sprite.type ]
  if ( sprite.x > _pro.finish.xMin ) setStartParamsSprite( sprite, sprite.type )
  /*exeption ..:( */ 
  if ( sprite.type == 'LinesHor' && sprite.y < _pro.finish.yMin ) setStartParamsSprite( sprite, sprite.type )
  /****************/ 
  sprite.x += sprite.spdX;
  sprite.y += sprite.spdY;
  if (  sprite.type == "LinesVert" || sprite.type == "LinesHor"  ) {
    ctx.drawImage( sprites_Imgs[ sprite.type ].data, sprite.x, sprite.y )  
    return
  }
  ctx.fillStyle = sprites_TYPES[ sprite.type ].color; 
  ctx.fillRect( sprite.x, sprite.y, 7, 7 );
}
   


  