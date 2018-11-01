


import * as APP_3D from './3D/main'
import * as C_2D from './2D/main' 

window.onload = () => {
  initBottomHTML()
  C_2D.InitStart( () => {
    APP_3D.loadAssets( () => {    
      APP_3D.initAPP( 
        { 
          canvas: document.getElementById( 'webgl' ), 
          w: window.innerWidth, 
          h: window.innerHeight
        },
        { 
          canvas:  document.getElementById( 'webgl-bottom' ),
          w: window.innerWidth,
          h: window.innerHeight
        }  
      )
      APP_3D.startAPP() 
      showElement( document.getElementById( 'webgl' ) )
      hideElement( document.getElementById( 'preloader' ) )
      setMouseWeel( APP_3D.onUserActionMouseWheel )
      APP_3D.setScrolltoBottom( checkScrolledToBottomCanvas )   
      APP_3D.setOnBottomAnimationStart( fixScroll )   
      APP_3D.setOnBottomAnimationDone( showBottomBlock )  
      setWindowResize( APP_3D.resizeCanvas )
    } )    
  } )
}



/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let onResize

const setWindowResize = f => { 
    onResize = f 
    window.addEventListener( 'resize', () => { 
        onResize( 
          { w: window.innerWidth, h: window.innerHeight },  
          { w: window.innerWidth, h: window.innerHeight },  
         ) 
      }, false )
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let actionMouseWheel

const setMouseWeel = f => { 
  actionMouseWheel = f
  document.addEventListener( 'wheel', onMouseWheel, false )
  document.addEventListener( 'scroll', onMouseWheel, false ) 
  document.addEventListener( 'touchstart', onMouseWheel, false)    
}   

const removeListenerMouseWheel = () => {
  document.removeEventListener( 'wheel', onMouseWheel, false )
  document.removeEventListener( 'scroll', onMouseWheel, false )
  document.removeEventListener( 'touchstart', onMouseWheel, false)
}

let onMouseWheel = () => {
  actionMouseWheel()
  removeListenerMouseWheel()
  setTimeout( () => { 
      let slogan = document.getElementById( 'slogan' )
      slogan.className = 'show' 
    }, 500 )
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

let bottomCanvas, bottomCanvasPositionY

const initBottomHTML = () => {
  bottomCanvas = document.getElementById( 'webgl-bottom' )
  bottomCanvasPositionY = bottomCanvas.offsetTop
} 

const showBottomBlock = () => {
  let bottomBlock = document.getElementById( 'bottom-scheme' )
  bottomBlock.className = 'show'
  console.log( 'show' )
  unfixScroll()
} 

const checkScrolledToBottomCanvas = () => {
  let posY = window.pageYOffset 
  if ( posY > bottomCanvasPositionY + window.innerHeight ) { fixScroll() }
}

const fixScroll = () => {
  let posY = window.pageYOffset
  document.body.style.position = 'fixed'
  document.body.style.top = -posY - window.innerHeight + 'px'
}

const unfixScroll = () => {
  document.body.style.position = 'static'
  window.scrollTo( 0, bottomCanvasPositionY)
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

const showElement = elem => elem.className = 'show'

const hideElement = elem => {
  elem.className = 'hide'
  setTimeout( () => { 
      elem.className = 'hidden'    
    }, 1000 )
}


