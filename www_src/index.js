

import * as SHADERS from "./Shaders.js"
import * as DOC_ELEMS from "./DocumentElems.js"

window.onload = () => {
  loadAssets( () => { 
    let widthCanvas = DOC_ELEMS.getParentContainerSize() 
    initScene( widthCanvas )
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

const initScene = ( width ) => {
  renderer = new THREE.WebGLRenderer( { alpha: true, canvas: document.getElementById( 'webgl' ) } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, width * 0.7 )	
  camera = new THREE.PerspectiveCamera( 20, width / ( width * 0.7 ) , 3.5, 15000 )
  camera.position.set( -800, -200, 8200 )    
  let lightPoint = new THREE.PointLight( 0xffffff, 2.0 )
  lightPoint.position.set( 1000, 1000, 1000 )
  let lightAmb = new THREE.AmbientLight( 0xffffff, 0.2 )
  scene = new THREE.Scene()
  scene.background = ASSETS.textures.sceneBack
  scene.add( lightPoint, lightAmb )
}

const resizeCanvas = ( width ) => {
  renderer.setSize( width, width * 0.7 )
  camera.aspect = width / ( width * 0.7 )
  camera.updateProjectionMatrix()  
} 
    
const drawFrame = () => {  
  animateAllObjects()
  renderer.render( scene, camera )
  requestAnimationFrame( drawFrame ) 
}




/*******************************************************************/
/*******************************************************************/

let earth, continentsMesh, glowMesh

const createEarth = () => {
  glowMesh = createEarthGlow()
  continentsMesh = createContinents() 
  earth = new THREE.Group()
  scene.add( earth.add( continentsMesh ), glowMesh )
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
  if ( continentsMesh.material.uniforms.light.value < 1.35 ) continentsMesh.material.uniforms.light.value += 0.012
  if ( glowMesh.material.uniforms.light.value < 0.1 ) glowMesh.material.uniforms.light.value += 0.0034
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
    let dirX = Math.cos( i/count * Math.PI * 2 + 0.2 ) 
    let dirY = Math.sin( i/count * Math.PI * 2 + 0.2 )
  
    let plug = createPlug()
    plug.position.set( 770 * dirX, 770 * dirY, 0 )
    plug.lookAt( 0, 0, 0 )
  
    let curveQuad = new THREE.QuadraticBezierCurve3(       
      new THREE.Vector3( dirX * 770, dirY * 770, 0 ),
      new THREE.Vector3( dirX * 1300, dirY * 1300, 0 ),
      new THREE.Vector3( dirX * 5000, dirY * 5000, 0 ) 
    ) 
    let wireGeom = new THREE.TubeBufferGeometry( curveQuad, 16, 17, 4, false )
    wireGeom.dynamic = true
    let wire = new THREE.Mesh( wireGeom, materialIron ) 
    
    arrConnectors.push( { plug, wire, dirX, dirY } )
    connectorsCenter.add( plug, wire )   
  }
  scene.add( connectorsCenter ) 
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
     
const createPlug = () => {
  let corpus = new THREE.Mesh( ASSETS.geoms.corpus, materialIron )
  let diod = new THREE.Mesh( ASSETS.geoms.diod, materialDiod )
  let group = new THREE.Group()
  group.add( diod, corpus )
  return group
}


/*******************************************************************/

const removeConnectorsFromScene = () => {
  if ( arrConnectors.length == 0 ) return
  arrConnectors.forEach( ( item ) => {
    scene.remove( item.plug )
    scene.remove( item.wire )
  } )
  scene.remove( connectorsCenter )
  arrConnectors = []
}

const disposeMesh = mesh => {
  mesh.geometry.dispose()
  mesh.material.dispose()
}


/*******************************************************************/

let spdConnectors = 3.5, countFrame = 0

const animateConnectors = ( STATE ) => {
  if ( arrConnectors.length == 0 ) return
  if ( STATE == 'DARK' ) animationConnectorsDark()
  if ( STATE == 'FLASH' ) animationConnectorsFlash()  
}

const animationConnectorsDark = () => {
  if ( countFrame == 2 ) {
    countFrame = 0
    return
  } else {
    countFrame ++    
  }
  arrConnectors.forEach( ( item ) => {
    if ( ! item.plug || ! item.wire ) return   
    if ( item.plug.position.x < 0 ) item.wire.geometry.parameters.path.v2.z -= 10000 * earthSpd
    if ( item.plug.position.x > 0 ) item.wire.geometry.parameters.path.v2.z += 10000 * earthSpd
    item.wire.geometry.dispose()  
    item.wire.geometry = new THREE.TubeBufferGeometry( item.wire.geometry.parameters.path, 8, 17, 4, false ) 
    item.wire.geometry.needsUpdate = true
  } ) 
  if ( ! earth ) return 
  connectorsCenter.rotation.y = earth.rotation.y
}

const animationConnectorsFlash = () => { 
  materialDiod.uniforms.light.value -= 0.01  
  spdConnectors += 0.3
  arrConnectors.forEach( ( item ) => {
    let spdX = item.dirX * spdConnectors
    let spdY = item.dirY * spdConnectors
    if ( item.plug ) moveItem( item.plug, spdX, spdY )    
    if ( item.wire ) moveItem( item.wire, spdX, spdY )    
  } )
}

const moveItem = ( mesh, spdX, spdY ) => {
  mesh.position.x += spdX
  mesh.position.y += spdY  
}

/*******************************************************************/

const checkConnectorsStateLight = () => {

  if ( arrConnectors.length == 0 ) return true
  let item
  if ( arrConnectors[0].plug ) { 
    item = arrConnectors[0].plug 
  } else {
    if ( arrConnectors[0].wire ) { 
      item = arrConnectors[0].wire
    } else {
      return true
    }
  }
  if ( item.position.x > 3000 ) {
    removeConnectorsFromScene()
    return true
  } 
  return false
}



