

export { 
  setActionsWindowResize,
  setActionsMouseWheel,
  showCanvas, 
  hidePreloader
}


/*******************************************************************/

let onResize

const setActionsWindowResize = ( f ) => { 
    onResize = f 
    window.addEventListener( 'resize', onResize, false )
}


/*******************************************************************/

let actionsMouseWheel

const setActionsMouseWheel = ( f ) => { 
  actionsMouseWheel = f
  window.addEventListener( 'wheel', onMouseWheel, false )
  window.addEventListener( 'scroll', onMouseWheel, false )    
}   

let onMouseWheel = () => {
  actionsMouseWheel()
  removeListenerMouseWheel()
  setTimeout( () => { 
      let slogan = document.getElementById( 'slogan' )
      slogan.className = 'show' 
    }, 500 )
}

const removeListenerMouseWheel = () => {
  window.removeEventListener( 'wheel', onMouseWheel, false )
  window.removeEventListener( 'scroll', onMouseWheel, false )
}


/*******************************************************************/

const showCanvas = () => {
  let canvas = document.getElementById( 'webGL' )
  canvas.className = 'show'
}

const hidePreloader = () => {
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hide'
  setTimeout( () => { 
      preloader.className = 'hidden'    
    }, 1000 )
}


