
import * as SHADERS from "./Shaders.js"

export { 
  setCanvases,
  loadAssets,
  init,
  start,
  onUserActionMouseWheel,
  resizeCanvas
} 



/*******************************************************************/
/*******************************************************************/

const app_Params =  {
  earthRed: 0.0,
  earthGreen: 0.04,
  earthBlue: 0.08,
  glowRed: 0.0,
  glowGreen: 0.19,
  glowBlue: 0.22,
  glowLight: 0.0,
  glowBorder: 2.9,
  wireColor: "#ffae23",
  wireDiodRed: 0.9,
  wireDiodGreen: 0.9,
  wireDiodBlue: 0.9,
  earthLeftMax: -2.0,
  earthRightMax: 0.45,
  earthAxell: 0.00085,
  earthMaxSpd: 0.017,
  earthSpdFree: 0.015
}



/*******************************************************************/
/*******************************************************************/

let APP_STATE = 'DARK' // || 'FLASH' || 'LIGHT'

const start = () => { drawFrame() }

const onUserActionMouseWheel = () => APP_STATE = 'FLASH'

const animateAllObjects = () => {
  if ( APP_STATE == 'FLASH') {
    if ( checkEarthStateLight() && checkConnectorsStateLight() ) APP_STATE = 'LIGHT'
  } 
  animateEarth( APP_STATE )
  animateConnectors( APP_STATE )
  animateCubes( APP_STATE )
}






/*******************************************************************/
/*******************************************************************/

let textureLoader, objectLoader

const ASSETS = { 
  textures: {
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
        ASSETS.textures.continents = textureLoader.load( 
            'assets/contour.jpg',
            () => { resolve() }
        )	
  }) 
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

let canvasTop = null, canvasBottom = null

const setCanvases = ( top, bottom ) => {
  canvasTop = top,
  canvasBottom = bottom
} 

let scene, camera, renderer, rendererBottom, cameraBottom,
sceneWidth


const init = ( width ) => {
  renderer = new THREE.WebGLRenderer( { canvas: canvasTop } ) 
  rendererBottom = new THREE.WebGLRenderer( { canvas: canvasBottom } )

  camera = new THREE.PerspectiveCamera( 20, width / ( width * 0.7 ) , 3.5, 15000 )
  camera.position.set( -800, -200, 8200 )
  
  cameraBottom = new THREE.PerspectiveCamera( 20, width / ( width * 0.3 ) , 3.5, 15000 )
  cameraBottom.position.set( 0, -2000, -4000)
  cameraBottom.rotation.x = 1.1
  
  let lightPoint = new THREE.PointLight( 0xf114b5d, 0.2 )
  lightPoint.position.set( 1000, 3000, 600 )
  let lightAmb = new THREE.AmbientLight( 0x8a0873, 0.2 )
  scene = new THREE.Scene()
  scene.add( lightPoint, lightAmb )
  scene.add( new THREE.Mesh(
    new THREE.CubeGeometry( 500, 500, 500 ),
    new THREE.MeshBasicMaterial( { color: 0x00ffff } )
  ))

  createCubes()
  createEarth()
  createConnectors()

  rendererBottom.render( scene, cameraBottom )  

  resizeCanvas( width )
}

const resizeCanvas = ( width ) => {
  renderer.setSize( width, width * 0.7 )
  camera.aspect = width / ( width * 0.7 )
  camera.updateProjectionMatrix()  

  rendererBottom.setSize( width, width * 0.4 )
  cameraBottom.aspect = width / ( width * 0.4 )
  cameraBottom.updateProjectionMatrix()  
} 
    
const drawFrame = () => {  
  animateAllObjects()
  renderer.render( scene, camera )
  if ( APP_STATE == 'LIGHT' ) {
    rendererBottom.render( scene, cameraBottom )    
  }
  requestAnimationFrame( drawFrame ) 
}




/*******************************************************************/
/*******************************************************************/

let earth, continentsMesh, glowMesh

