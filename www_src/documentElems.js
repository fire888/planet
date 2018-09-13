

export { 
    setActionsResize,
    showCanvasWebGL, 
    hidePreloader, 
    setActionsWeel
}


/*******************************************************************/

let funcResizeCanvas

const setActionsResize = ( f ) => { 
    funcResizeCanvas = f 
    window.addEventListener( 'resize', handleWindowResize, false )
}

const handleWindowResize = () => { funcResizeCanvas() } 


/*******************************************************************/

const showCanvasWebGL = () => {
  let canvas = document.getElementById( 'webGL' )
  canvas.className = 'show'
}

const hidePreloader = () => {
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hide'
}


/*******************************************************************/

let funcWeelMouse 

const setActionsWeel = ( f ) => { 
    funcWeelMouse = f
    window.addEventListener( 'wheel', onMouseWheel, false )
    window.onscroll = () => { onMouseWheel() }    
}    

const onMouseWheel = () => {
  funcWeelMouse()
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hidden'
  setTimeout( () => { 
      let slogan = document.getElementById( 'slogan' )
      slogan.className = 'show' 
    }, 500 )  
  window.removeEventListener( 'wheel', onMouseWheel, false )
}