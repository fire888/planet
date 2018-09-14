

import * as SHADERS from "./Shaders.js"
import * as DOC_ELEMS from "./DocumentElems.js"

window.onload = () => {
  loadAssets( () => { 
    initScene()
    DOC_ELEMS.setActionsWindowResize( resizeCanvas )
    createEarth()
    createConnectors()
    drawFrame()
    DOC_ELEMS.showCanvas()
    DOC_ELEMS.hidePreloader()
    DOC_ELEMS.setActionsMouseWheel( onUserActionMouseWheel )   
  } )
}




/*******************************************************************/
/*******************************************************************/

let APP_STATE = 'DARK' // || 'FLASH' || 'LIGHT'

const onUserActionMouseWheel = () => APP_STATE = 'FLASH'

const animateAllObjects = () => {
  if ( APP_STATE == 'FLASH') {
    if ( checkEarthStateLight() && checkConnectorsStateLight() ) APP_STATE = 'LIGHT'
  }    
  animateEarth( APP_STATE )
  animateConnectors( APP_STATE )
}




/*******************************************************************/
/*******************************************************************/

let textureLoader, objectLoader

const ASSETS = { 
  textures: {
    sceneBack: null,
    waterNormals: null,
    continents: null
  },
  geoms: {
    corpus: null,
    diod: null
  }
}  

const loadAssets = ( onLoad ) => {
  textureLoader = new THREE.TextureLoader()
  objectLoader = new THREE.OBJLoader()
  new Promise ( ( resolve ) => {
        ASSETS.textures.sceneBack = textureLoader.load( 
            'assets/background_map.jpg',
            () => { resolve() }
        )			
  })
  .then( () => new Promise ( ( resolve ) => {
        ASSETS.textures.waterNormals = textureLoader.load( 
            'assets/Voda_normali.jpg',
            ( texture ) => { 
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping
              texture.repeat.set( 5.0, 5.0 )              
              resolve() 
            }
        )	
  }) )
  .then( () => new Promise ( ( resolve ) => {
        ASSETS.textures.continents = textureLoader.load( 
            'assets/contour.jpg',
            () => { resolve() }
        )	
  }) )
  .then( () => new Promise ( ( resolve ) => {
        objectLoader.load( 
            'assets/connector.obj', 
            ( obj ) => {
                obj.traverse( ( child ) => {
                  if ( child instanceof THREE.Mesh != true ) return
                  if ( child.name == 'diod' ) ASSETS.geoms.diod = child.geometry
                  if ( child.name == 'iron' ) ASSETS.geoms.corpus = child.geometry 
                  if ( ASSETS.geoms.diod && ASSETS.geoms.corpus ) resolve() 
                })  
            } 
        )
  }) )  
  .then( () => { 
    textureLoader = null
    objectLoader = null
    onLoad() } 
  )      
}




/*******************************************************************/
/*******************************************************************/

let scene, camera, renderer

const initScene = () => {
  renderer = new THREE.WebGLRenderer( { alpha: true, canvas: document.getElementById( 'webGL' ) } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )	
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 3.5, 15000 )
  camera.position.set( -800, 0, 1800 )    
  let pointL = new THREE.PointLight( 0xffffff, 2.0 )
  pointL.position.set( 1000, 1000, 1000 )
  let lightAmb = new THREE.AmbientLight( 0xffffff, 0.2 )
  scene = new THREE.Scene()
  scene.background = ASSETS.textures.sceneBack
  scene.add( pointL, lightAmb )
}

const resizeCanvas = () => {
  renderer.setSize( window.innerWidth, window.innerHeight )
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()  
} 
    
const drawFrame = () => {  
  animateAllObjects()
  renderer.render( scene, camera )
  requestAnimationFrame( drawFrame ) 
}




/*******************************************************************/
/*******************************************************************/

let earth, globeMesh, continentsMesh, glowMesh

const createEarth = () => {
  glowMesh = createEarthGlow()
  globeMesh = createGlobe() 
  continentsMesh = createContinents() 
  earth = new THREE.Group()
  scene.add( earth.add( continentsMesh, globeMesh ), glowMesh )
}

