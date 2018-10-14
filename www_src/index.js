

import * as SC from './3D/main'
import * as ILLS from './2D/main' 


/*******************************************************************/
/*******************************************************************/

window.onload = () => {
  ILLS.InitStart( () => {
      let windowW = window.innerWidth
      SC.setCanvases( 
          document.getElementById( 'webgl' ), 
          document.getElementById( 'webgl_bottom' ) 
        )  
      SC.loadAssets( () => {
          SC.init( windowW )
          SC.start() 
          showCanvas()
          hidePreloader()
          setMouseWeel( SC.onUserActionMouseWheel )   
          setWindowResize( SC.resizeCanvas )
        } )    
    } )
}



/*******************************************************************/
/*******************************************************************/

let onResize

const setWindowResize = ( f ) => { 
    onResize = f 
    window.addEventListener( 'resize', () => { onResize( window.innerWidth ) }, false )
}



/*******************************************************************/
/*******************************************************************/

let actionMouseWheel

const setMouseWeel = ( f ) => { 
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



/*******************************************************************/
/*******************************************************************/

const showCanvas = () => {
  let canvas = document.getElementById( 'webgl' )
  canvas.className = 'show'
}

const hidePreloader = () => {
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hide'
  setTimeout( () => { 
      preloader.className = 'hidden'    
    }, 1000 )
}


