


import * as SHADERS from "./Shaders.js"

export { 
  loadAssets,
  initAPP,
  startAPP,
  startFlashTopCanvas,
  resizeCanvas,
  setOnBottomAnimationDone,
} 



/*%%  PARAMS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

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



/*%%  APP STATES  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/  

let TOP_CANVAS_STATE = 'DARK' // || 'FLASH' || 'LIGHT'

const updateTopCanvasSTATE = () => {
  if ( TOP_CANVAS_STATE == 'FLASH') 
    if ( checkEarthStateLight() && checkConnectorsStateLight() ) TOP_CANVAS_STATE = 'LIGHT'
  animateEarth( TOP_CANVAS_STATE )
  animateConnectors( TOP_CANVAS_STATE )
  animateCubes()  
}

const startFlashTopCanvas = () => TOP_CANVAS_STATE = 'FLASH'


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let BOTTOM_CANVAS_STATE = 'NONE' // || 'DELAYbeforeCIRCLES || 'CIRCLES' || 'FREESPACE' || 'TEXT'

const updateBottomCanvasSTATE = () => {
  if ( BOTTOM_CANVAS_STATE == 'NONE' ) {
    if ( checkCenterCanvas( canvasBottom ) ) {
      startDelay()
      BOTTOM_CANVAS_STATE = 'DELAYbeforeCIRCLES'
    }  
  }
  if ( BOTTOM_CANVAS_STATE == 'CIRCLES') {
    updateCanvasBottomCircles()
    if ( checkCirclesDone() ) {
      BOTTOM_CANVAS_STATE = 'FREESPACE'
    }
  }
  if ( BOTTOM_CANVAS_STATE == 'FREESPACE' ) {
    onBottomAnimationDone() 
    BOTTOM_CANVAS_STATE = 'TEXT'
  }
  animateCubes() 
}

const startDelay = () => { setTimeout( () => { BOTTOM_CANVAS_STATE = 'CIRCLES'}, 500 ) }

let onBottomAnimationDone = () => {} 
const setOnBottomAnimationDone = f => onBottomAnimationDone = f  



/*%%  LOAD ASSETS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let textureLoader, objectLoader

const ASSETS = { 
  textures: {
    glow: null,
    continents: null,
  },
  geoms: {
    corpus: null,
    diod: null,
    globe: null
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
  } ) 
  .then( () => { new Promise ( ( resolve ) => {
      ASSETS.textures.glow = textureLoader.load( 
          'assets/glow.png',
          () => { resolve() }
      )	
    } ) 
  } ) 
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
  .then( () => new Promise ( ( resolve ) => {
    objectLoader.load( 
        'assets/globe.obj', 
        ( obj ) => {
            obj.traverse( ( child ) => {
              if ( child instanceof THREE.Mesh != true ) return
              ASSETS.geoms.globe = child.geometry 
              resolve() 
            })  
        } 
    )
  } ) ) 
  .then( () => { 
    textureLoader = null
    objectLoader = null
    onLoad() } 
  )      
}



/*%%  INIT SCENE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let canvasTop, canvasBottom

const initAPP = ( 
      c1 = {
        canvas: 'none..',
        w: window.innerWidth,
        h: window.innerHeight 
      },
      c2 = { 
        canvas: 'none..',
        w: window.innerWidth,
        h: window.innerHeight 
      }
    ) => {     
  canvasTop = c1.canvas
  canvasBottom = c2.canvas    
  createScene()    
  createRendererTop( c1 )   
  createRendererBottom( c2 ) 
  createCubes()
  createEarth()
  createConnectors()
  resizeCanvas( c1, c2 )
}

let scene, camera, renderer, 
cameraBottom, rendererBottom, composerBottom, passSpace, startTime 

const createScene = () => {
  let lightPoint = new THREE.PointLight( 0xf114b5d, 0.3 )
  lightPoint.position.set( 500, 500, 600 )
  let lightAmb = new THREE.AmbientLight( 0x8a0873, 0.2 )
  scene = new THREE.Scene()
  scene.add( lightPoint, lightAmb )
}

const createRendererTop = c1 => {
  renderer = new THREE.WebGLRenderer( { canvas: c1.canvas } ) 
  camera = new THREE.PerspectiveCamera( 20, c1.w / c1.h, 3.5, 25000 )
  camera.position.set( 0, 0, 7200 )     
}

const createRendererBottom = c2 => {
  startTime = Date.now()
  rendererBottom = new THREE.WebGLRenderer( { canvas: c2.canvas } )
  composerBottom = new THREE.EffectComposer( rendererBottom )	
  cameraBottom = new THREE.PerspectiveCamera( 40, c2.w / c2.h, 3.5, 15000 )
  cameraBottom.position.set( 0, 4000, 0)
  cameraBottom.rotation.x = -0.4  
  composerBottom.addPass( new THREE.RenderPass( scene, cameraBottom ) )
  passSpace = new THREE.ShaderPass( SHADERS.spaceShader )
  composerBottom.addPass( passSpace )
  passSpace.renderToScreen = true  
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

const resizeCanvas = (       
      size1 = { 
        w: window.innerWidth,
        h: window.innerHeight 
      },
      size2 = { 
        w: window.innerWidth,
        h: window.innerWidth 
      } ) => {
  let asp = size1.h/size1.w - 0.5             
  if ( asp < 1 ) {
    camera.position.x = ( -800 ) + ( size1.h/size1.w - 0.5 ) * 800
    camera.position.z = 7200
    glowMesh.position.x = 65 
  } else {
    camera.position.x = 0
    camera.position.z = 10000
    glowMesh.position.x = 0  
  } 
  renderer.setSize( size1.w, size1.h )
  camera.aspect = size1.w / size1.h
  camera.updateProjectionMatrix()
  if ( rendererBottom ) rendererBottom.setSize( size2.w, size2.h )
  if ( cameraBottom ) { 
    cameraBottom.aspect = size2.w / size2.h * size2.h / size2.w
    cameraBottom.updateProjectionMatrix()
  }
  if ( passSpace ) passSpace.uniforms.iResolution.value = new THREE.Vector2( size2.w, size2.h )   
  let size = rendererBottom.getDrawingBufferSize()
  if ( composerBottom )composerBottom.setSize( size.width, size.height )
} 


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

const startAPP = () => drawFrame() 

const drawFrame = () => {
  if ( checkVisible( canvasTop ) ) { 
    updateTopCanvasSTATE()
    renderer.render( scene, camera )
  }  
  if ( checkVisible( canvasBottom ) ) { 
    updateBottomCanvasSTATE()    
    let currentTime = Date.now()
    passSpace.uniforms.iGlobalTime.value = ( currentTime - startTime ) * 0.0002
    composerBottom.render() 
  }
  requestAnimationFrame( drawFrame ) 
}

const checkVisible = elm => {
  let rect = elm.getBoundingClientRect()
  let viewHeight = Math.max( document.documentElement.clientHeight, window.innerHeight )
  return ! ( rect.bottom < 0 || rect.top - viewHeight >= 0 )
}

const checkCenterCanvas = elm => {
  let rect = elm.getBoundingClientRect()
  let viewHeight = Math.max( document.documentElement.clientHeight, window.innerHeight )
  return ! ( rect.bottom < 0 || rect.top + ( rect.bottom - rect.top ) * 0.5 - viewHeight >= 0 )  
}

let spdCircles = 0.001
const updateCanvasBottomCircles = () => { 
  if ( passSpace.uniforms.circleSize.value < 0.071 ) {
    spdCircles *= 1.01     
  } else if ( passSpace.uniforms.circleSize.value > 0.07 && passSpace.uniforms.circleSize.value < 0.08 ) {
    spdCircles = 0.0002
  } else {
    spdCircles *= 1.03 + 0.0005    
  }
  passSpace.uniforms.circleSize.value += spdCircles
} 

const checkCirclesDone = () => {
  if ( passSpace.uniforms.circleSize.value > 2.2 ) return true
  return false
}



/*%%  EARTH  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let earth, continentsMesh, glowMesh

const createEarth = () => {
  glowMesh = createEarthGlow()
  glowMesh.position.set( 65, 0, -610 )
  continentsMesh = createContinents() 
  earth = new THREE.Group()
  earth.rotation.z = -0.3
  earth.rotation.x = 0.5
  continentsMesh.rotation.y = 0.7
  scene.add( earth.add( continentsMesh ), glowMesh )
  glowMesh.lookAt( camera.position )
}

const createContinents = () => {
  let mesh =  new THREE.Mesh( 
    ASSETS.geoms.globe,
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
  let geom = new THREE.PlaneGeometry( 1900, 1900 )
  SHADERS.setMapToGlowShader( ASSETS.textures.glow )
  let mat = new THREE.ShaderMaterial( SHADERS.glowShader )
  mat.transparent = true
  let mesh = new THREE.Mesh( geom, mat )
  return mesh  
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let earthSpd = 0.002,
addSpd = 0.0003,
earthDir = 'left'  // || 'right'
let clock = new THREE.Clock()

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
  if ( SHADERS.glowShader.uniforms.light.value < 1.5 ) SHADERS.glowShader.uniforms.light.value += 0.12 
}

const checkEarthStateLight = () => {
  if ( earthSpd == app_Params.earthSpdFree ) return true
  return false
}


 
/*%% CONNECTORS  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let arrConnectors = [],
connectorsData = [
  { //america
    length: -3000,
    dirY: 6.0,
    dirZ: 0.7 
  },
  { //soushAm
    length: -4500,
    dirY: 0.2,
    dirZ: 1.8  
  }, 
  { //russia
    length: -3500,
    dirY: 3.24,
    dirZ: 0.8  
  },
  { //europe
    length: -4500,
    dirY: 1.5,
    dirZ: 0.8  
  },
  { //africa
    length: -5000,
    dirY: 1.9,
    dirZ: 1.8  
  },
  { //australia
    length: -5500,
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
    let wire = createWire( item.length )
    objPlug.plug.add( wire )
    let connector = new THREE.Group()
    connector.add( objPlug.plug )
    connector.position.set( 
      Math.sin( item.dirZ ) * Math.sin( item.dirY ) * 890, 
      Math.cos( item.dirZ ) * 890,  
      Math.sin( item.dirZ ) * Math.cos( item.dirY ) * 890
    )
    connector.lookAt( 0, 0, 0 )
    arrConnectors.push( { 
      connector, 
      plug: objPlug.plug,
      corpus: objPlug.corpus, 
      diod: objPlug.diod, 
      wire, 
      length: item.length 
    } )
    connectorsCenter.add( connector )   
  } )
  continentsMesh.add( connectorsCenter ) 
}

const createMaterialIron = () => {
  return new THREE.MeshPhongMaterial( {
    color: 0x0c0a19,
    emissive: 0x00000,
    specular: 0xffffff,
    shininess: 20
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

const createWire = length => {
  let curveQuad = new THREE.QuadraticBezierCurve3(       
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 0, -1000 ),
    new THREE.Vector3( 0, 0, length ) 
  )
  let wireGeom = new THREE.TubeBufferGeometry( curveQuad, 10, 25, 8, false )
  return new THREE.Mesh( wireGeom, materialIron )   
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

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


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

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
  const time = clock.getDelta()
  materialDiod.uniforms.time.value += time
  arrConnectors.forEach( ( item ) => {
    if ( ! item.plug || ! item.wire ) return   
    if ( item.length == -3000 ) {
      item.wire.geometry.parameters.path.v2.y = -4000 * Math.sin( continentsMesh.rotation.y - 0.4 )      
    } else {
      item.wire.geometry.parameters.path.v2.x = 5000 * Math.sin( continentsMesh.rotation.y - 0.4 )
    }
    item.wire.geometry.parameters.path.v2.x = 5000 * Math.sin( continentsMesh.rotation.y - 0.4 )
    item.wire.geometry.dispose()  
    item.wire.geometry = new THREE.TubeBufferGeometry( item.wire.geometry.parameters.path, 30, 25, 8, false ) 
    item.wire.geometry.needsUpdate = true
  } ) 
}

const getConnectorsFromEarthAndPutInScene = () => {
  continentsMesh.getWorldQuaternion( connectorsCenter.quaternion )
  continentsMesh.remove( connectorsCenter )
  scene.add( connectorsCenter )
}

const animationConnectorsFlash = () => { 
  materialDiod.uniforms.dark.value += 0.01 
  spdConnectors += 0.6
  arrConnectors.forEach( ( item ) => {
    item.plug.position.z -= spdConnectors     
  } )
}


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

const checkConnectorsStateLight = () => {
  if ( arrConnectors.length == 0 ) return true
  if ( ! arrConnectors[0].plug ) return true
  if ( arrConnectors[0].plug.position.z < -15000 ) {
    removeConnectorsFromScene()
    return true
  } 
  return false
}



/*%% BACKGROUND CUBES %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 

let arrCubes = []

const createCubes = () => {
  let cubesGroup = new THREE.Group()
  scene.add( cubesGroup )
  cubesGroup.rotation.x = -1
  cubesGroup.position.set( 0, 0, -9000 )
  let mat = new THREE.MeshPhongMaterial( {
    color: 0x1ee5ba,
    emissive: 0x00000,
    specular: 0xc0c0c0,
    shininess: 100 
  } )
  let geom = new THREE.CubeGeometry( 1000, 1000, 1000 )
  for ( let yi = 0; yi < 20; yi ++ ) {
    for ( let xi = 0; xi < 20; xi ++ ) {
      let cube = new THREE.Mesh( geom, mat )
      cubesGroup.add( cube )
      cube.position.set( xi * 1000 - 10000, yi * 1000 - 5000, 0 )
      cube.rotation.x = ( xi / 5.0 + yi / 5.0 )
      arrCubes.push( cube )
    }
  }     
}

const animateCubes = () => arrCubes.forEach( item => item.rotation.x += 0.01 )



