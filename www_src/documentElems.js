

export { 
  getParentContainerSize,
  setActionsWindowResize,
  setActionsMouseWheel,
  showCanvas, 
  hidePreloader
}


/*******************************************************************/

let onResize

const getParentContainerSize = () => {
  let parent = document.getElementById( 'app-webgl' )
  let w = parent.clientWidth || parent.offsetWidth;
  if ( w > window.innerWidth ) w = window.innerWidth
  return w
}

const setActionsWindowResize = ( f ) => { 
    onResize = f 
    window.addEventListener( 'resize', () => { onResize( getParentContainerSize() ) }, false )
}


/*******************************************************************/

let actionsMouseWheel

const setActionsMouseWheel = ( f ) => { 
  actionsMouseWheel = f
  document.addEventListener( 'wheel', onMouseWheel, false )
  document.addEventListener( 'scroll', onMouseWheel, false ) 
  document.addEventListener( 'touchstart', onMouseWheel, false)    
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
  document.removeEventListener( 'wheel', onMouseWheel, false )
  document.removeEventListener( 'scroll', onMouseWheel, false )
  document.removeEventListener( 'touchstart', onMouseWheel, false)
}


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


