


import * as APP_3D from './3D/main'
import * as C_2D from './2D/main'

const startTime = new Date().getTime()

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
      checkStartingTimeAndStart()
    } )    
  } )
}

const checkStartingTimeAndStart = () => {
  let loadingTime = new Date().getTime() - startTime
  loadingTime < 1500 ? setTimeout( startApp, 1500 - loadingTime ) : startApp()
}

const startApp = () => {
  APP_3D.startAPP() 
  showElement( document.getElementById( 'webgl' ) )
  hideElement( document.getElementById( 'preloader' ) )
  setMouseWeel( APP_3D.startFlashTopCanvas )  
  APP_3D.setOnBottomAnimationDone( showBottomBlock )  
  setWindowResize( APP_3D.resizeCanvas )
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
        resizeIcons()
      }, false )
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let actionMouseWheel

const setMouseWeel = f => {
  actionMouseWheel = f
  document.addEventListener( 'wheel', onMouseWheel, false )
  document.addEventListener( 'scroll', onMouseWheel, false ) 
  document.addEventListener( 'touchstart', onMouseWheel, false) 
  setTimeout( () => { 
      document.body.style.position = 'static'
      document.body.style.overflowY = 'auto'    
    }, 4000 ) 
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

let icons
const initBottomHTML = () => { 
  icons = document.getElementById( 'icons' )
  resizeIcons()
}  

const resizeIcons = () => {
  if ( ! icons ) return
  if ( window.innerWidth/window.innerHeight < 1.3 ) {
    icons.style.width = window.innerWidth * 0.9 + 'px'  
    icons.style.height = 'auto'
  } else {
    icons.style.height = window.innerHeight * 0.9 + 'px'  
    icons.style.width = 'auto'     
  } 
}

const showBottomBlock = () => {
  let bottomBlock = document.getElementById( 'bottom-scheme' )
  bottomBlock.className = 'show'
  bottomBlock.style.display = 'flex'
} 


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

const showElement = elem => elem.className = 'show'

const hideElement = elem => {
  elem.className = 'hide'
}


