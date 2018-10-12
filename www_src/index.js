
import * as SHADERS from "./Shaders.js"
import * as DOC_ELEMS from "./DocumentElems.js"

window.onload = () => {
  CANVASES()
  loadAssets( () => { 
    let widthCanvas = DOC_ELEMS.getParentContainerSize() 
    initScene( widthCanvas )
    resizeCanvas( widthCanvas )
    DOC_ELEMS.setActionsWindowResize( resizeCanvas )
    initGui()
    createCubes()
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

var text

var guiParams = function () {
  this.earthRed = 0.0
  this.earthGreen = 0.04
  this.earthBlue = 0.08
  this.glowRed = 0.0
  this.glowGreen = 0.19
  this.glowBlue = 0.22
  this.glowLight = 0.0
  this.glowBorder = 2.9
  this.wireColor = "#ffae23"
  this.wireDiodRed = 0.9
  this.wireDiodGreen = 0.9
  this.wireDiodBlue = 0.9
  this.earthLeftMax = -2.0
  this.earthRightMax = 0.45
  this.earthAxell = 0.00085
  this.earthMaxSpd = 0.017
  this.earthSpdFree = 0.015
}

const initGui = () => {
  text = new guiParams()
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

let scene, camera, renderer, rendererBottom, cameraBottom

const initScene = ( width ) => {
  renderer = new THREE.WebGLRenderer( { canvas: document.getElementById( 'webgl' ) } ) 
  rendererBottom = new THREE.WebGLRenderer( { canvas: document.getElementById( 'webgl_bottom' ) } )

  camera = new THREE.PerspectiveCamera( 20, width / ( width * 0.7 ) , 3.5, 15000 )
  camera.position.set( -800, -200, 8200 )
  
  cameraBottom = camera.clone()
  cameraBottom.position.set( 0, 0, 8200 )
  
  let lightPoint = new THREE.PointLight( 0xf114b5d, 0.2 )
  lightPoint.position.set( 1000, 3000, 2000 )
  let lightAmb = new THREE.AmbientLight( 0x8a0873, 0.2 )
  scene = new THREE.Scene()
  scene.add( lightPoint, lightAmb )
}

const resizeCanvas = ( width ) => {
  renderer.setSize( width, width * 0.7 )
  camera.aspect = width / ( width * 0.7 )
  camera.updateProjectionMatrix()  

  rendererBottom.setSize( width, width * 0.3 )
  cameraBottom.aspect = width / ( width * 0.3 )
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
  continentsMesh.rotation.y = 0.85
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
earthMaxSpd = 0.01,
earthDir = 'left',  // || 'right'
earthMaxRotationLeft = 0.8,
earthMaxRotationRight = 0.0


const animateEarth = ( STATE ) => {
  if ( ! earth ) return
  if ( STATE == 'DARK' ) earthUpdateParamsDark() 
  if ( STATE == 'FLASH') earthUpdateParamsFlash()
  continentsMesh.rotation.y += earthSpd
}

const earthUpdateParamsDark = () => {
  if ( continentsMesh.rotation.y > text.earthLeftMax && earthDir == 'left' ) earthDir = 'right' 
  if ( continentsMesh.rotation.y < text.earthRightMax && earthDir == 'right' ) earthDir = 'left'
  if ( earthDir == 'left' ) 
    if ( Math.abs( earthSpd + text.earthAxell ) < text.earthMaxSpd ) earthSpd += text.earthAxell  
  if ( earthDir == 'right' ) 
    if ( Math.abs( earthSpd - text.earthAxell ) < text.earthMaxSpd ) earthSpd -= text.earthAxell
}

const earthUpdateParamsFlash = () => {
  earthSpd < text.earthSpdFree ? earthSpd += addSpd : earthSpd = text.earthSpdFree
  if ( continentsMesh.material.uniforms.light.value < 1.35 ) continentsMesh.material.uniforms.light.value += 0.012
  if ( glowMesh.material.uniforms.light.value < 0.1 ) glowMesh.material.uniforms.light.value += 0.0034
}

const checkEarthStateLight = () => {
  if ( earthSpd == text.earthSpdFree ) return true
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
    let plug = createPlug()
    let wire = createWire()
    plug.add( wire )
    let connector = new THREE.Group()
    connector.add( plug )
    connector.position.set( 
      Math.sin( item.dirZ ) * Math.sin( item.dirY ) * 795, 
      Math.cos( item.dirZ ) * 795,  
      Math.sin( item.dirZ ) * Math.cos( item.dirY )  * 795 
    )
    connector.lookAt( 0, 0, 0 )
    arrConnectors.push( { connector, plug, wire } )
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
  let group = new THREE.Group()
  group.add( diod, corpus )
  return group
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
    connectorsCenter.remove( arrConnectors[ i ].plug )
    connectorsCenter.remove( arrConnectors[ i ].wire )
    let md = arrConnectors[ i ]
    arrConnectors.splice( i, 1 )
    i -- 
  }
  scene.remove( connectorsCenter )
  arrConnectors = []
}

const disposeMesh = mesh => {
  mesh.geometry.dispose()
  mesh.material.dispose()
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
      cube.position.set( xi * 600 - 5000, yi * 600 - 3000, -6000 )
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



/********************************************************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/
/********************************************************************/


var canvases = {
  'dr01': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
         src: 'assets/ill_01_back.png',
         data: null
      },
      'wire': {
        src: 'assets/ill_02_wire.png',
        data: null 
     }      
    }
  },
  'dr02': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
         src: 'assets/ill_02_back.png',
         data: null
      },
      'wire': {
         src: 'assets/ill_02_wire.png',
         data: null 
      },
      'wire_blur': {
         src: 'assets/ill_02_wire_blur.png',
         data: null
      } 
    }
  },
  'dr03': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
         src: 'assets/ill_03_back.png',
         data: null
      },
      'wire': {
         src: 'assets/ill_02_wire.png',
         data: null 
      },
      'wire_blur': {
         src: 'assets/ill_02_wire_blur.png',
         data: null
      } 
    }
  },
  'dr04': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
         src: 'assets/ill_04_back.png',
         data: null
      },
      'wire': {
        src: 'assets/ill_02_wire.png',
        data: null 
     }     
    }
  },
  'dr05': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
         src: 'assets/ill_05_back.png',
         data: null
      },
      'wire': {
        src: 'assets/ill_02_wire.png',
        data: null 
     }      
    }
  }
};

