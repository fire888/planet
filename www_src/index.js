



/*******************************************************************/

let textureLoader,
textures = {
  sceneBack: null,
  waterNormals: null,
  continents: null
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
  .then( () => new Promise ( ( resolve ) => {
        textures.continents = textureLoader.load( 
            'assets/contour.jpg',
            () => { resolve() }
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
  pointL.position.set( 1000, 1000, 1000 )
  scene.add( pointL )
  let lightAmb = new THREE.AmbientLight( 0xffffff, 0.2 )
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
  window.addEventListener( 'resize', handleWindowResize, false )
} 

const handleWindowResize = () => {
  renderer.setSize( window.innerWidth, window.innerHeight )
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

const startCheckMouseWheell = () => window.addEventListener( 'wheel', onMouseWheel, false )

const onMouseWheel = () => {
  setSpeedEarthNormal()
  let preloader = document.getElementById( 'preloader' )
  preloader.className = 'hidden'
  setTimeout( () => { 
      let slogan = document.getElementById( 'slogan' )
      slogan.className = 'show' 
    }, 500 )  
  window.removeEventListener( 'wheel', onMouseWheel, false )
}




/********************************************************************/

let earth, globeMesh, continentsMesh

const createEarth = () => {
  earth = new THREE.Group()
  globeMesh = createGlobe() 
  earth.add( globeMesh )
  continentsMesh = createContinents() 
  earth.add( continentsMesh )
  scene.add( earth )
}

const createGlobe = () => {
  return new THREE.Mesh( 
    new THREE.SphereGeometry( 600, 40, 40 ),
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

const createContinents = () => {
  let mesh =  new THREE.Mesh( 
    new THREE.SphereGeometry( 608, 40, 40 ),
    new THREE.ShaderMaterial( continentsShader )
  )  
  mesh.rotation.z = -0.5
  mesh.rotation.x = -0.5
  mesh.material.transparent = true
  mesh.material.side = THREE.DoubleSide
  mesh.material.depthWrite = false
  mesh.material.needsUpdate = true
  mesh.material.uniforms.tDiffuse.value = textures.continents
  return mesh
}


let earthSpd = 0.002, 
earthDir = 'left' // || 'right' || 'normal'  

const updateAnimationEarth = () => {
  if ( ! earth ) return
  if ( earthSpd > 0.005 && earthDir == 'left' ) earthDir = 'right' 
  if ( earthSpd < -0.005 && earthDir == 'right' ) earthDir = 'left'  
  if ( earthDir == 'left' ) earthSpd += 0.0001
  if ( earthDir == 'right') earthSpd -= 0.0001
  if ( earthDir == 'normal' && earthSpd < 0.02 ) { 
    if ( continentsMesh.material.uniforms.light.value < 1.35 ) {
      continentsMesh.material.uniforms.light.value += 0.012
      globeMesh.material.opacity -= 0.0005
      globeMesh.material.needsUpdate = true
    }  
    earthSpd += 0.00005
  }   
  earth.rotation.y += earthSpd
}

const setSpeedEarthNormal = () => earthDir = 'normal'





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




/*******************************************************************/
/*******************************************************************/
/*******************************************************************/

const continentsShader = {
  uniforms: {		
    'tDiffuse' : { value: null },
    'light': { value: 0.2 },       	
  },
  vertexShader: [	
    'varying vec2 vUv;',
	
    'void main() {',
      'vUv = uv;',
       'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join( '\n' ),	
  fragmentShader: [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',

    'uniform highp sampler2D tDiffuse;', 
    'uniform float light;', 

    'varying vec2 vUv;',

    'void main() {',	
      'vec2 uv = vUv;',

      "vec4 diff = texture2D(tDiffuse, uv);",
      "vec4 cont = vec4( 0.7*light, 0.7*light, 1.0*light,  diff.x*light*1.3 );",
      "vec4 ground = vec4( 0.01*light-0.5, 0.01*light-0.5, 0.6*light,  (1.0 - diff.y)*light*0.6 );",

      "gl_FragColor = cont + ground;",
    '}'
  ].join( "\n" )
}