const createEarth = () => {
  glowMesh = createEarthGlow()
  continentsMesh = createContinents() 
  earth = new THREE.Group()
  earth.rotation.z = -0.3
  earth.rotation.x = 0.5
  continentsMesh.rotation.y = 0.7
  scene.add( earth.add( continentsMesh ), glowMesh )
}

const createContinents = () => {
  let mesh =  new THREE.Mesh( 
    new THREE.SphereGeometry( 608, 40, 40 ),
    new THREE.ShaderMaterial( SHADERS.continentsShader )
  )  
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

let earthSpd = 0.002,
addSpd = 0.0003,
earthDir = 'left'  // || 'right'

const animateEarth = ( STATE ) => {
  if ( ! earth ) return
  if ( STATE == 'DARK' ) earthUpdateParamsDark() 
  if ( STATE == 'FLASH') earthUpdateParamsFlash()
  continentsMesh.rotation.y += earthSpd
}

const earthUpdateParamsDark = () => {
  if ( continentsMesh.rotation.y > app_Params.earthLeftMax && earthDir == 'left' ) earthDir = 'right' 
  if ( continentsMesh.rotation.y < app_Params.earthRightMax && earthDir == 'right' ) earthDir = 'left'
  if ( earthDir == 'left' ) 
    if ( Math.abs( earthSpd + app_Params.earthAxell ) < app_Params.earthMaxSpd ) earthSpd += app_Params.earthAxell  
  if ( earthDir == 'right' ) 
    if ( Math.abs( earthSpd - app_Params.earthAxell ) < app_Params.earthMaxSpd ) earthSpd -= app_Params.earthAxell
}

const earthUpdateParamsFlash = () => {
  earthSpd < app_Params.earthSpdFree ? earthSpd += addSpd : earthSpd = app_Params.earthSpdFree
  if ( continentsMesh.material.uniforms.light.value < 1.35 ) continentsMesh.material.uniforms.light.value += 0.012
  if ( glowMesh.material.uniforms.light.value < 0.1 ) glowMesh.material.uniforms.light.value += 0.0034
}

const checkEarthStateLight = () => {
  if ( earthSpd == app_Params.earthSpdFree ) return true
  return false
}


 

/*******************************************************************/
/*******************************************************************/

let arrConnectors = [],
connectorsData = [
  { //america
    dirY: 6.08,
    dirZ: 0.8  
  }, 
  { //soushAm
    dirY: 0.2,
    dirZ: 1.8  
  }, 
  { //russia
    dirY: 3.24,
    dirZ: 0.8  
  },
  { //europe
    dirY: 1.5,
    dirZ: 0.8  
  },
  { //africa
    dirY: 1.9,
    dirZ: 1.8  
  },
  { //australia
    dirY: 3.7,
    dirZ: 2.0  
  }
],
connectorsCenter, materialIron, materialDiod  

const createConnectors = () => {
  materialIron = createMaterialIron()
  materialDiod = createMaterialDiod()
  connectorsCenter = new THREE.Group()
  connectorsData.forEach ( ( item ) => { 
    let  objPlug= createPlug()
    let wire = createWire()
    objPlug.plug.add( wire )
    let connector = new THREE.Group()
    connector.add( objPlug.plug )
    connector.position.set( 
      Math.sin( item.dirZ ) * Math.sin( item.dirY ) * 795, 
      Math.cos( item.dirZ ) * 795,  
      Math.sin( item.dirZ ) * Math.cos( item.dirY )  * 795 
    )
    connector.lookAt( 0, 0, 0 )
    arrConnectors.push( { connector, plug: objPlug.plug, corpus: objPlug.corpus, diod: objPlug.diod, wire } )
    connectorsCenter.add( connector )   
  } )
  continentsMesh.add( connectorsCenter ) 
}

const createMaterialIron = () => {
  return new THREE.MeshPhongMaterial( {
    color: 0x0c0a19,
    emissive: 0x00000,
    specular: 0xffffff,
    shininess: 100
  } )
}

const createMaterialDiod = () => new THREE.ShaderMaterial( SHADERS.diodShader )
     
const createPlug = () => {
  let corpus = new THREE.Mesh( ASSETS.geoms.corpus, materialIron )
  let diod = new THREE.Mesh( ASSETS.geoms.diod, materialDiod )
  let plug = new THREE.Group()
  plug.add( diod, corpus )
  return { plug, corpus, diod }
}

const createWire = () => {
  let curveQuad = new THREE.QuadraticBezierCurve3(       
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 0, -1000 ),
    new THREE.Vector3( 0, 0, -3500 ) 
  )
  let wireGeom = new THREE.TubeBufferGeometry( curveQuad, 10, 25, 8, false )
  return new THREE.Mesh( wireGeom, materialIron )   
}


