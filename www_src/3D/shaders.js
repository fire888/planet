


export { continentsShader, glowEarthShader, diodShader }

const continentsShader = {
  uniforms: {		
    'red': { value: 0.0 },
    'green': { value: 0.021 },
    'blue':  { value: 0.04 },

    'tDiffuse': { value: null },
    'light': { value: 0.0 },       	
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
    'precision mediump float;',
    '#endif',

    'uniform float red;', 
    'uniform float green;', 
    'uniform float blue;', 

    'uniform sampler2D tDiffuse;', 
    'uniform float light;', 

    'varying vec2 vUv;',

    'float point (in vec2 uv, in vec2 center, in float radius) {',
      'float len = length(center - uv);',
      'return float(1. - smoothstep(radius, radius + .6, len));',  
    '}',

    'void main() {',	

      'vec2 uv = vUv;',

      "vec4 diff = texture2D(tDiffuse, uv);",

      //points
      'vec2 tileuv = vec2(uv.x, uv.y*0.8) * 180.;',
      'float radius = .03;',
      'vec2 center = floor( tileuv ) + vec2( 0.5, 0.5 );',
      'float point = point( tileuv, center, radius );',
      "vec4 points = vec4( red + light, green + light, blue + light,  (1.01 - diff.y) * point );",
      //contour
      "vec4 contur = vec4( red + light, green + light, blue + light,  diff.x );",
      //continents
      "vec4 continents = vec4( red, green, blue, (1.5 - diff.y) * (1.0 - points.z) * 0.01 );",

      "gl_FragColor = contur + continents + points;",
    '}'
  ].join( "\n" )
}

const glowEarthShader = {
  uniforms: {		
    'viewVector' : { value: new THREE.Vector3(  -800, -200, 8200 ) },
    'light': { value: 0.3 }, 
    'glowColor': { value: new THREE.Vector3( 0.0, 0.24, 0.47) },
    'border': { value: 3.3 },        	
  },
  vertexShader: [	
    'uniform vec3 viewVector;',
    'uniform float light;',
    'uniform float border;',
    'varying float intensity;',

    'void main() {',
      'vec3 vNormal = normalize( normalMatrix * normal );',
      'vec3 vNormel = normalize( normalMatrix * viewVector );',
      'intensity = pow( abs(light) - dot(vNormal, vNormel), border );',
      
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join( '\n' ),	
  fragmentShader: [
    'uniform vec3 glowColor;',
    'uniform float light;',
    'varying float intensity;',
    'void main() {',
      'vec3 glow = ( glowColor + light ) * intensity;',
      'gl_FragColor = vec4( glow, 1.0 );',
    '}'
  ].join( "\n" )
}
  
const diodShader = {
  uniforms: {		
    'color': { value: new THREE.Vector3( 1.5, 1.5, 1.9 ) },   
    'light': { value: 1.0 }       	
  },
  vertexShader: [	
    'uniform float light;',
    'void main() {',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join( '\n' ),	
  fragmentShader: [
    'uniform float light;',
    'uniform vec3 color;',
    'void main() {',
      'gl_FragColor = vec4( color * light, 1.0 );',
    '}'
  ].join( "\n" )
} 
  
  
  