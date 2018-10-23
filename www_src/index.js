


import * as APP_3D from './3D/main'
import * as C_2D from './2D/main' 

window.onload = () => {
  C_2D.InitStart( () => {
    APP_3D.loadAssets( () => {    
      APP_3D.initAPP( 
        { 
          canvas: document.getElementById( 'webgl' ), 
          w: window.innerWidth, 
          h: window.innerHeight
        },
        { 
          canvas:  document.getElementById( 'webgl_bottom' ),
          w: window.innerWidth,
          h: window.innerWidth * 0.5 
        }  
      )
      APP_3D.startAPP() 
      showElement( document.getElementById( 'webgl' ) )
      hideElement( document.getElementById( 'preloader' ) )
      setMouseWeel( APP_3D.onUserActionMouseWheel )   
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
          { w: window.innerWidth, h: window.innerWidth * 0.5 },  
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

const showElement = elem => elem.className = 'show'

const hideElement = elem => {
  elem.className = 'hide'
  setTimeout( () => { 
      elem.className = 'hidden'    
    }, 1000 )
}


