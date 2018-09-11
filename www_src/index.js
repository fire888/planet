

let controls, scene, camera, renderer,
textureCloads


/*******************************************************************/

const createWebGl = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.TextureLoader().load( 'assets/background_map.jpg' );

  camera = new THREE.PerspectiveCamera( 75,	window.innerWidth / window.innerHeight, 3.5, 15000 )
  camera.position.set( -1800, 200, 300 )
  camera.lookAt( scene.position )
  controls = new THREE.OrbitControls( camera )    

  let pointL = new THREE.PointLight( 0xffffff, 2.0 )
  pointL.position.set( -400, 300, 1600 )
  scene.add( pointL )
  let lightAmb = new THREE.AmbientLight( 0xadd6eb, 0.5 )
  scene.add( lightAmb )

  renderer = new THREE.WebGLRenderer( { alpha: true, canvas: document.getElementById( 'webGL' ) } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )	

  scene.add( createSphere() )

  drawFrame()
}
  
  
const drawFrame = () => {  
  renderer.render( scene, camera )
  controls.update()
  requestAnimationFrame( drawFrame ) 
}


/********************************************************************/

const createSphere = () => {
  let g = new THREE.SphereGeometry( 600, 80, 80 )
  let m = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load( 'assets/Voda_normali.jpg' ),
    bumpMap: new THREE.TextureLoader().load( 'assets/Shum_dlya_vody_bump.jpg' ),
    bumpScale: 1.65,
    shininess: 0.0,
    wireframe: false,
    transparent: true,
    opacity: 0.94,
    color: 0x1F2A44,
  })

  return new THREE.Mesh(g, m)
}


const earthContourShadow = () => {
  let g = new THREE.SphereGeometry(603, 50, 50, 0, Math.PI*2, 0, Math.PI);
  let m = new THREE.MeshPhongMaterial({
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


const testBox = () => { 
  return ( new THREE.Mesh(
    new THREE.BoxGeometry( 30, 30, 30 ),
    new THREE.MeshBasicMaterial( { color: 0xff0000 } ) 
  ) ) 
}


/******************************************************************/

window.onload = () => {
  textureCloads = new THREE.TextureLoader()
    .load( 'assets/clouds_new_1.png', () => {
      createWebGl()
      scene.add( createSphere() )
      scene.add( earthContourShadow() )
      scene.add( clouds() )
      scene.add( cloudsShadow() )  
    } )
}  