const createGlobe = () => {
  return new THREE.Mesh( 
    new THREE.SphereGeometry( 600, 40, 40 ),
    new THREE.MeshPhongMaterial( {
      map: ASSETS.textures.waterNormals,
      normalMap: ASSETS.textures.waterNormals,
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
    new THREE.ShaderMaterial( SHADERS.continentsShader )
  )  
  mesh.rotation.z = -0.5
  mesh.rotation.x = -0.5
  mesh.material.transparent = true
  mesh.material.side = THREE.DoubleSide
  mesh.material.depthWrite = false
  mesh.material.needsUpdate = true
  mesh.material.uniforms.tDiffuse.value = ASSETS.textures.continents
  return mesh
}

const createEarthGlow = () => {
  let mesh =  new THREE.Mesh( 
    new THREE.SphereGeometry( 780, 40, 40 ),
    new THREE.ShaderMaterial( SHADERS.glowEarthShader )
  )  
  mesh.material.transparent = true
  mesh.material.blending = THREE.AdditiveBlending,
  mesh.material.side = THREE.DoubleSide
  mesh.material.depthWrite = false
  mesh.material.needsUpdate = true
  return mesh
}


/*******************************************************************/

let earthSpd = 0.002, earthDir = 'left' // || 'right' 

const animateEarth = ( STATE ) => {
  if ( ! earth ) return
  if ( STATE == 'DARK' ) earthUpdateParamsDark() 
  if ( STATE == 'FLASH') earthUpdateParamsFlash()
  earth.rotation.y += earthSpd
}

const earthUpdateParamsDark = () => {
  if ( earthSpd > 0.008 && earthDir == 'left' ) earthDir = 'right' 
  if ( earthSpd < -0.008 && earthDir == 'right' ) earthDir = 'left'  
  if ( earthDir == 'left' ) earthSpd += 0.0003
  if ( earthDir == 'right') earthSpd -= 0.0003
}

const earthUpdateParamsFlash = () => {
  earthSpd < 0.02 ? earthSpd += 0.0001 : earthSpd = 0.02
  if ( continentsMesh.material.uniforms.light.value < 1.35 ) {
      continentsMesh.material.uniforms.light.value += 0.012
      glowMesh.material.uniforms.light.value += 0.0034
  }
}

const checkEarthStateLight = () => {
  if ( earthSpd == 0.02 ) return true
  return false
}

 


/*******************************************************************/
/*******************************************************************/

let arrConnectors = [], connectorsCenter, materialIron, materialDiod  

const createConnectors = () => {
  materialIron = createMaterialIron()
  materialDiod = createMaterialDiod()
  connectorsCenter = new THREE.Group()
  
  let count = 7
  
  for ( let i = 0; i < count; i ++ ) {
    let plug = createConnector()
    let dirX = Math.cos( i/count * Math.PI * 2 + 0.2 ) 
    let dirY = Math.sin( i/count * Math.PI * 2 + 0.2 )
    plug.position.set( 770 * dirX, 770 * dirY, 0 )
    plug.lookAt( 0, 0, 0 )
  
    let curveQuad = new THREE.QuadraticBezierCurve3(       
      new THREE.Vector3( dirX*770, dirY*770, 0 ),
      new THREE.Vector3( dirX*900, dirY*900, 0 ),
      new THREE.Vector3( dirX*5000, dirY*5000, 0 ) 
    ) 
    let wireGeom = new THREE.TubeBufferGeometry( curveQuad, 16, 10, 4, false )
    wireGeom.dynamic = true
    let wire = new THREE.Mesh( wireGeom, materialIron ) 
    
    scene.add( connectorsCenter.add( plug, wire ) )  

    arrConnectors.push( { plug, wire, dirX, dirY } ) 
  }
}

const createMaterialIron = () => {
  return new THREE.MeshPhongMaterial( {
    color: 0x0c0a19,
    emissive: 0x00000,
    specular: 0xc0c0c0,
    shininess: 100
  } )
}

const createMaterialDiod = () => new THREE.ShaderMaterial( SHADERS.diodShader )
     
const createConnector = () => {
  let corpus = new THREE.Mesh( ASSETS.geoms.corpus, materialIron )
  let diod = new THREE.Mesh( ASSETS.geoms.diod, materialDiod )
  let group = new THREE.Group()
  group.add( corpus, diod )
  return group
}

const removeConnectorsFromScene = () => {
  if ( arrConnectors.length == 0 ) return
  scene.remove( connectorsCenter )
  arrConnectors = []
}


/*******************************************************************/

let spdConnectors = 3.5, countFrame = 0

const animateConnectors = ( STATE ) => {
  if ( arrConnectors.length == 0 ) return
  if ( STATE == 'DARK' ) animationConnectorsDark()
  if ( STATE == 'FLASH' ) animationConnectorsFlash()  
}

const animationConnectorsDark = () => {
  connectorsCenter.rotation.y = earth.rotation.y
  if ( countFrame != 2 ) {
    countFrame ++ 
  } else {
    countFrame = 0
    return
  }
  arrConnectors.forEach( ( item ) => {  
    item.wire.geometry.parameters.path.v2.x -= 3000 * earthSpd
    item.wire.geometry.copy( new THREE.TubeBufferGeometry( item.wire.geometry.parameters.path, 8, 10, 4, false ) )
    item.wire.geometry.needsUpdate = true
  } ) 
}

const animationConnectorsFlash = () => { 
  materialDiod.uniforms.light.value -= 0.01  
  spdConnectors += 0.3
  arrConnectors.forEach( ( item ) => {
    let spdX = item.dirX * spdConnectors
    let spdY = item.dirY * spdConnectors   
    item.plug.position.x += spdX
    item.plug.position.y += spdY
    item.wire.position.x += spdX
    item.wire.position.y += spdY  
  } )
}

const checkConnectorsStateLight = () => {
  if ( arrConnectors.length == 0 ) return true
  if ( arrConnectors[0].plug.position.x > 3000 ) {
    removeConnectorsFromScene()
    return true
  } 
  return false
}



