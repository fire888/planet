


export { continentsShader, glowShader, setMapToGlowShader, diodShader, spaceShader }


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

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


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

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


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

const spaceShader = {
  uniforms: {
    'iGlobalTime': { type: "f", value: 1.0 },
    'iResolution': { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
    'tDiffuse': { value: null },
    'circleSize': { type: 'f', value: 0.0 }
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
    'uniform float iGlobalTime;',
    'uniform vec2 iResolution;',
    'uniform sampler2D tDiffuse;',
    'uniform float circleSize;',

    //CBS
    //Parallax scrolling fractal galaxy.
    //Inspired by JoshP's Simplicity shader: https://www.shadertoy.com/view/lslGWr
    //http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
    'float field(in vec3 p,float s) {',
      'float strength = 7. + .03 * log(1.e-6 + fract(sin(iGlobalTime) * 4373.11));',
      'float accum = s/4.;',
      'float prev = 0.;',
      'float tw = 0.;',
      'for (int i = 0; i < 26; ++i) {',
        'float mag = dot(p, p);',
        'p = abs(p) / mag + vec3(-.5, -.4, -1.5);',
        'float w = exp(-float(i) / 7.);',
        'accum += w * exp(-strength * pow(abs(mag - prev), 8.2));',
        'tw += w;',
        'prev = mag;',
      '}',
      'return max(0., 3. * accum / tw - .7);',
    '}',
  
    'vec3 nrand3( vec2 co ) {',
      'vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );',
      'vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );',
      'vec3 c = mix(a, b, 0.5);',
      'return c;',
    '}',
   
    // circle
    'float circle(in vec2 _st, in float _radius) {',
      'vec2 dist = _st-vec2(0.5 * clamp(iResolution.x/iResolution.y, 0.0, 1.0), 0.5 * clamp( iResolution.y/iResolution.x, 0.0, 1.0 ) );',
      'return 1.-smoothstep(_radius,',
                           '_radius+( _radius * max( 0.6 - _radius, 0.01 ) ),',
                           'dot(dist,dist)*4.0);',
    '}',
  
    'void mainImage( out vec4 fragColor1, in vec2 fragCoord ) {',     
      'vec2 uv =  vUv * iResolution.xy / max(iResolution.x, iResolution.y);',


      'vec2 uvs = vUv * iResolution.xy / max(iResolution.x, iResolution.y);',
      'vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);',
      'p += .2 * vec3(0.04*iGlobalTime, 0.1,  0.1);',
      'float freqs[4];',
      'freqs[0]=0.2;',
      'freqs[1]=0.5;',
      'freqs[2]=0.1;',
      'freqs[3]=0.7;',
      'float t = field(p,freqs[2]);',
      'float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));',
      //Second Layer
      'vec3 p2 = vec3(uvs / (4.+sin(iGlobalTime*0.11)*0.2+0.2+sin(iGlobalTime*0.15)*0.3+0.4), 1.5) + vec3(2., -1.3, -1.);',
      'p2 += 0.25 * vec3(0.06*iGlobalTime, 0.2,  0.2);',
      //Let's add some stars
      //Thanks to http://glsl.heroku.com/e#6904.0
      'vec2 seed = p.xy * 2.9;',	
      'seed = floor(seed * max(iResolution.y, iResolution.x));',
      'vec3 rnd = nrand3( seed );',
      'vec4 starcolor = vec4(pow(rnd.y,40.0));', 
      //Second Layer
      'vec2 seed2 = p2.xy * 2.9;',
      'seed2 = floor(seed2 * max(iResolution.y, iResolution.x));',
      'vec3 rnd2 = nrand3( seed2 );',
      'starcolor += vec4(pow(rnd2.y,40.0));',
      'vec4 fragColor = mix(freqs[3]-.3, 1., v) * vec4(1.5*freqs[2] * t * t* t , 1.2*freqs[1] * t * t, freqs[3]*t, 1.0)+starcolor;',

      //circle mask
      'float mask = clamp( ',
        'circle( vec2(uv.x - circleSize*0.16 - 0.16, uv.y ), circleSize ) +',
        'circle( vec2(uv.x + circleSize*0.16 + 0.16, uv.y ), circleSize ), 0.0, 1.0 ', 
      ');',
      // glow


      //add mask to space 
      'vec4 spaceWithMask = vec4( fragColor.xyz * ( 20.0 - clamp( circleSize * 50.0, 0.0, 19.4 ) ), 1.0 );', 
      'spaceWithMask = vec4( spaceWithMask * ( mask ) );', 
      //back scene
      'vec4 scene = texture2D( tDiffuse, uv );',
      //add maskToBackScene
      'vec4 sceneWithMask = vec4( scene * ( 1.0 - mask ) );', 

      'fragColor1 = spaceWithMask + sceneWithMask;',
    '}',
  
    'void main(void) {',
      'mainImage(gl_FragColor,gl_FragCoord.xy);',
    '}'
  ].join('\n')
}


