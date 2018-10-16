


import { CANVASES } from './data-canvases'
import { sprites_TYPES } from './data-spritesTypes'
import { sprites_Imgs } from './data-spritesImgs'

export { InitStart }


    
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  
let actionsLoad = [], loaded = 0
  
const InitStart = onStart => {
  loadAssetsImgs( function () {
    initCanvases( CANVASES )
    startAnimationCanvases()
    onStart()
  } )
}
  

    
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  
const loadAssetsImgs = onloadAll => {
  for ( let key in CANVASES ) {
    for  ( let keyNameImg in CANVASES[ key ].imgs ) {
      actionsLoad.push( createActionLoadImg( CANVASES[ key ].imgs[ keyNameImg ] ) )
    }    
  }
  for ( let img in sprites_Imgs ) {
    actionsLoad.push( createActionLoadImg( sprites_Imgs[ img ] ) )
  }
  actionsLoad.push( onloadAll )
  actionsLoad[ 0 ]() 
}

const createActionLoadImg = ( img ) => {
  let action = () => {
    img.data = new Image()
    img.data.src = img.src
    img.data.onload = () => {
      actionsLoad[ loaded ++ ]()    
    }
  }  
  return action
}
 


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

const initCanvases = canvases => {
  for ( let key in canvases ) {
    canvases[ key ].canvas = document.getElementById( key )
    canvases[ key ].ctx = canvases[ key ].canvas.getContext('2d')
    initSprites( canvases[ key ] )
  }
}

const initSprites = canvas => {
  canvas.sprites_types.forEach( item => {
    canvas.sprites.push( createDataSprites( item.type, item.count) )
  })
}
  
const createDataSprites = ( sprite_type, count ) =>  {
  var arr = []
  for ( var i = 0; i < count; i ++ ) {
    let newSprite = {}
    setStartParamsSprite( newSprite, sprite_type )
    arr.push( newSprite )
  }
  return arr
}

const setStartParamsSprite = ( s, type ) => {
  var _pro = sprites_TYPES[ type ]
  let time = Math.random() * 30 + 30 
  s.type = type
  s.x = Math.random() * ( _pro.start.xMax - _pro.start.xMin ) + _pro.start.xMin
  s.y = Math.random() * ( _pro.start.yMax - _pro.start.yMin ) + _pro.start.yMin 
  s.spdX = ( _pro.finish.xMin - s.x ) / time * _pro.spd 
  s.spdY = ( (  _pro.finish.yMin - s.y ) + Math.random() * ( _pro.finish.yMax - _pro.finish.yMin ) * _pro.conus) / time * _pro.spd
}




/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let interval 
  
const startAnimationCanvases = () => {
  interval = setInterval( drawFrameCanvases, 30 )
}
  
const drawFrameCanvases = () => {
  for ( let key in CANVASES ) {
    if ( checkVisible( CANVASES[ key ].canvas ) )
      updateCanvas( CANVASES[ key ] )
  }
}

const checkVisible = elm  => {
  let rect = elm.getBoundingClientRect()
  let viewHeight = Math.max( document.documentElement.clientHeight, window.innerHeight )
  return ! ( rect.bottom < 0 || rect.top - viewHeight >= 0 )
}
  
const updateCanvas = item => {
  item.ctx.clearRect( 0, 0, item.canvas.width, item.canvas.height )
  item.ctx.globalCompositeOperation = 'source-over'
  item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height )
  updateSprites( item )
  if ( item.imgs[ 'wire' ] ) 
    item.ctx.drawImage( item.imgs[ 'wire' ].data, item.imgs[ 'wire' ].x, item.imgs[ 'wire' ].y, item.imgs[ 'wire' ].x2, item.imgs[ 'wire' ].y2, )
  item.ctx.globalCompositeOperation = 'destination-in'
  item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height ) 
}

const updateSprites = can => {
  for ( let i = 0; i < can.sprites.length; i ++ ) {
    for ( let ii = 0; ii < can.sprites[ i ].length; ii ++ ) {
      drawSprite( can.ctx, can.sprites[ i ][ ii ] )
    }
  }
}
  
const drawSprite = ( ctx, sprite ) => {
  let _pro = sprites_TYPES[ sprite.type ]
  if ( sprite.x > _pro.finish.xMin ) setStartParamsSprite( sprite, sprite.type )
  /* exeption .. :( ******/ 
  if ( sprite.type == 'LinesHor' && sprite.y < _pro.finish.yMin ) setStartParamsSprite( sprite, sprite.type )
  /***********************/ 
  sprite.x += sprite.spdX
  sprite.y += sprite.spdY
  if ( _pro.img ) { 
    ctx.drawImage( sprites_Imgs[ _pro.img ].data, sprite.x, sprite.y )  
    return
  }
  if ( _pro.color ) {
    ctx.fillStyle = sprites_TYPES[ sprite.type ].color 
    ctx.fillRect( sprite.x, sprite.y, 7, 7 )
    return
  }  
}
   

  