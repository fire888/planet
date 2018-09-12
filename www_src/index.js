

let textureLoader,
textures = {
  sceneBack: null,
  waterNormals: null
}


const loadAssets = ( onLoad ) => {
  textureLoader = new THREE.TextureLoader()
  new Promise ( ( resolve ) => {
        textures.sceneBack = textureLoader.load( 
            'assets/background_map.jpg',
            () => { resolve() }
        )			
  })
  .then( () => new Promise ( ( resolve ) => {
        textures.waterNormals = textureLoader.load( 
            'assets/Voda_normali.jpg',
            () => { 
              textures.waterNormals.wrapS = textures.waterNormals.wrapT = THREE.RepeatWrapping
              textures.waterNormals.repeat.set( 5.0, 5.0 )              
              resolve() 
            }
        )	
  }) )
  .then( () => { 
    textureLoader = null
    onLoad() } 
  )      
}


/*******************************************************************/

let scene, camera, renderer


const initScene = () => {
  scene = new THREE.Scene()
  scene.background = textures.sceneBack

  camera = new THREE.PerspectiveCamera( 75,	window.innerWidth / window.innerHeight, 3.5, 15000 )
  camera.position.set( -800, 0, 1800 )   

  let pointL = new THREE.PointLight( 0xffffff, 2.0 )
  pointL.position.set( -400, 1000, 1600 )
  scene.add( pointL )
  let lightAmb = new THREE.AmbientLight( 0xffffff, 0.5 )
  scene.add( lightAmb )

  renderer = new THREE.WebGLRenderer( { alpha: true, canvas: document.getElementById( 'webGL' ) } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )	
}
  
  
const drawFrame = () => {  
  updateAnimationEarth()
  renderer.render( scene, camera )
  requestAnimationFrame( drawFrame ) 
}


/*******************************************************************/

const addOnWindowResize = () => {
  window.addEventListener('resize', handleWindowResize, false)
} 


const handleWindowResize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
}


const showCanvasWebGL = () => {
  let canvas = document.getElementById( 'webGL' )
  canvas.className = 'show'
}


const hidePreloader = () => {
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hide'
}


const startCheckMouseWheell = () => {
	window.addEventListener( 'wheel', onMouseWheel, false )
} 


const onMouseWheel = () => {
  setSpeedEarthNormal()
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hidden'
  let slogan = document.getElementById( 'slogan' )
  setTimeout( () => { slogan.className = 'show' }, 500 )  
  window.removeEventListener('wheel', onMouseWheel, false)
}


/********************************************************************/

let earth


const createEarth = () => {
  earth = new THREE.Group()
  earth.add( createGlobe() )
  scene.add( earth )
}

const createGlobe = () => {
  return new THREE.Mesh( 
    new THREE.SphereGeometry( 600, 30, 30 ),
    new THREE.MeshPhongMaterial( {
      map: textures.waterNormals,
      normalMap: textures.waterNormals,
      shininess: 0.0,
      transparent: true,
      opacity: 0.94,
      color: 0x1F2A44,
    } )
  )
}


let earthSpd = 0.002, 
earthDir = 'left' // || 'right' || 'normal'  


const updateAnimationEarth = () => {
  if ( ! earth ) return

  if ( earthSpd > 0.005 && earthDir == 'left' ) earthDir = 'right' 
  if ( earthSpd < -0.005 && earthDir == 'right' ) earthDir = 'left'  
  if ( earthDir == 'left' ) earthSpd += 0.0001
  if ( earthDir == 'right') earthSpd -= 0.0001
  if ( earthDir == 'normal' && earthSpd < 0.02 ) earthSpd += 0.0001 
  
  earth.rotation.y += earthSpd
  earth.rotation.z += earthSpd*0.2
}

const setSpeedEarthNormal = () => {
  earthDir = 'normal'
}  


/******************************************************************/

window.onload = () => {
  loadAssets( () => { 
    initScene()
    addOnWindowResize()
    createEarth()
    drawFrame()
    showCanvasWebGL()
    hidePreloader()
    startCheckMouseWheell()   
  } )
}  


