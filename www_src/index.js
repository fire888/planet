

let textureLoader,
scene, camera, renderer,
earth,
textures = {
  sceneBack: null,
  waterNormals: null
}



/********************************************************************/

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
  .then( () => { onLoad() } )      
}





/*******************************************************************/

const initScene = () => {
  scene = new THREE.Scene()
  scene.background = textures.sceneBack

  camera = new THREE.PerspectiveCamera( 75,	window.innerWidth / window.innerHeight, 3.5, 15000 )
  camera.position.set( -800, 0, 1800 )
  //camera.lookAt( scene.position )   

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


const showCanvasWebGL = () => {
  let canvas = document.getElementById( 'webGL' )
  canvas.className = 'show'
}


const hidePreloader = () => {
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hide'
}

const startCheckMouseWheell = () => {
	window.addEventListener( 'wheel', onMouseWheel, false );
} 

const onMouseWheel = () => {
  earthDir = 'normal'
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hidden'
  let slogan = document.getElementById( 'slogan' )
  setTimeout( () => { slogan.className = 'show' }, 500 )  
  window.removeEventListener('wheel', onMouseWheel, false);
}




/********************************************************************/

const createEarth = () => {
  earth = new THREE.Group()
  earth.add( createGlobe() )
  scene.add( earth )
}

const createGlobe = () => {
  let globe =  new THREE.Mesh( 
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
  return globe
}

/*
const earthContourShadow = () => {
  let g = new THREE.SphereGeometry( 603, 30, 30 )
  let m = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load( 'assets/EarthMap_transparent.png' ),
    side: THREE.DoubleSide,
    shininess: 0.0,
    transparent: true,
    opacity: 1.0,
    color: 0x000000,
    emissive: 0x000000,
    specular: 0x000000,
  })
  return new THREE.Mesh(g, m)  
}


const clouds = () => {
  let mt = textureCloads
  let mta = textureCloads
  let g = new THREE.SphereGeometry(603, 50, 50, 0, 2*Math.PI, 0, Math.PI)
  let m = new THREE.MeshLambertMaterial({
    map: mt,
    alphaMap: mta,
    blending: 1,
    side: THREE.DoubleSide,
    transparent:true,
    opacity: 0.5,
    color: 0x000000,
    emissive: 0x000000,
  });
  return new THREE.Mesh(g, m);
}


const cloudsShadow = () => {
  let mt = textureCloads
  let mta = textureCloads
  let g = new THREE.SphereGeometry(618, 500, 500, 0, 2*Math.PI, 0, Math.PI)
  let m = new THREE.MeshLambertMaterial({
    map: mt,
    alphaMap: mta,
    blending: 2,
    side: THREE.DoubleSide,
    transparent:true,
    opacity: 0.6,
    color: 0x505050,
    emissive: 0x090909
  })
  m.map.generateMipalphaMaps = false;
  m.map.magFilter = THREE.LinearFilter;
  m.map.minFilter = THREE.LinearFilter;
  m.needsUpdate = true;
  m.fog = false;
  return new THREE.Mesh(g, m);
}

*/
/******************************************************************/

let earthSpd = 0.002, earthDir = 'left' // || 'right' || 'normal'  

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

/******************************************************************/

window.onload = () => {
  loadAssets( () => { 
    initScene()
    createEarth()
    drawFrame()
    showCanvasWebGL()
    hidePreloader()
    startCheckMouseWheell()   
  } )
}  