var sprites_Data = { 
  'LeftNORM': {
    start: {
      xMin: 0,
      xMax: 50,
      yMin: 50,
      yMax: 200,
    },
    finish: {
      xMin: 600,
      xMax: 400
    },
    spd: {
      xMin: 1.5,
      xMax: 2.5,
      yMin: 0,
      yMax: 0
    },
    color: 'rgba(255, 255, 0, 1.0)'
  } 
}



/*******************************************************************/

var actionsLoad = [], loaded = 0;

function CANVASES () {
  loadAssetsImgs( function () {
    initCanvases();
    startAnimationCanvases();
  } );
}

var interval 

function startAnimationCanvases() {
  interval = setInterval( drawFrameCanvases, 30 )
}

function drawFrameCanvases() {
  for ( let key in canvases ) {
    updateCanvas( canvases[ key ] )
  }
}



/*******************************************************************/

function loadAssetsImgs ( onload ) {
  for ( let key in canvases ) {
    for  ( let keyNameImg in canvases[ key ].imgs ) {
      actionsLoad.push( function() {
        canvases[ key ].imgs[ keyNameImg ].data = new Image();
        canvases[ key ].imgs[ keyNameImg ].data.src = canvases[ key ].imgs[ keyNameImg ].src;
        canvases[ key ].imgs[ keyNameImg ].data.onload = function () {
          loaded ++
          actionsLoad[ loaded ]()
        } 
      } )     
    }    
  }
  actionsLoad.push( function() { onload() } )
  actionsLoad[ 0 ]() 
}

function initCanvases() {
  for ( let key in canvases ) {
    canvases[ key ].canvas = document.getElementById( key );
    canvases[ key ].ctx = canvases[ key ].canvas.getContext('2d'); 
    initSprites( key );
  }
}

function updateCanvas ( item ) {
  item.ctx.clearRect( 0, 0, item.canvas.width, item.canvas.height )
  item.ctx.globalCompositeOperation = 'source-over';
  item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );
  updateSprites( item )
  if ( item.imgs[ 'wire' ] ) {
    item.ctx.drawImage( item.imgs[ 'wire' ].data, 100, 100 );
  }  
  item.ctx.globalCompositeOperation = 'destination-in';
  item.ctx.drawImage( item.imgs[ 'back' ].data, 0, 0, item.canvas.width, item.canvas.height );  
}



/******************************************************************/

function initSprites ( v ) {
  if ( v == 'dr01' ) {
    canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )       
  }
  if ( v == 'dr02' ) {
    canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )       
  }
  if ( v == 'dr03' ) {
    canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )      
  }
  if ( v == 'dr04' ) {
    canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )      
  }
  if ( v == 'dr05' ) {
    canvases[ v ].sprites.push( createDataSprites( 'LeftNORM', 200 ) )      
  }
}

function createDataSprites ( name, count ) {
  var arr = []
  for ( var i = 0; i < count; i ++ ) {
    let s = {}
    setStartParams( s, name )
    arr.push( s )
  }
  return arr
}

function setStartParams( s, name ) {
  var _pro = sprites_Data[ name ]
  s.type = name  
  s.x = Math.random() * _pro.start.xMax + _pro.start.xMin;
  s.y = Math.random() * _pro.start.yMax + _pro.start.yMin; 
  s.spdX = Math.random() * _pro.spd.xMax + _pro.spd.xMin; 
  s.spdY = Math.random() * _pro.spd.yMax + _pro.spd.yMin; 
  s.color = _pro.color; 
}

function updateSprites ( item ) {
  for ( let i = 0; i < item.sprites.length; i ++ ) {
    for ( let ii = 0; ii < item.sprites[ i ].length; ii ++ ) {
      drawSprite( item, item.sprites[ i ][ ii ] )
    }
  }
}

function drawSprite ( dataCan, sprite ) {
  if ( sprite.x > sprites_Data[ sprite.type ].finish.xMin ) {
    setStartParams( sprite, sprite.type )
  }
  sprite.x += sprite.spdX;
  sprite.y += sprite.spdY;
  dataCan.ctx.fillStyle = sprite.color;
  dataCan.ctx.fillRect( sprite.x, sprite.y, 20, 20  );
}

