

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
    DOC_ELEMS.setActionsMouseWheel( startStateFLASH )   
  } )
}




/*******************************************************************/
/*******************************************************************/

let APP_STATE = 'DARK' // || 'FLASH' || 'LIGHT'

const startStateFLASH = () => APP_STATE = 'FLASH'

const animateAllObjects = () => {
  if ( APP_STATE == 'FLASH') 
    if ( checkIsEarthReadyToStateLIGHT() && checkIsConnectorsReadyToStateLIGHT() ) APP_STATE = 'LIGHT'
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
  } )
  .then( () => new Promise ( ( resolve ) => {
        ASSETS.textures.waterNormals = textureLoader.load( 
            'assets/Voda_normali.jpg',
            ( texture ) => { 
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping
              texture.repeat.set( 5.0, 5.0 )              
              resolve() 
            }
        )	
  } ) )
  .then( () => new Promise ( ( resolve ) => {
        ASSETS.textures.continents = textureLoader.load( 
            'assets/contour.jpg',
            () => { resolve() }
        )	
  } ) )
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
  } ) )  
  .then( () => { 
    textureLoader = null
    objectLoader = null
    onLoad() 
  } )      
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
  let lightPoint = new THREE.PointLight( 0xffffff, 2.0 )
  lightPoint.position.set( 1000, 1000, 1000 )
  let lightAmb = new THREE.AmbientLight( 0xffffff, 0.2 )
  scene = new THREE.Scene()
  scene.background = ASSETS.textures.sceneBack
  scene.add( lightPoint, lightAmb )
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
  if ( STATE == 'DARK' ) earthUpdateParamsDARK() 
  if ( STATE == 'FLASH') earthUpdateParamsFLASH()
  earth.rotation.y += earthSpd
}

const earthUpdateParamsDARK = () => {
  if ( earthSpd > 0.008 && earthDir == 'left' ) earthDir = 'right' 
  if ( earthSpd < -0.008 && earthDir == 'right' ) earthDir = 'left'  
  if ( earthDir == 'left' ) earthSpd += 0.0003
  if ( earthDir == 'right') earthSpd -= 0.0003
}

const earthUpdateParamsFLASH = () => {
  if ( ! continentsMesh || ! glowMesh ) return
  earthSpd < 0.02 ? earthSpd += 0.0001 : earthSpd = 0.02
  if ( continentsMesh.material.uniforms.light.value < 1.35 ) {
      continentsMesh.material.uniforms.light.value += 0.012
      glowMesh.material.uniforms.light.value += 0.0034
  }
}


/*******************************************************************/

const checkIsEarthReadyToStateLIGHT = () => {
  if ( ! earth ) return true
  if ( earthSpd == 0.02 ) return true
  return false
}



 
/*******************************************************************/
/*******************************************************************/

let arrConnectors = [], connectorsCenter, materialDiod  

const createConnectors = () => {
  connectorsCenter = new THREE.Group()
  scene.add( connectorsCenter ) 

  let materialIron = createMaterialIron()
  materialDiod = createMaterialDiod()

  let count = 7
  
  for ( let i = 0; i < count; i ++ ) {
    let dirX = Math.cos( i / count * Math.PI * 2 + 0.2 ) 
    let dirY = Math.sin( i / count * Math.PI * 2 + 0.2 )
    let connector = {
      wire: createWire( materialIron, dirX, dirY ), 
      plug: createPlug( materialIron, dirX, dirY ),
      dirX,
      dirY
    }
    connectorsCenter.add( connector.plug, connector.wire )
    arrConnectors.push( connector ) 
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
     
const createWire = ( materialIron, dirX, dirY ) => {
  let curveQuad = new THREE.QuadraticBezierCurve3(       
    new THREE.Vector3( dirX * 770, dirY * 770, 0 ),
    new THREE.Vector3( dirX * 1300, dirY * 1300, 0 ),
    new THREE.Vector3( dirX * 5000, dirY * 5000, 0 ) 
  ) 
  let wireGeom = new THREE.TubeBufferGeometry( curveQuad, 16, 10, 4, false )
  wireGeom.dynamic = true
  return new THREE.Mesh( wireGeom, materialIron )  
}

const createPlug = ( materialIron, dirX, dirY ) => {
  let corpus = new THREE.Mesh( ASSETS.geoms.corpus, materialIron )
  let diod = new THREE.Mesh( ASSETS.geoms.diod, materialDiod )
  let group = new THREE.Group()
  group.add( diod, corpus )
  group.position.set( 770 * dirX, 770 * dirY, 0 )
  group.lookAt( 0, 0, 0 ) 
  return group
}


/*******************************************************************/

const deleteConnectors = () => {
  if ( arrConnectors.length == 0 ) return
  scene.remove( connectorsCenter )
  arrConnectors = []
}


/*******************************************************************/

let spdConnectors = 3.5, countFrame = 0

const animateConnectors = ( STATE ) => {
  if ( arrConnectors.length == 0 ) return
  if ( STATE == 'DARK' ) animationConnectorsDARK()
  if ( STATE == 'FLASH' ) animationConnectorsFLASH()  
}

const animationConnectorsDARK = () => {
  if ( countFrame == 2 ) { return countFrame = 0 }
  countFrame ++    
  arrConnectors.forEach( ( item ) => {
    if ( ! item.plug || ! item.wire ) return  
    if ( item.plug.position.x < 0 ) item.wire.geometry.parameters.path.v2.z -= 10000 * earthSpd
    if ( item.plug.position.x > 0 ) item.wire.geometry.parameters.path.v2.z += 10000 * earthSpd
    item.wire.geometry.copy( new THREE.TubeBufferGeometry( item.wire.geometry.parameters.path, 8, 10, 4, false ) )
    item.wire.geometry.needsUpdate = true
  } ) 
  if ( ! earth ) return
  connectorsCenter.rotation.y = earth.rotation.y
}

const animationConnectorsFLASH = () => { 
  materialDiod.uniforms.light.value -= 0.01  
  spdConnectors += 0.3
  arrConnectors.forEach( ( item ) => {
    if ( ! item.plug || ! item.wire ) return     
    let spdX = item.dirX * spdConnectors
    let spdY = item.dirY * spdConnectors   
    item.plug.position.x += spdX
    item.plug.position.y += spdY
    item.wire.position.x += spdX
    item.wire.position.y += spdY  
  } )
}


/*******************************************************************/

const checkIsConnectorsReadyToStateLIGHT = () => {
  if ( arrConnectors.length == 0 ) return true
  if ( ! arrConnectors[0].plug ) return true
  if ( arrConnectors[0].plug.position.x > 3000 ) {
    deleteConnectors()
    return true
  } 
  return false
}





