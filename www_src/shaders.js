

export { continentsShader, glowEarthShader, diodShader }


const continentsShader = {
    uniforms: {		
      'tDiffuse' : { value: null },
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
        "vec4 points = vec4( 1.5 * light - 0.2, 1.5 * light - 0.2, 1.8 * light,  (1.01 - diff.y) * point );",
        //contour
        "vec4 contur = vec4( 1.2*light, 1.2*light, 1.8*light,  diff.x );",
        //continents
        "vec4 continents = vec4( .1, .1, .2, (1.5 - diff.y) * (1.0 - points.z) * 0.01 );",
  
        "gl_FragColor = contur + continents + points;",
      '}'
    ].join( "\n" )
  }
  
  
  const glowEarthShader = {
    uniforms: {		
      'viewVector' : { value: new THREE.Vector3( -800, 0, 1800 ) },
      'light': { value: 0.0 }, 
      'glowColor': { value: new THREE.Vector3( 0.5, 0.5, 0.9 ) }      	
    },
    vertexShader: [	
      'uniform vec3 viewVector;',
      'uniform float light;',
      'varying float intensity;',
  
      'void main() {',
        'vec3 vNormal = normalize( normalMatrix * normal );',
        'vec3 vNormel = normalize( normalMatrix * viewVector );',
        'intensity = pow( light - dot(vNormal, vNormel), 2.9 );',
        
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join( '\n' ),	
    fragmentShader: [
      'uniform vec3 glowColor;',
      'varying float intensity;',
      'void main() {',
        'vec3 glow = glowColor * intensity;',
        'gl_FragColor = vec4( glow, 1.0 );',
      '}'
    ].join( "\n" )
  } 
  
  
  const diodShader = {
    uniforms: {		
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
      'void main() {',
        'gl_FragColor = vec4( 0.8*light, 0.9*light, 1.3*light, 1.0 );',
      '}'
    ].join( "\n" )
  } 
  
  
  