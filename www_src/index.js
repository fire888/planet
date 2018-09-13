

import * as Shaders from "./shaders.js"
import * as DocElems from "./documentElems.js"


/*******************************************************************/

window.onload = () => {
  loadAssets( () => { 
    initScene()
    DocElems.setActionsResize( resizeCanvas )
    createEarth()
    createConnectors()
    drawFrame()
    DocElems.showCanvasWebGL()
    DocElems.hidePreloader()
    DocElems.setActionsWeel( onUserActionMouseWheel )   
  } )
}




/*******************************************************************/
/*******************************************************************/

let textureLoader,
textures = {
  sceneBack: null,
  waterNormals: null,
  continents: null
}
let objectLoader,
geoms = {
  corpus: null,
  diod: null
}

const loadAssets = ( onLoad ) => {
  textureLoader = new THREE.TextureLoader()
  objectLoader = new THREE.OBJLoader()
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
  .then( () => new Promise ( ( resolve ) => {
        objectLoader.load( 
            'assets/connector.obj', 
            ( obj ) => {
                obj.traverse( ( child ) => {
                  if ( child instanceof THREE.Mesh != true ) return
                  if ( child.name == 'diod' ) geoms.diod = child.geometry
                  if ( child.name == 'iron' )  geoms.corpus = child.geometry 
                  if ( geoms.diod && geoms.corpus ) resolve() 
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
  scene = new THREE.Scene()
  scene.background = textures.sceneBack
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 3.5, 15000 )
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

const resizeCanvas = () => {
  renderer.setSize( window.innerWidth, window.innerHeight )
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()  
} 
    
const drawFrame = () => {  
  updateAnimationEarth()
  updateAnimationConnectors()
  renderer.render( scene, camera )
  requestAnimationFrame( drawFrame ) 
}




/*******************************************************************/
/*******************************************************************/

let earth, globeMesh, continentsMesh, glowMesh

const createEarth = () => {
  earth = new THREE.Group()
  globeMesh = createGlobe() 
  earth.add( globeMesh )
  continentsMesh = createContinents() 
  earth.add( continentsMesh )
  glowMesh = createEarthGlow()
  scene.add( glowMesh )
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
    new THREE.ShaderMaterial( Shaders.continentsShader )
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

const createEarthGlow = () => {
  let mesh =  new THREE.Mesh( 
    new THREE.SphereGeometry( 780, 40, 40 ),
    new THREE.ShaderMaterial( Shaders.glowEarthShader )
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
earthDir = 'left' // || 'right' || 'normal'  

const updateAnimationEarth = () => {
  if ( ! earth ) return
  if ( earthSpd > 0.005 && earthDir == 'left' ) earthDir = 'right' 
  if ( earthSpd < -0.005 && earthDir == 'right' ) earthDir = 'left'  
  if ( earthDir == 'left' ) earthSpd += 0.0001
  if ( earthDir == 'right') earthSpd -= 0.0001
  if ( earthDir == 'normal') {
    if ( earthSpd < 0.02 ) { 
      earthSpd += 0.00005
      if ( continentsMesh.material.uniforms.light.value < 1.35 ) {
        continentsMesh.material.uniforms.light.value += 0.012
        glowMesh.material.uniforms.light.value += 0.0034
      }
    } else {
      earthSpd = 0.02
    }        
  }   
  earth.rotation.y += earthSpd
}

const onUserActionMouseWheel = () => { 
  if ( earthDir == 'normal' ) return
  earthDir = 'normal'
}  

 


/*******************************************************************/
/*******************************************************************/

let arrConnectors = [], materialIron, materialDiod  

const createConnectors = () => {
  materialIron = createMaterialIron()
  materialDiod = createMaterialDiod()
  for ( let i = 0; i < 12; i ++ ) {
    let connector = createConnector()
    scene.add( connector )
    connector.rotation.x = - Math.PI / 2
    connector.position.x = i * 300 - 1700
    arrConnectors.push( { mesh: connector } )      
  }
}

const createMaterialIron = () => {
  return new THREE.MeshPhongMaterial( {
    color: 0x1520,
    emissive: 0x20202,
    specular: 0xc0c0c0,
    shininess: 100
  } )
}

const createMaterialDiod = () => { 
  return new THREE.ShaderMaterial( Shaders.diodShader )
}      

const createConnector = () => {
  let corpus = new THREE.Mesh( geoms.corpus, materialIron )
  let diod = new THREE.Mesh( geoms.diod, materialDiod )
  let group = new THREE.Group()
  group.add( corpus )
  group.add( diod )
  return group
}


/*******************************************************************/

const updateAnimationConnectors = () => {
  if ( arrConnectors.length == 0 ) return
  if ( continentsMesh.material.uniforms.light.value < 1.35 && earthDir == 'normal' ) 
    materialDiod.uniforms.light.value -= 0.01  
}