/*******************************************************************/

const removeConnectorsFromScene = () => {
  if ( arrConnectors.length == 0 ) return
  for ( let i = 0; i < arrConnectors.length; i ++ ) {
    arrConnectors[ i ].plug.remove( arrConnectors[ i ].corpus )
    arrConnectors[ i ].plug.remove( arrConnectors[ i ].diod )
    connectorsCenter.remove( arrConnectors[ i ].plug )
    connectorsCenter.remove( arrConnectors[ i ].wire )
    let md = arrConnectors[ i ]
    arrConnectors.splice( i, 1 )
    i -- 
    md = null
  }
  scene.remove( connectorsCenter )
  arrConnectors = []
}



/*******************************************************************/

let spdConnectors = 0.005, oldSTATE = 'DARK'

const animateConnectors = ( STATE ) => {
  if ( arrConnectors.length == 0 ) return
  if ( STATE == 'DARK' ) animationConnectorsDark()
  if ( STATE == 'FLASH' )  {
    if ( oldSTATE == 'DARK' ) {
      getConnectorsFromEarthAndPutInScene()
      oldSTATE = 'FLASH'
    } 
    animationConnectorsFlash()
  } 
}

const animationConnectorsDark = () => {
  arrConnectors.forEach( ( item ) => {
    if ( ! item.plug || ! item.wire ) return   
    item.wire.geometry.parameters.path.v2.x = 5000 * Math.sin( continentsMesh.rotation.y - 0.4 )
    item.wire.geometry.dispose()  
    item.wire.geometry = new THREE.TubeBufferGeometry( item.wire.geometry.parameters.path, 30, 25, 8, false  ) 
    item.wire.geometry.needsUpdate = true
  } ) 
}

const getConnectorsFromEarthAndPutInScene = () => {
  continentsMesh.getWorldQuaternion( connectorsCenter.quaternion )
  continentsMesh.remove( connectorsCenter )
  scene.add( connectorsCenter )
}

const animationConnectorsFlash = () => { 
  materialDiod.uniforms.light.value -= 0.01  
  spdConnectors += 0.6
  arrConnectors.forEach( ( item ) => {
    item.plug.position.z -= spdConnectors     
  } )
}



/*******************************************************************/

const checkConnectorsStateLight = () => {
  if ( arrConnectors.length == 0 ) return true
  if ( ! arrConnectors[0].plug ) return true
  if ( arrConnectors[0].plug.position.z < -5000 ) {
    removeConnectorsFromScene()
    return true
  } 
  return false
}




/*******************************************************************/
/*******************************************************************/


let arrCubes = []

const createCubes = () => {
  let mat = new THREE.MeshPhongMaterial( {
    color: 0x1ee5ba,
    emissive: 0x00000,
    specular: 0xc0c0c0,
    shininess: 100 
  } )
  let geom = new THREE.CubeGeometry( 600, 600, 600 )
  for ( let yi = 0; yi < 20; yi ++ ) {
    for ( let xi = 0; xi < 20; xi ++ ) {
      let cube = new THREE.Mesh( geom, mat )
      scene.add( cube )
      cube.position.set( xi * 600 - 6000, yi * 600 - 3000, -6000 )
      cube.rotation.x = ( xi / 5.0 + yi / 5.0 )
      arrCubes.push( cube )
    }
  }     
}

const animateCubes = STATE => {
  arrCubes.forEach( ( item ) => {
    item.rotation.x += 0.01 
  } )
}  

