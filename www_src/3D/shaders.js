


export { continentsShader, glowShader, setMapToGlowShader, diodShader }

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
      'return float(1. - smoothstep(radius, radius + .4, len));',  
    '}',

    'void main() {',	

      'vec2 uv = vUv;',

      "vec4 diff = texture2D(tDiffuse, uv);",

      //points
      'vec2 tileuv = vec2(uv.x, uv.y*0.8) * 100.;',
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

const setMapToGlowShader = map => {
  glowShader.uniforms[ 'tDiffuse' ].value = map
}

const glowShader = {
  uniforms: {		
    'tDiffuse': { type: 't', value: null },
    'light': { value: 1.0 },        	
  },
  vertexShader: [	
    'varying vec2 vUv;',
    'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join( '\n' ),	
  fragmentShader: [
    'varying vec2 vUv;',
    'uniform sampler2D tDiffuse;',
    'uniform float light;',
    'void main() {',
      'vec2 uv = vUv;',
      'vec4 txt = texture2D(tDiffuse, uv);',
      'gl_FragColor = vec4( txt.xyz * vec3( 1.5, 1.9, 2.6) * light, txt.x*2.0);',
    '}'
  ].join( "\n" )  
}
  
const diodShader = {
  uniforms: {		
    'color': { value: new THREE.Vector3( 1, 1, 1) },   
    'dark': { value: 0.0 },
    'time': { value: 1.1 }        	
  },
  vertexShader: [	
    'uniform float dark;',
    'varying vec2 vUv;',
    'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join( '\n' ),	
  fragmentShader: [
    'uniform float dark;',
    'uniform vec3 color;',
    'uniform float time;',
    'varying vec2 vUv;',
    'void main() {',
      'vec2 st = vUv.xy;',
      'float translate = fract(time*0.13);',
      'st.y -= translate*5.1980;',    
      'float line = float(sin(st.y/0.0915));',      
      /*'float alpha = sin(clr.y/0.8)/0.1+3.0;',*/
      'gl_FragColor = vec4( 0.3 - dark*2.0, 0.6 + line*0.2 - dark*2.0, 1.1 + line*0.4 - dark*2.0, 1.0 );',
    '}'
  ].join( "\n" )
} 
  

