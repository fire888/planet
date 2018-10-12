


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

loadAssetsImgs( function () {
  initCanvases();
  startAnimationCanvases();
} );

var interval 

function startAnimationCanvases() {
  interval = setInterval( drawFrame, 30 )
}

function drawFrame() {
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




/*****************************************************************/
/******                *******************************************/
/******     TRESH      *******************************************/
/******                *******************************************/
/*****************************************************************/
/*****************************************************************/
/*****************************************************************/
/*****************************************************************/
/*****************************************************************/
/*****************************************************************/


/*
initCanvas();
initBackImg( onloadBack );
function onloadBack () {
  initWireImg( onloadWire );  
}
function onloadWire () {
  initWireImgBlur( onloadWireBlur )
}
function onloadWireBlur() {
  initSpritesLeft();
  initSpritesRight();
  startAnimationApp();
}
*/

/*******************************************************************

var interval 

function startAnimationApp () {
  interval = setInterval( updateFrame, 15 );       
}

function updateFrame () {
  clearCanvas();
  ctx.globalCompositeOperation = 'source-over';
  drawBackImg();
  drawWireImg();
  drawLeftSprite();
  drawRightSprite();
  ctx.globalCompositeOperation = 'destination-in';
  drawBackImg();
}



/*******************************************************************

var canvas;
var canW;
var canH;
var ctx;
var base_image;
var mask_image;
var wire_image;

function initCanvas () {
  canvas = document.getElementById('dr02');
  canW = canvas.width;
  canH = canvas.height;
  ctx = canvas.getContext('2d');
}

function clearCanvas () {
  ctx.clearRect( 0, 0, canW, canH )
}

function initBackImg ( on )  {
  base_image = new Image();
  base_image.src = 'assets/ill_02_back.png';
  base_image.onload = function () {
    on();
  }
}

function initWireImg ( on ) {
  wire_image = new Image();
  wire_image.src = 'assets/wire01.png';
  wire_image.onload = function () {
    on();
  }
}

function initWireImgBlur ( on ) {
  wireBlur_image = new Image();
  wireBlur_image.src = 'assets/wire01_blur.png';
  wireBlur_image.onload = function () {
    on();
  }
}

function drawWireImg () {
  ctx.drawImage( wireBlur_image, 160, 170 );  
  ctx.drawImage( wire_image, 160, 170 );  
}


function drawBackImg () {
  ctx.drawImage( base_image, 0, 0, 600, 500 );
}




/******************************************************************

var arrSpritesLeft = [];

var spriteAxisY = 200;
var spriteEndX = 180;
var sprite_proto = {
  x: 100,
  y: spriteAxisY,
  w: 20,
  h: 20,
  spdX: 0.7,
  spdY: 1,
  opacity: 1.0  
};

function initSpritesLeft () {
  for ( var i = 0; i < 30; i ++ ) {  
    var square = createSpriteLeft() 
    arrSpritesLeft.push( square )
  }
}

function createSpriteLeft() {
  var time = Math.random() * 30 + 30;  
  var spdX = spriteEndX / time;
  var y = Math.random() * 200 - 100 + spriteAxisY; 
  var spdY = ( spriteAxisY - y ) / time;
  var s = {
    x: 0,
    y: y,
    spdX: spdX,
    spdY: spdY   
  }  
  return Object.assign( {}, sprite_proto, s )
}

function drawLeftSprite () {
  for ( var i = 0; i < arrSpritesLeft.length; i ++ ) {
    ctx.fillStyle = "rgba(255, 255, 0," +  arrSpritesLeft[ i ].opacity + ")";
    ctx.fillRect( arrSpritesLeft[ i ].x, arrSpritesLeft[ i ].y, arrSpritesLeft[ i ].w , arrSpritesLeft[ i ].h  );
    arrSpritesLeft[ i ].x += arrSpritesLeft[ i ].spdX
    if ( arrSpritesLeft[ i ].x > spriteEndX ) {
      if ( arrSpritesLeft[ i ].y > 150 && arrSpritesLeft[ i ].y < 230 ) {
        arrSpritesLeft.splice( i, 1 );
        i--;  
        arrSpritesLeft.push( createSpriteLeft() )
      } else {
        arrSpritesLeft[ i ].opacity -= 0.05
        if ( arrSpritesLeft[ i ].x > 280 ) {
          arrSpritesLeft.splice( i, 1 );
          i--;  
          arrSpritesLeft.push( createSpriteLeft() )
        }
      }  
    }     
  }
}



/******************************************************************

var arrSpritesRight = [];

var spriteRAxisY = 200;
var spriteRStartX = 390;
var spriteR_proto = {
  x: spriteRStartX,
  y: spriteRAxisY,
  w: 10,
  h: 10,
  spdX: 1,
  spdY: 1  
};

function initSpritesRight () {
  for ( var i = 0; i < 30; i ++ ) {  
    var square = createSpriteRight() 
    arrSpritesRight.push( square )
  }
}

function createSpriteRight() {
  var time = Math.random() * 20 + 20;  
  var spdX = 200 / time;
  var y = spriteRAxisY + Math.random()*40 - 20; 
  var spdY =  ( Math.random() * 600 - 300 ) / time ;
  var s = {
    x: spriteRStartX,
    y: y,
    spdX: spdX,
    spdY: spdY   
  }  
  return Object.assign( {}, spriteR_proto, s )
}

function drawRightSprite () {
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
  for ( var i = 0; i < arrSpritesRight.length; i ++ ) {
    if ( arrSpritesRight[ i ].x > 800 ) {
      arrSpritesRight.splice( i, 1 );
      i--;  
      arrSpritesRight.push( createSpriteRight() ) 
    } else {
      arrSpritesRight[ i ].x += arrSpritesRight[ i ].spdX
      //arrSpritesRight[ i ].y += arrSpritesRight[ i ].spdY
      arrSpritesRight[ i ].h += 0.3
      arrSpritesRight[ i ].w += 0.3      
      ctx.fillRect( arrSpritesRight[ i ].x, arrSpritesRight[ i ].y, arrSpritesRight[ i ].w , arrSpritesRight[ i ].h  );
    }  
  }
}


*/
