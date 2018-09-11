<template>
	<section class="container">
    <canvas id="basicScene"></canvas>
    <script id="vertexShader" type="x-shader/x-vertex">
      precision mediump float;
      precision mediump int;

      uniform mat4 modelViewMatrix; 
      uniform mat4 projectionMatrix; 

      attribute vec3 position;
      attribute vec4 color;

      varying vec3 vPosition;

      void main() {
        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    </script>
    <script id="fragmentShader" type="x-shader/x-fragment">
      precision mediump float;
      precision mediump int;

      uniform float time;

      varying vec3 vPosition;

      void main() {

        float border = 0.2;
        float radius = 0.5;
        vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);
        vec4 color1 = vec4(1.0, 1.0, 1.0, 1.0);
        vec2 m = vPosition.xy;
        float dist = radius - sqrt(m.x * m.x + m.y * m.y);
        float t = 0.0;
        if (dist > border)
          t = 1.0;
        else if (dist > 0.0)
          t = dist / border;
        gl_FragColor = mix(color0, color1, t);
      }
    </script>
	</section>
</template>
<script>
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREEx from 'threex.domevents';
import * as gsap from 'gsap';
import * as Stats from 'stats-js';
let OrbitControls = require('three-orbit-controls')(THREE);
export default {
data(){
	return {

	}
},
mounted(){
	var THREE = require('three')
var anim;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
//VARIABLES

	let canvas = document.getElementById('basicScene');
	let width = window.innerWidth;
	let height = window.innerHeight;
	var fov = 75;
	var near = 0.1;
	var far = 20000;
	var pos_x = 0;
	var pos_y = 0;
	var pos_z = 1800;
	var color = 0x000000;
	var mouse = new THREE.Vector2(), INTERSECTED;

	var camera, scene, renderer, group, groupPlanet, controls, mesh, domEvents;
	var EarthTexture, earthTexture;
	var EarthContour, earthContour;
	var EarthContourShadow, earthContourShadow;
	var EarthPointsShadow, earthPointsShadow;
	var EarthPoints, earthPoints;
	var Clouds, clouds;
	var CloudsShadow, cloudsShadow;
	var group_wire_1, group_wire_2, group_wire_3,
		group_wire_4, group_wire_5, group_wire_6;
	var Wire, wire,
		Connector1, Connector2,
		connector1, connector2,
		sticker, Sticker,
		StickerGlow, stickerGlow;
	var Wire_2, wire_2,
		Connector1_2, Connector2_2,
		connector1_2, connector2_2,
		sticker_2, Sticker_2,
		StickerGlow_2, stickerGlow_2;
	var Wire_3, wire_3,
		Connector1_3, Connector2_3,
		connector1_3, connector2_3,
		sticker_3, Sticker_3,
		StickerGlow_3, stickerGlow_3;
	var Wire_4, wire_4, Wire4,
		Connector1_4, Connector2_4,
		connector1_4, connector2_4,
		sticker_4, Sticker_4,
		StickerGlow_4, stickerGlow_4;
	var Wire_5, wire_5,
		Connector1_5, Connector2_5,
		connector1_5, connector2_5,
		sticker_5, Sticker_5,
		StickerGlow_5, stickerGlow_5;
	var Wire_6, wire_6,
		Connector1_6, Connector2_6,
		connector1_6, connector2_6,
		sticker_6, Sticker_6,
		StickerGlow_6, stickerGlow_6;
		//здесь передается статус анимации, так же возможно закидывать любые данные для динамических изменений.
function resetAnimation(){
  anim = {speed:0,
          status : "beforeStart",
         };
};

//CREATE_SCENE

	function createScene() {

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );
		scene.background = new THREE.TextureLoader().load( 'background_map.jpg' );
		//scene.background = new THREE.Color( 0xffffff );
		group = new THREE.Object3D();
		groupPlanet = new THREE.Object3D();
		group_wire_1 = new THREE.Object3D();
		group_wire_2 = new THREE.Object3D();
		group_wire_3 = new THREE.Object3D();
		group_wire_4 = new THREE.Object3D();
		group_wire_5 = new THREE.Object3D();
		group_wire_6 = new THREE.Object3D();

		camera = new THREE.PerspectiveCamera( fov, width / height, near, far );
		camera.position.set( pos_x, pos_y, pos_z );

		scene.add(group);
		scene.add(groupPlanet);
		scene.add(group_wire_1);
		scene.add(group_wire_2);
		scene.add(group_wire_3);
		scene.add(group_wire_4);
		scene.add(group_wire_5);
		scene.add(group_wire_6);

		scene.add(camera);
		window.addEventListener('resize', onResize, false);
	};

	function onResize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = (window.innerWidth / window.innerHeight);
		camera.updateProjectionMatrix();
	};

	function createRenderer() {
		renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
		renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
		renderer.setSize(width, height);
		renderer.shadowMap.enabled = false;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	};
	
//CREATE_SCENE end
//TEXTURE AND CONTOUR
	EarthTexture = function() {

		//let color_99 = 0x04191b;//let color_99 = 0x020f10;//let color_99 = 0x031414;//let color_99 = 0x000f11;//let color_99 = 0x010f12;
		var color_of_direct_light= 0x000c18;
		var color_of_bright_side= 0x000c18;
		var color_of_dark_side= 0x020b14;
		var g = new THREE.SphereGeometry(600, 240, 240, 0, Math.PI*2, 0, Math.PI);
		var m = new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load('Voda_normali.jpg'),
			bumpMap: new THREE.TextureLoader().load('Shum_dlya_vody_bump.jpg'),
			bumpScale: 1.65,
			shininess: 0.0,
			wireframe: false,
			transparent: true,
			opacity: 0.94,
			color: 0x1F2A44,
			//diffuse: color_of_bright_side,
			//emissive: color_of_dark_side,
			//specular: color_of_direct_light,
			//shininess: 1,
			//shading: THREE.FlatShading
			//normalMap: new THREE.TextureLoader().load('Voda_normali.jpg'),
			//normalMapScale: 1.65,
		});

			this.mesh = new THREE.Mesh(g, m);

			this.mesh.recieveShadow = false;
			this.mesh.castShadow = false;

			m.fog = false;
			m.depthWrite = true;
			//m.map.generateMipalphaMaps = false;
			//m.map.magFilter = THREE.LinearFilter;
			//m.map.minFilter = THREE.LinearFilter;
			m.needsUpdate = true;

	};

	EarthContourShadow = function() {

		let g = new THREE.SphereGeometry(603, 50, 50, 0, Math.PI*2, 0, Math.PI);
		let m = new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load('EarthMap_transparent.png'),
			side: THREE.DoubleSide,
			shininess: 0.0,
			transparent: true,
			opacity: 1.0,
			color: 0x000000,
			diffuse: 0x000000,
			emissive: 0x000000,
			specular: 0x000000,
			//specular: 0x00ff00,
			//emissive: 0x000000,
			//shininess: 1,
			//shading: THREE.FlatShading
		});

		m.map.generateMipalphaMaps = false;
		m.map.magFilter = THREE.LinearFilter;
		m.map.minFilter = THREE.LinearFilter;
		m.needsUpdate = true;
		m.fog = false;
		m.depthWrite = true;

		m.blending = THREE.SubstractiveBlending;
		this.mesh = new THREE.Mesh(g, m);

	};
	EarthContour = function() {	
		let g = new THREE.SphereGeometry(615, 50, 50, 0, Math.PI*2, 0, Math.PI);
		let m = new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load('EarthMap_transparent.png'),
			side: THREE.DoubleSide,
			shininess: 0.0,
			transparent: true,
			opacity: 1.0,
			color: 0xffffff,
			diffuse: 0xffffff,
			emissive: 0xffffff,
			specular: 0xffffff,
			//emissive: 0x000000,
			//shininess: 1,
			//shading: THREE.FlatShading
		});

		m.map.generateMipalphaMaps = false;
		m.map.magFilter = THREE.LinearFilter;
		m.map.minFilter = THREE.LinearFilter;
		m.needsUpdate = true;
		m.fog = false;
		m.depthWrite = false;
		//m.recieveShadow = true;
		//m.castShadow = true;

		m.blending = THREE.SubstractiveBlending;
		this.mesh = new THREE.Mesh(g, m);

	};
//TEXTURE AND CONTOUR end
//ADD EARTH POINTS
	EarthPointsShadow = function (){
		//EARTH_POINTS_SHADOW
			var g = new THREE.SphereBufferGeometry(603, 300, 150);

			var colors = [];
			var color = new THREE.Color(0xffffff);

			var earth_shadow_points_loader = new THREE.TextureLoader();
				earth_shadow_points_loader.setCrossOrigin('');

			var earth_shadow_points_texture = earth_shadow_points_loader.load('contour2_15_1.png');
				earth_shadow_points_texture.wrapS = THREE.RepeatWrapping;
				earth_shadow_points_texture.wrapT = THREE.RepeatWrapping;
				earth_shadow_points_texture.repeat.set(1, 1);

			var earth_shadow_points_shape = earth_shadow_points_loader.load('030303.png');


			var m =  new THREE.ShaderMaterial({
					vertexColors: THREE.VertexColors,
					uniforms: {
						visibility: {
							value: earth_shadow_points_texture
						},
						shift: {
							value: 0
						},
						shape: {
							value: earth_shadow_points_shape
						},
						size: {
							value: 25
						},
						scale: {
							value: window.innerHeight / 8
						}
					},
					vertexShader: `			
						uniform float scale;
						uniform float size;

						varying vec2 vUv;
						varying vec3 vColor;
			      
						void main() {
							vUv = uv;
							vColor = color;
							vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
							gl_PointSize = size * ( scale / length( mvPosition.xyz ));
							gl_Position = projectionMatrix * mvPosition;
						}
					`,
					fragmentShader: `
					uniform sampler2D visibility;
					uniform float shift;
					uniform sampler2D shape;

					varying vec2 vUv;
					varying vec3 vColor;

					void main() {
						
						vec2 uv = vUv;
						uv.x += shift;
						vec4 v = texture2D(visibility, uv);
						if (length(v.rgb) > 0.6) discard;

						
						gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
						gl_FragColor.a = 0.0625;
						vec4 shapeData = texture2D( shape, gl_PointCoord );
						if (shapeData.a < 0.1) discard;
						gl_FragColor = gl_FragColor * shapeData;
						
					}
				`,
					transparent: true,
					lights: false
				});
			//m.depthWrite = false;
			this.points = new THREE.Points(g,m);
			
				//gl_FragColor = vec4( vColor, 1.0 );
	};
		//EARTH_POINTS_SHADOW_END
		//EARTH_POINTS
	EarthPoints = function (){
			var g = new THREE.SphereBufferGeometry(615, 300, 150);

			var colors = [];
			var color = new THREE.Color(0xffffff);

			var loader = new THREE.TextureLoader();
				loader.setCrossOrigin('');

			var texture = loader.load('contour2_15_1.png');
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(1, 1);	

			var disk = loader.load('circle_1.png');



			var m = new THREE.ShaderMaterial({
				vertexColors: THREE.VertexColors,
				uniforms: {
					visibility: {
						value: texture
					},
					shift: {
						value: 0
					},
					shape: {
						value: disk
					},
					size: {
						value: 25
					},
					scale: {
						value: window.innerHeight / 8
					}
				},
				vertexShader: `			
					uniform float scale;
					uniform float size;

					varying vec2 vUv;
					varying vec3 vColor;
		      
					void main() {
						vUv = uv;
						vColor = color;
						vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
						gl_PointSize = size * ( scale / length( mvPosition.xyz ));
						gl_Position = projectionMatrix * mvPosition;
					}
				`,
				fragmentShader: `
					uniform sampler2D visibility;
					uniform float shift;
					uniform sampler2D shape;

					varying vec2 vUv;
					varying vec3 vColor;

					void main() {
						
						vec2 uv = vUv;
						uv.x += shift;
						vec4 v = texture2D(visibility, uv);
						if (length(v.rgb) > 1.1) discard;

						gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
						gl_FragColor.a = 0.8;
						vec4 shapeData = texture2D( shape, gl_PointCoord );
						if (shapeData.a < 0.1) discard;
						gl_FragColor = gl_FragColor * shapeData;
						
					}
				`,
				transparent: true,
				lights: false,
				opacity: 1.0
				});
			this.points = new THREE.Points(g, m);
				//m.depthWrite = false;

	};
//ADD EARTH POINTS end
//LIGHTS AND CLOUDS
	function addLights() {
		var ambiColor = "#ffffff";
		var ambientLight = new THREE.AmbientLight(ambiColor, 0.5);//0.5
		scene.add(ambientLight);

	};

	function addDirLight(){
		var directionalLightColor = new THREE.Color(0xffffff);
		var directionalLight = new THREE.DirectionalLight(directionalLightColor);
		directionalLight.position.set(300, 80, -2000);
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.near = 0.5;
		directionalLight.shadow.camera.far = 1300;
		directionalLight.shadow.camera.left = -600;
		directionalLight.shadow.camera.right = 600;
		directionalLight.shadow.camera.top = 600;
		directionalLight.shadow.camera.bottom = -600;
		directionalLight.shadow.mapSize.height = 1024;
		directionalLight.shadow.mapSize.width = 1024;
		camera.add(directionalLight);

	};

	Clouds = function (){

		//CLOUDS_SPHERE_SHADOW
		let mt = new THREE.TextureLoader().load('clouds_new_1.png');
		let mta = new THREE.TextureLoader().load('clouds_new_1.png');
		let g = new THREE.SphereGeometry(603, 50, 50, 0, 2*Math.PI, 0, Math.PI);
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
			//clouds_material.map.generateMipalphaMaps = false;
			//clouds_material.map.magFilter = THREE.LinearFilter;
			//clouds_material.map.minFilter = THREE.LinearFilter;
			//clouds_material.needsUpdate = true;
			//clouds_material.fog = false;
		this.mesh = new THREE.Mesh(g, m);
	};
	CloudsShadow = function (){

			let mt = new THREE.TextureLoader().load('clouds_new_1.png');
			let mta = new THREE.TextureLoader().load('clouds_new_1.png');
			let g = new THREE.SphereGeometry(618, 500, 500, 0, 2*Math.PI, 0, Math.PI);
			let m = new THREE.MeshLambertMaterial({
				map: mt,
				alphaMap: mta,
				blending: 2,
				side: THREE.DoubleSide,
				transparent:true,
				opacity: 0.6,
				color: 0x505050,
				emissive: 0x090909
			});
				m.map.generateMipalphaMaps = false;
				m.map.magFilter = THREE.LinearFilter;
				m.map.minFilter = THREE.LinearFilter;
				m.needsUpdate = true;
				m.fog = false;
			this.mesh = new THREE.Mesh(g, m);
		};
//LIGHTS AND CLOUDS end
//AUREOLE
	function addAureole(){

		//EARTH_AUREOLE
		var customMaterial = new THREE.ShaderMaterial( 
		{
		    uniforms: 
			{ 
				"c":   { type: "f", value: 0.8 },//0.4 -> 0.7
				"p":   { type: "f", value: 1.6 },
				glowColor: { type: "c", value: new THREE.Color(0x304a62) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}
			`,
			fragmentShader: `
				uniform vec3 glowColor;
				varying float intensity;
				void main() 
				{
					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );
				}
			`,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
				customMaterial.fog = false;
		customMaterial.depthWrite = false;
		scene.add( moonGlow );
		moonGlow.position.x = 600;
		moonGlow.rotation.y = -18*(Math.PI/180);


	};

	function addAureole_1(){
		//EARTH_AUREOLE
		var luminiGeometry = new THREE.SphereBufferGeometry(618, 300, 150);
		var lumini_loader = new THREE.TextureLoader();
			lumini_loader.setCrossOrigin('');

		var lumini_texture = lumini_loader.load('contour2_15_1.png');
		lumini_texture.wrapS = THREE.RepeatWrapping;
		lumini_texture.wrapT = THREE.RepeatWrapping;
		lumini_texture.repeat.set(1, 1);


		var luminiMaterial = new THREE.ShaderMaterial( 
		{
			vertexColors: THREE.VertexColors,
		    uniforms: 
			{ 
				visibility: {
					value: lumini_texture
				},
				shift: {
					value: 0
				},
				size: {
					value: 45
				},
				scale: {
					value: window.innerHeight / 8
				},
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 0.95 },
				glowColor: { type: "c", value: new THREE.Color(0xffffff) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform float scale;
				uniform float size;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vUv = uv;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_PointSize = size * ( scale / length( mvPosition.xyz ));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D visibility;
				uniform float shift;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 glowColor;
				varying float intensity;

				void main() 
				{
					vec2 uv = vUv;
					uv.x += shift;
					vec4 v = texture2D(visibility, uv);
					if (length(v.rgb) > 0.6) discard;

					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );

				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		//luminiMaterial.uniforms.visibility.value.generateMipalphaMaps = false;
		//luminiMaterial.uniforms.visibility.value.magFilter = THREE.LinearFilter;
		//luminiMaterial.uniforms.visibility.value.minFilter = THREE.LinearFilter;
		//luminiMaterial.needsUpdate = true;
		luminiMaterial.depthWrite = true;
		var lumini = new THREE.Mesh(luminiGeometry, luminiMaterial);
		//let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		//var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
		group.add( lumini );
		//EARTH_AUREOLE_END

	};

	function addAureole_2(){
		//EARTH_AUREOLE
		var luminiGeometry_1 = new THREE.SphereBufferGeometry(619, 300, 150);
		var lumini_loader = new THREE.TextureLoader();
			lumini_loader.setCrossOrigin('');

		var lumini_texture = lumini_loader.load('contour2_15_1.png');
		lumini_texture.wrapS = THREE.RepeatWrapping;
		lumini_texture.wrapT = THREE.RepeatWrapping;
		lumini_texture.repeat.set(1, 1);


		var luminiMaterial_1 = new THREE.ShaderMaterial( 
		{
			vertexColors: THREE.VertexColors,
		    uniforms: 
			{ 
				visibility: {
					value: lumini_texture
				},
				shift: {
					value: 0
				},
				size: {
					value: 25
				},
				scale: {
					value: window.innerHeight / 8
				},
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 0.95 },
				glowColor: { type: "c", value: new THREE.Color(0xffffff) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform float scale;
				uniform float size;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vUv = uv;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_PointSize = size * ( scale / length( mvPosition.xyz ));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D visibility;
				uniform float shift;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 glowColor;
				varying float intensity;

				void main() 
				{
					vec2 uv = vUv;
					uv.x += shift;
					vec4 v = texture2D(visibility, uv);
					if (length(v.rgb) > 0.6) discard;

					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );

				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		//luminiMaterial.uniforms.visibility.value.generateMipalphaMaps = false;
		//luminiMaterial.uniforms.visibility.value.magFilter = THREE.LinearFilter;
		//luminiMaterial.uniforms.visibility.value.minFilter = THREE.LinearFilter;
		//luminiMaterial.needsUpdate = true;
		luminiMaterial_1.depthWrite = true;
		var lumini_1 = new THREE.Mesh(luminiGeometry_1, luminiMaterial_1);
		//let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		//var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
		group.add( lumini_1 );
		//EARTH_AUREOLE_END

	};

	function addAureole_3(){
		//EARTH_AUREOLE
		var luminiGeometry_2 = new THREE.SphereBufferGeometry(620, 300, 150);
		var lumini_loader = new THREE.TextureLoader();
			lumini_loader.setCrossOrigin('');

		var lumini_texture = lumini_loader.load('contour2_15_1.png');
		lumini_texture.wrapS = THREE.RepeatWrapping;
		lumini_texture.wrapT = THREE.RepeatWrapping;
		lumini_texture.repeat.set(1, 1);


		var luminiMaterial_2 = new THREE.ShaderMaterial( 
		{
			vertexColors: THREE.VertexColors,
		    uniforms: 
			{ 
				visibility: {
					value: lumini_texture
				},
				shift: {
					value: 0
				},
				size: {
					value: 25
				},
				scale: {
					value: window.innerHeight / 8
				},
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 0.95 },
				glowColor: { type: "c", value: new THREE.Color(0xffffff) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform float scale;
				uniform float size;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vUv = uv;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_PointSize = size * ( scale / length( mvPosition.xyz ));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D visibility;
				uniform float shift;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 glowColor;
				varying float intensity;

				void main() 
				{
					vec2 uv = vUv;
					uv.x += shift;
					vec4 v = texture2D(visibility, uv);
					if (length(v.rgb) > 0.6) discard;

					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );

				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		//luminiMaterial.uniforms.visibility.value.generateMipalphaMaps = false;
		//luminiMaterial.uniforms.visibility.value.magFilter = THREE.LinearFilter;
		//luminiMaterial.uniforms.visibility.value.minFilter = THREE.LinearFilter;
		//luminiMaterial.needsUpdate = true;
		luminiMaterial_2.depthWrite = true;
		var lumini_2 = new THREE.Mesh(luminiGeometry_2, luminiMaterial_2);
		//let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		//var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
		group.add( lumini_2 );
		//EARTH_AUREOLE_END

	};

	function addAureole_4(){
		//EARTH_AUREOLE
		var luminiGeometry_3 = new THREE.SphereBufferGeometry(612, 300, 150);
		var lumini_loader = new THREE.TextureLoader();
			lumini_loader.setCrossOrigin('');

		var lumini_texture = lumini_loader.load('contour2_15_1.png');
		lumini_texture.wrapS = THREE.RepeatWrapping;
		lumini_texture.wrapT = THREE.RepeatWrapping;
		lumini_texture.repeat.set(1, 1);


		var luminiMaterial_3 = new THREE.ShaderMaterial( 
		{
			vertexColors: THREE.VertexColors,
		    uniforms: 
			{ 
				visibility: {
					value: lumini_texture
				},
				shift: {
					value: 0
				},
				size: {
					value: 25
				},
				scale: {
					value: window.innerHeight / 8
				},
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 0.95 },
				glowColor: { type: "c", value: new THREE.Color(0xffffff) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform float scale;
				uniform float size;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vUv = uv;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_PointSize = size * ( scale / length( mvPosition.xyz ));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D visibility;
				uniform float shift;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 glowColor;
				varying float intensity;

				void main() 
				{
					vec2 uv = vUv;
					uv.x += shift;
					vec4 v = texture2D(visibility, uv);
					if (length(v.rgb) > 0.6) discard;

					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );

				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		//luminiMaterial.uniforms.visibility.value.generateMipalphaMaps = false;
		//luminiMaterial.uniforms.visibility.value.magFilter = THREE.LinearFilter;
		//luminiMaterial.uniforms.visibility.value.minFilter = THREE.LinearFilter;
		//luminiMaterial.needsUpdate = true;
		luminiMaterial_3.depthWrite = true;
		var lumini_3 = new THREE.Mesh(luminiGeometry_3, luminiMaterial_3);
		//let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		//var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
		group.add( lumini_3 );
		//EARTH_AUREOLE_END

	};

	function addAureole_5(){
		//EARTH_AUREOLE
		var luminiGeometry_4 = new THREE.SphereBufferGeometry(611, 300, 150);
		var lumini_loader = new THREE.TextureLoader();
			lumini_loader.setCrossOrigin('');

		var lumini_texture = lumini_loader.load('contour2_15_1.png');
		lumini_texture.wrapS = THREE.RepeatWrapping;
		lumini_texture.wrapT = THREE.RepeatWrapping;
		lumini_texture.repeat.set(1, 1);


		var luminiMaterial_4 = new THREE.ShaderMaterial( 
		{
			vertexColors: THREE.VertexColors,
		    uniforms: 
			{ 
				visibility: {
					value: lumini_texture
				},
				shift: {
					value: 0
				},
				size: {
					value: 25
				},
				scale: {
					value: window.innerHeight / 8
				},
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 0.95 },
				glowColor: { type: "c", value: new THREE.Color(0xffffff) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform float scale;
				uniform float size;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vUv = uv;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_PointSize = size * ( scale / length( mvPosition.xyz ));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D visibility;
				uniform float shift;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 glowColor;
				varying float intensity;

				void main() 
				{
					vec2 uv = vUv;
					uv.x += shift;
					vec4 v = texture2D(visibility, uv);
					if (length(v.rgb) > 0.6) discard;

					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );

				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		//luminiMaterial.uniforms.visibility.value.generateMipalphaMaps = false;
		//luminiMaterial.uniforms.visibility.value.magFilter = THREE.LinearFilter;
		//luminiMaterial.uniforms.visibility.value.minFilter = THREE.LinearFilter;
		//luminiMaterial.needsUpdate = true;
		luminiMaterial_4.depthWrite = true;
		var lumini_4 = new THREE.Mesh(luminiGeometry_4, luminiMaterial_4);
		//let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		//var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
		group.add( lumini_4 );
		//EARTH_AUREOLE_END

	};

	function addAureole_6(){
		//EARTH_AUREOLE
		var luminiGeometry_5 = new THREE.SphereBufferGeometry(610, 300, 150);
		var lumini_loader = new THREE.TextureLoader();
			lumini_loader.setCrossOrigin('');

		var lumini_texture = lumini_loader.load('contour2_15_1.png');
		lumini_texture.wrapS = THREE.RepeatWrapping;
		lumini_texture.wrapT = THREE.RepeatWrapping;
		lumini_texture.repeat.set(1, 1);


		var luminiMaterial_5 = new THREE.ShaderMaterial( 
		{
			vertexColors: THREE.VertexColors,
		    uniforms: 
			{ 
				visibility: {
					value: lumini_texture
				},
				shift: {
					value: 0
				},
				size: {
					value: 25
				},
				scale: {
					value: window.innerHeight / 8
				},
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 0.95 },
				glowColor: { type: "c", value: new THREE.Color(0xffffff) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform float scale;
				uniform float size;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vUv = uv;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_PointSize = size * ( scale / length( mvPosition.xyz ));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D visibility;
				uniform float shift;

				varying vec2 vUv;
				varying vec3 vColor;

				uniform vec3 glowColor;
				varying float intensity;

				void main() 
				{
					vec2 uv = vUv;
					uv.x += shift;
					vec4 v = texture2D(visibility, uv);
					if (length(v.rgb) > 0.6) discard;

					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );

				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		//luminiMaterial.uniforms.visibility.value.generateMipalphaMaps = false;
		//luminiMaterial.uniforms.visibility.value.magFilter = THREE.LinearFilter;
		//luminiMaterial.uniforms.visibility.value.minFilter = THREE.LinearFilter;
		//luminiMaterial.needsUpdate = true;
		luminiMaterial_5.depthWrite = true;
		var lumini_5 = new THREE.Mesh(luminiGeometry_5, luminiMaterial_5);
		//let moonGlow_geometry = new THREE.SphereGeometry(635, 300, 300, 0, Math.PI*2, 0, Math.PI);
		//var moonGlow = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
		group.add( lumini_5 );
				let conj = new THREE.Quaternion();
		conj.copy(group.quaternion);
		conj.conjugate();

		lumini_5.quaternion.multiplyQuaternions( conj, camera.quaternion);
		//EARTH_AUREOLE_END

	};
//AUREOLE end
//Wire animation----------------------------------------------------
	//Переменные для задания размеров проводов всех, кроме 4го. Он задан отдельно. _l - длинна, _d - диаметр.
let wire_l        = 700,	wire_d        = 16,
	Connector1_l  = 100,	Connector1_d  = 30,
	Connector2_l  = 25,		Connector2_d  = 45,
	Sticker_l     = 60,		Sticker_d     = 31,
	StickerGlow_l = 60,		StickerGlow_d = 32;
	Wire = function(){

		var g = new THREE.CylinderGeometry( wire_d,wire_d,wire_l, 110,55);//110 55

			g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI/2 ) );
			g.mergeVertices();

		var l = g.vertices.length;
		var r = 10;

		this.waves = [];

		for ( var i = 0 ; i < l ; i++ ){

			var v = g.vertices[i];

			this.waves.push({
				y:v.y,
				x:v.x,
				z:v.z,
				amp: -0.02,//статичная амплитуда каждой точки
				speed: 0.0001
			});

		};

		var m = new THREE.MeshPhongMaterial({
			color: 0x030303,
			transparent:true,
			opacity:1.0,
			shading:THREE.SmoothShading,
			shininess: 100
		});

		this.mesh = new THREE.Mesh( g , m );
		this.mesh.receiveShadow = true;

	};
	Wire4 = function(){

		var g = new THREE.CylinderGeometry( wire_d,wire_d,1700, 110,55);//110 55

			g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI/2 ) );
			g.mergeVertices();

		var l = g.vertices.length;
		var r = 10;

		this.waves = [];

		for ( var i = 0 ; i < l ; i++ ){

			var v = g.vertices[i];

			this.waves.push({
				y:v.y,
				x:v.x,
				z:v.z,
				amp: -0.02,//статичная амплитуда каждой точки
				speed: 0.0001
			});

		};

		var m = new THREE.MeshPhongMaterial({
			color: 0x030303,
			transparent:true,
			opacity:1.0,
			shading:THREE.SmoothShading,
			shininess: 100
		});

		this.mesh = new THREE.Mesh( g , m );
		this.mesh.receiveShadow = true;

	};
	Connector1 = function(){

		var geom = new THREE.CylinderGeometry(Connector1_d,Connector1_d,Connector1_l,80,80);
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		geom.mergeVertices();
		var l = geom.vertices.length;

		var mat = new THREE.MeshPhongMaterial({
			color: 0x030303,
			transparent:true,
			opacity:1.0,
			shading:THREE.FlatShading,
		});

		this.mesh = new THREE.Mesh(geom, mat);
		this.mesh.receiveShadow = true;

	};

	Connector2 = function(){

		var geom = new THREE.CylinderGeometry(Connector2_d,Connector2_d,Connector2_l,80,80);
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		geom.mergeVertices();
		var l = geom.vertices.length;

		var mat = new THREE.MeshPhongMaterial({
			color: 0x030303,
			transparent:true,
			opacity:1.0,
			shading:THREE.FlatShading,
		});
		//mat.depthWrite = false;
		this.mesh = new THREE.Mesh(geom, mat);
		this.mesh.receiveShadow = true;

	};
	Sticker = function(){

		var geom = new THREE.CylinderGeometry(Sticker_d,Sticker_d,Sticker_l,80,80);
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		geom.mergeVertices();
		var l = geom.vertices.length;

		var mat = new THREE.MeshPhongMaterial({
			color: 0x16202b,
			transparent:true,
			opacity:1.0,
			shading:THREE.FlatShading,
		});

		this.mesh = new THREE.Mesh(geom, mat);
		this.mesh.receiveShadow = true;

	};
	StickerGlow = function(){

		//EARTH_AUREOLE
		var customMaterial = new THREE.ShaderMaterial( 
		{
		    uniforms: 
			{ 
				"c":   { type: "f", value: 1.4 },
				"p":   { type: "f", value: 1.6 },
				glowColor: { type: "c", value: new THREE.Color(0x304a62) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader: `
				uniform vec3 viewVector;
				uniform float c;
				uniform float p;
				varying float intensity;
				void main() 
				{
					vec3 vNormal = normalize( normalMatrix * normal );
					vec3 vNormel = normalize( normalMatrix * viewVector );
					intensity = pow( c - dot(vNormal, vNormel), p );

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}
			`,
			fragmentShader: `
				uniform vec3 glowColor;
				varying float intensity;
				void main() 
				{
					vec3 glow = glowColor * intensity;
					gl_FragColor = vec4( glow, 1.0 );
				}
			`,
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}   );
		let moonGlow_geometry = new THREE.CylinderGeometry(StickerGlow_d,StickerGlow_d,StickerGlow_l,80,80);

		moonGlow_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		this.mesh = new THREE.Mesh( moonGlow_geometry, customMaterial );
		//moonGlow.scale.multiplyScalar(1.2);
				customMaterial.fog = false;
		customMaterial.depthWrite = false;
		//EARTH_AUREOLE_END

	};

	let v,l;
//функции имитации движения в вакууме проводов, а также их искажение в зав-ти от поворота планеты. n отвечает для анимацию просто движения в вакууме, tyy за смещение отн. поворота.
	Wire.prototype.moveWaves = function (n,tyy){
		
		this.mesh.rotation.z = -20*(Math.PI/180);
		v = this.mesh.geometry.vertices;
		l = v.length;
		var vzarr=[];
		for ( var i = 0; i < l; i++ ){
			vzarr.push(this.waves[i].z);
		};
		var min_v = Math.min.apply(null, vzarr);
		var max_v = Math.max.apply(null, vzarr);
		var z_length = Math.abs(min_v) + Math.abs(max_v);
		for (var i=0; i<l; i++){

			var a, b, c, offset, offset2, offsety, z_positive, z_normalized, offsety;
			//c - амплитуда, изм-я с помощью n из animate
			a = v[i];
			b = this.waves[i];
			//
			c = b.amp * n;
			z_positive = b.z + max_v;

			z_normalized = ((z_positive / z_length)) * c;
			//offset = 100*Math.sin(z_normalized) * ( Math.cos( b.z - c ) ); пиздатая рандомная функция

			//offset = Math.sin(2*Math.PI*z_normalized)*Math.exp(-z_normalized);
			offset = z_normalized * ( Math.cos( b.z - c ) );
			offset2 = z_normalized * ( Math.sin( b.z - c ) );
			offsety = z_normalized*tyy;
  			a.x = b.x + (offset)- 2.5*Math.pow(offsety, 2);
			a.y = b.y + (offset2)- 2.5*Math.pow(offsety, 2);

		};


		this.mesh.geometry.verticesNeedUpdate=true;
		
	};
	Wire.prototype.moveWaves_2 = function (n,tyy){
		this.mesh.rotation.z = -50*(Math.PI/180);
		v = this.mesh.geometry.vertices;
		l = v.length;
		var vzarr=[];
		for ( var i = 0; i < l; i++ ){
			vzarr.push(this.waves[i].z);
		};
		var min_v = Math.min.apply(null, vzarr);
		var max_v = Math.max.apply(null, vzarr);
		var z_length = Math.abs(min_v) + Math.abs(max_v);
		for (var i=0; i<l; i++){

			var a, b, c, offset, offset2, offsety, z_positive, z_normalized, offsety;
			//c - амплитуда, изм-я с помощью n из animate
			a = v[i];
			b = this.waves[i];
			//
			c = b.amp * n;
			z_positive = b.z + max_v;

			z_normalized = ((z_positive / z_length)) * c;
			//offset = 100*Math.sin(z_normalized) * ( Math.cos( b.z - c ) ); пиздатая рандомная функция

			//offset = Math.sin(2*Math.PI*z_normalized)*Math.exp(-z_normalized);
			offset = z_normalized * ( Math.cos( b.z - c ) );
			offset2 = z_normalized * ( Math.sin( b.z - c ) );
			offsety = z_normalized*tyy;
  			a.x = b.x + (offset)- 2.5*Math.pow(offsety, 2);
			a.y = b.y + (offset2)- 2.5*Math.pow(offsety, 2);

		};


		this.mesh.geometry.verticesNeedUpdate=true;
		
	};
	Wire.prototype.moveWaves_3 = function (n,tyy){
		this.mesh.rotation.z = -10*(Math.PI/180);
		v = this.mesh.geometry.vertices;
		l = v.length;
		var vzarr=[];
		for ( var i = 0; i < l; i++ ){
			vzarr.push(this.waves[i].z);
		};
		var min_v = Math.min.apply(null, vzarr);
		var max_v = Math.max.apply(null, vzarr);
		var z_length = Math.abs(min_v) + Math.abs(max_v);
		for (var i=0; i<l; i++){

			var a, b, c, offset, offset2, offsety, z_positive, z_normalized, offsety;
			//c - амплитуда, изм-я с помощью n из animate
			a = v[i];
			b = this.waves[i];
			//
			c = b.amp * n;
			z_positive = b.z + max_v;

			z_normalized = ((z_positive / z_length)) * c;
			//offset = 100*Math.sin(z_normalized) * ( Math.cos( b.z - c ) ); пиздатая рандомная функция

			//offset = Math.sin(2*Math.PI*z_normalized)*Math.exp(-z_normalized);
			offset = z_normalized * ( Math.cos( b.z - c ) );
			offset2 = z_normalized * ( Math.sin( b.z - c ) );
			offsety = z_normalized*tyy;
  			a.x = b.x + (offset)- 2.5*Math.pow(offsety, 2);
			a.y = b.y + (offset2)- 2.5*Math.pow(offsety, 2);

		};


		this.mesh.geometry.verticesNeedUpdate=true;
		
	};
	Wire4.prototype.moveWaves_4 = function (n,tyy){
		this.mesh.rotation.z = 0*(Math.PI/180);
		v = this.mesh.geometry.vertices;
		l = v.length;
		var vzarr=[];
		for ( var i = 0; i < l; i++ ){
			vzarr.push(this.waves[i].z);
		};
		var min_v = Math.min.apply(null, vzarr);
		var max_v = Math.max.apply(null, vzarr);
		var z_length = Math.abs(min_v) + Math.abs(max_v);
		for (var i=0; i<l; i++){

			var a, b, c, offset, offset2, offsety, z_positive, z_normalized, offsety;
			//c - амплитуда, изм-я с помощью n из animate
			a = v[i];
			b = this.waves[i];
			//
			c = b.amp * n;
			z_positive = b.z + max_v;

			z_normalized = ((z_positive / z_length)) * c;
			//offset = 100*Math.sin(z_normalized) * ( Math.cos( b.z - c ) ); пиздатая рандомная функция

			//offset = Math.sin(2*Math.PI*z_normalized)*Math.exp(-z_normalized);
			offset = z_normalized * ( Math.cos( b.z - c ) );
			offset2 = z_normalized * ( Math.sin( b.z - c ) );
			offsety = z_normalized*tyy;
  			a.x = b.x + (offset)- 2.5*Math.pow(offsety, 2);
			a.y = b.y + (offset2)- 2.5*Math.pow(offsety, 2);

		};


		this.mesh.geometry.verticesNeedUpdate=true;
		
	};
	Wire.prototype.moveWaves_5 = function (n,tyy){
		this.mesh.rotation.z = -115*(Math.PI/180);
		v = this.mesh.geometry.vertices;
		l = v.length;
		var vzarr=[];
		for ( var i = 0; i < l; i++ ){
			vzarr.push(this.waves[i].z);
		};
		var min_v = Math.min.apply(null, vzarr);
		var max_v = Math.max.apply(null, vzarr);
		var z_length = Math.abs(min_v) + Math.abs(max_v);
		for (var i=0; i<l; i++){

			var a, b, c, offset, offset2, offsety, z_positive, z_normalized, offsety;
			//c - амплитуда, изм-я с помощью n из animate
			a = v[i];
			b = this.waves[i];
			//
			c = b.amp * n;
			z_positive = b.z + max_v;

			z_normalized = ((z_positive / z_length)) * c;
			//offset = 100*Math.sin(z_normalized) * ( Math.cos( b.z - c ) ); пиздатая рандомная функция

			//offset = Math.sin(2*Math.PI*z_normalized)*Math.exp(-z_normalized);
			offset = z_normalized * ( Math.cos( b.z - c ) );
			offset2 = z_normalized * ( Math.sin( b.z - c ) );
			offsety = z_normalized*tyy;
  			//a.x = b.x + (offset)- 2.5*Math.pow(offsety, 2);
			//a.y = b.y + (offset2)- 2.5*Math.pow(offsety, 2);
  			a.x = b.x + (offset);
			a.y = b.y + (offset2);

		};


		this.mesh.geometry.verticesNeedUpdate=true;
		
	};
	Wire.prototype.moveWaves_6 = function (n,tyy){
		this.mesh.rotation.z = -115*(Math.PI/180);
		v = this.mesh.geometry.vertices;
		l = v.length;
		var vzarr=[];
		for ( var i = 0; i < l; i++ ){
			vzarr.push(this.waves[i].z);
		};
		var min_v = Math.min.apply(null, vzarr);
		var max_v = Math.max.apply(null, vzarr);
		var z_length = Math.abs(min_v) + Math.abs(max_v);
		for (var i=0; i<l; i++){

			var a, b, c, offset, offset2, offsety, z_positive, z_normalized, offsety;
			//c - амплитуда, изм-я с помощью n из animate
			a = v[i];
			b = this.waves[i];
			//
			c = b.amp * n;
			z_positive = b.z + max_v;

			z_normalized = ((z_positive / z_length)) * c;
			//offset = 100*Math.sin(z_normalized) * ( Math.cos( b.z - c ) ); пиздатая рандомная функция

			//offset = Math.sin(2*Math.PI*z_normalized)*Math.exp(-z_normalized);
			offset = z_normalized * ( Math.cos( b.z - c ) );
			offset2 = z_normalized * ( Math.sin( b.z - c ) );
			offsety = z_normalized*tyy;
  			//a.x = b.x + (offset)- 2.5*Math.pow(offsety, 2);
			//a.y = b.y + (offset2)- 2.5*Math.pow(offsety, 2);
  			a.x = b.x + (offset);
			a.y = b.y + (offset2);
		};


		this.mesh.geometry.verticesNeedUpdate=true;
		
	};

	var ui = 1;
	var yy;
//---------------------------------------------------------

//CREATION - функции создания 3д объектов
	function createEarthTexture(){

		earthTexture = new EarthTexture();
		earthTexture.mesh.position.x = 0;
		earthTexture.mesh.position.y = 0;
		earthTexture.mesh.position.z = 0;
		groupPlanet.add( earthTexture.mesh );

	};

	function createEarthContour(){

		earthContour = new EarthContour();
		earthContour.mesh.position.x = 0;
		earthContour.mesh.position.y = 0;
		earthContour.mesh.position.z = 0;
		groupPlanet.add( earthContour.mesh );

	};	

	function createEarthContourShadow(){

		earthContourShadow = new EarthContourShadow();
		earthContourShadow.mesh.position.x = 0;
		earthContourShadow.mesh.position.y = 0;
		earthContourShadow.mesh.position.z = 0;
		groupPlanet.add( earthContourShadow.mesh );

	};	
	function createEarthPoints(){

		earthPoints = new EarthPoints();
		earthPoints.points.position.x = 0;
		earthPoints.points.position.y = 0;
		earthPoints.points.position.z = 0;
		groupPlanet.add( earthPoints.points );

	};	

	function createEarthPointsShadow(){

		earthPointsShadow = new EarthPointsShadow();
		earthPointsShadow.points.position.x = 0;
		earthPointsShadow.points.position.y = 0;
		earthPointsShadow.points.position.z = 0;
		groupPlanet.add( earthPointsShadow.points );

	};

	function createClouds(){

		clouds = new Clouds();
		clouds.mesh.position.x = 0;
		clouds.mesh.position.y = 0;
		clouds.mesh.position.z = 0;
		groupPlanet.add( clouds.mesh );

	};	

	function createCloudsShadow(){

		cloudsShadow = new CloudsShadow();
		cloudsShadow.mesh.position.x = 0;
		cloudsShadow.mesh.position.y = 0;
		cloudsShadow.mesh.position.z = 0;
		groupPlanet.add( cloudsShadow.mesh );

	};	

	function createWire_1(){

		connector2 = new Connector2();
		connector2.mesh.position.z = Connector2_l / 2;

		connector1 = new Connector1();
		connector1.mesh.position.z = Connector2_l + (Connector1_l / 2);

		sticker = new Sticker();
		sticker.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		stickerGlow = new StickerGlow();
		stickerGlow.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		wire = new Wire();
		wire.mesh.position.z = Connector1_l + Connector2_l + (wire_l / 2);


		group_wire_1.add(connector2.mesh);
		group_wire_1.add(connector1.mesh);
		group_wire_1.add(sticker.mesh);
		group_wire_1.add(stickerGlow.mesh);
		group_wire_1.add(wire.mesh);
		//wire.mesh.material.color.setHex( 0xFF00CC );

	};

	function createWire_2(){

		connector2_2 = new Connector2();
		connector2_2.mesh.position.z = Connector2_l / 2;

		connector1_2 = new Connector1();
		connector1_2.mesh.position.z = Connector2_l + (Connector1_l / 2);

		sticker_2 = new Sticker();
		sticker_2.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		stickerGlow_2 = new StickerGlow();
		stickerGlow_2.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		wire_2 = new Wire();
		wire_2.mesh.position.z = Connector1_l + Connector2_l + (wire_l / 2);

		group_wire_2.add(connector2_2.mesh);
		group_wire_2.add(connector1_2.mesh);
		group_wire_2.add(sticker_2.mesh);
		group_wire_2.add(stickerGlow_2.mesh);
		group_wire_2.add(wire_2.mesh);
		//wire_2.mesh.material.color.setHex( 0x0011FF );

	};

	function createWire_3(){

		connector2_3 = new Connector2();
		connector2_3.mesh.position.z = Connector2_l / 2;

		connector1_3 = new Connector1();
		connector1_3.mesh.position.z = Connector2_l + (Connector1_l / 2);

		sticker_3 = new Sticker();
		sticker_3.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		stickerGlow_3 = new StickerGlow();
		stickerGlow_3.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		wire_3 = new Wire();
		wire_3.mesh.position.z = Connector1_l + Connector2_l + (wire_l / 2);

		group_wire_3.add(connector2_3.mesh);
		group_wire_3.add(connector1_3.mesh);
		group_wire_3.add(sticker_3.mesh);
		group_wire_3.add(stickerGlow_3.mesh);
		group_wire_3.add(wire_3.mesh);
		//wire_3.mesh.material.color.setHex( 0x00FFE5 );
		
	};

	function createWire_4(){

		connector2_4 = new Connector2();
		connector2_4.mesh.position.z = Connector2_l / 2;

		connector1_4 = new Connector1();
		connector1_4.mesh.position.z = Connector2_l + (Connector1_l / 2);

		sticker_4 = new Sticker();
		sticker_4.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		stickerGlow_4 = new StickerGlow();
		stickerGlow_4.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		wire_4 = new Wire4();
		wire_4.mesh.position.z = Connector1_l + Connector2_l + (1700 / 2);

		group_wire_4.add(connector2_4.mesh);
		group_wire_4.add(connector1_4.mesh);
		group_wire_4.add(sticker_4.mesh);
		group_wire_4.add(stickerGlow_4.mesh);
		group_wire_4.add(wire_4.mesh);
		//wire_4.mesh.material.color.setHex( 0x22FF00 );

	};

	function createWire_5(){

		connector2_5 = new Connector2();
		connector2_5.mesh.position.z = Connector2_l / 2;

		connector1_5 = new Connector1();
		connector1_5.mesh.position.z = Connector2_l + (Connector1_l / 2);

		sticker_5 = new Sticker();
		sticker_5.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		stickerGlow_5 = new StickerGlow();
		stickerGlow_5.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		wire_5 = new Wire();
		wire_5.mesh.position.z = Connector1_l + Connector2_l + (wire_l / 2);

		group_wire_5.add(connector2_5.mesh);
		group_wire_5.add(connector1_5.mesh);
		group_wire_5.add(sticker_5.mesh);
		group_wire_5.add(stickerGlow_5.mesh);
		group_wire_5.add(wire_5.mesh);
		//wire_5.mesh.material.color.setHex( 0xFFE600 );

	};

	function createWire_6(){

		connector2_6 = new Connector2();
		connector2_6.mesh.position.z = Connector2_l / 2;

		connector1_6 = new Connector1();
		connector1_6.mesh.position.z = Connector2_l + (Connector1_l / 2);

		sticker_6 = new Sticker();
		sticker_6.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		stickerGlow_6 = new StickerGlow();
		stickerGlow_6.mesh.position.z = Connector2_l + (Connector1_l  / 2);

		wire_6 = new Wire();
		wire_6.mesh.position.z = Connector1_l + Connector2_l + (wire_l / 2);

		group_wire_6.add(connector2_6.mesh);
		group_wire_6.add(connector1_6.mesh);
		group_wire_6.add(sticker_6.mesh);
		group_wire_6.add(stickerGlow_6.mesh);
		group_wire_6.add(wire_6.mesh);
		//wire_6.mesh.material.color.setHex( 0xFF0000 );

	};
//CREATION end
//Размещение каждого провода как группы из нескольких элементов на поверхности планеты
	function moveGroup_models_1(zoompos) {

		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 18,	long = -40;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));
		var xrot = new THREE.Matrix4().makeRotationX( (-30)*(Math.PI/180) );
		var yrot = new THREE.Matrix4().makeRotationY( (50)*(Math.PI/180) );
		var xyrot = xrot.multiply(yrot);
		var zrot = new THREE.Matrix4().makeRotationZ( 0);
		var xyzrot = xyrot.multiply(zrot);
		group_wire_1.translateX(600);
		group_wire_1.applyMatrix(xyzrot);
		group_wire_1.position.set(xrad,yrad,zrad);//0xFF00CC

	};

	function moveGroup_models_2(zoompos) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = -8,	long = -65;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));

		var xrot = new THREE.Matrix4().makeRotationX( (7)*(Math.PI/180) );
		var yrot = new THREE.Matrix4().makeRotationY( (25)*(Math.PI/180) );
		var xyrot = xrot.multiply(yrot);
		var zrot = new THREE.Matrix4().makeRotationZ( 0 );
		var xyzrot = xyrot.multiply(zrot);


		group_wire_2.applyMatrix(	xyzrot );
		group_wire_2.position.set(xrad,yrad,zrad);//0x0011FF

	};

	function moveGroup_models_3(zoompos) {
		group_wire_3.translate(0, 0, 0.25 + 600);
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 39,	long = -67;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));

		var xrot = new THREE.Matrix4().makeRotationX( (-42)*(Math.PI/180) );
		var yrot = new THREE.Matrix4().makeRotationY( (20)*(Math.PI/180) );
		var xyrot = xrot.multiply(yrot);
		var zrot = new THREE.Matrix4().makeRotationZ( 0 );
		var xyzrot = xyrot.multiply(zrot);


		group_wire_3.applyMatrix(	xyzrot );
		group_wire_3.position.set(xrad,yrad,zrad);//0x00FFE5

	};

	function moveGroup_models_4(zoompos4) {
		group_wire_4.translate(0, 0, 0.25 + 600);
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = -30,	long = -152;//var lat = -40,	long = -152;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos4) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos4) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos4) * Math.cos(phi));

		var xrot = new THREE.Matrix4().makeRotationX( (46)*(Math.PI/180) );//54
		var yrot = new THREE.Matrix4().makeRotationY( (-48)*(Math.PI/180) );//-42
		var xyrot = xrot.multiply(yrot);
		var zrot = new THREE.Matrix4().makeRotationZ( 0 );
		var xyzrot = xyrot.multiply(zrot);


		group_wire_4.applyMatrix(	xyzrot );
		group_wire_4.position.set(xrad,yrad,zrad);//0x22FF00

	};

	function moveGroup_models_5(zoompos) {
		group_wire_5.translate(0, 0, 0.25 + 600);
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 35,	long = -165;//-105
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));

		var xrot = new THREE.Matrix4().makeRotationX( (-75)*(Math.PI/180) );
		var yrot = new THREE.Matrix4().makeRotationY( (-52)*(Math.PI/180) );//тутт
		var xyrot = xrot.multiply(yrot);
		var zrot = new THREE.Matrix4().makeRotationZ( 0 );
		var xyzrot = xyrot.multiply(zrot);


		group_wire_5.applyMatrix(	xyzrot );
		group_wire_5.position.set(xrad,yrad,zrad);//0xFFE600

	};

	function moveGroup_models_6(zoompos) {
		group_wire_6.translate(0, 0, 0.25 + 600);
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 73,	long = -102;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));

		var xrot = new THREE.Matrix4().makeRotationX( (180 - 253.9)*(Math.PI/180) );
		var yrot = new THREE.Matrix4().makeRotationY( (270 + 87.2)*(Math.PI/180) );
		var xyrot = xrot.multiply(yrot);
		var zrot = new THREE.Matrix4().makeRotationZ( 0 );
		var xyzrot = xyrot.multiply(zrot);


		group_wire_6.applyMatrix(	xyzrot );
		group_wire_6.position.set(xrad,yrad,zrad);//0xFF0000

	};




//Добавляем в группу объекты. group - все вместе, groupPlanet - планета, кроме проводов
	function wiresingroup () {
		groupPlanet.rotation.y = -50*(Math.PI/180);
		group.add(groupPlanet);
		group.add(group_wire_1);
		group.add(group_wire_2);
		group.add(group_wire_3);
		group.add(group_wire_4);
		group.add(group_wire_5);
		group.add(group_wire_6);
		group.rotation.x = 15*(Math.PI/180);
		group.rotation.z = -20*(Math.PI/180);
		group.position.x = 600;
	};
//Функция поворота группы group планеты и проводов, и группы groupPlanet только планеты
	var ooarr=[];
	let ty = 0;
	var oo
	function gh(){
			var r = group;
			oo = group.rotation.y;
			var r1 = groupPlanet;

			
			if(oo >= 0.4){ui = -1; yy = 0.0015};
			if(oo <= 0){ui = 1; yy = 0.0015};
			if(anim.status=="beforeStart"){
				if(oo >= 0.4){ui = -1;};

				
				
				if(oo <= 0){ui = 1;};
				
				r.rotation.y = r.rotation.y + ui*yy;
				ty = oo;
			}else if((anim.status=="stage1")||(anim.status=="stage2")){
				ui = 1;
				r.rotation.y = ty;
				r1.rotation.y = r1.rotation.y + ui*yy;
			};
			console.log(yy);
			

	};

//Функции анимации отвода проводов с планеты. Переменная zoompos отвечает за расстояние от центра сферы до начала провода
	function moveWireOut_1(zoompos) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 18,	long = -40;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));
		group_wire_1.position.set(xrad,yrad,zrad);//0xFF00CC
	};
	function moveWireOut_2(zoompos) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = -8,	long = -65;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));
		group_wire_2.position.set(xrad,yrad,zrad);//0xFF00CC
	};
	function moveWireOut_3(zoompos) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 39,	long = -67;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));
		group_wire_3.position.set(xrad,yrad,zrad);//0xFF00CC
	};
	function moveWireOut_4(zoompos4) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = -30,	long = -152;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos4) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos4) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos4) * Math.cos(phi));
		group_wire_4.position.set(xrad,yrad,zrad);//0xFF00CC
	};
	function moveWireOut_5(zoompos) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 35,	long = -165;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));
		group_wire_5.position.set(xrad,yrad,zrad);//0xFF00CC
	};
	function moveWireOut_6(zoompos) {
		var startVector = new THREE.Vector3(0, 0, 0);
		var endVector = new THREE.Vector3(xrad,  yrad,  zrad);
		var lat = 73,	long = -102;
		var phi   = (90-lat)*(Math.PI/180);
		var theta = (long-180)*(Math.PI/180);
		let xrad = -((zoompos) * Math.sin(phi)*Math.cos(theta));
		let zrad = ((zoompos) * Math.sin(phi)*Math.sin(theta));
		let yrad = ((zoompos) * Math.cos(phi));
		group_wire_6.position.set(xrad,yrad,zrad);//0xFF00CC
	};
	let zoompos = 596;
	let zoompos4 = 596;
	let minzoomspeed=5;
	let zoomspeed = minzoomspeed;





//функция инициализации. Тут включаются сцена, камера, рендерер, запускаются функции создания 3д объектов.
	function init() {
		resetAnimation();
		createScene();
		createRenderer();
		addAureole();

		createWire_1();
		createWire_2();
		createWire_3();
		createWire_4();
		createWire_5();
		createWire_6();
		createEarthTexture();
		createEarthContourShadow();
		createEarthPointsShadow();	
		createEarthContour();

		
		
		createEarthPoints();

		moveGroup_models_1(zoompos);
		moveGroup_models_2(zoompos);
		moveGroup_models_3(zoompos);
		moveGroup_models_4(zoompos4);
		moveGroup_models_5(zoompos);
		moveGroup_models_6(zoompos);

		addLights();
		addDirLight();
		wiresingroup();



		loop();

	};

	let n_max=2250 + 600;
	let n_min=1000 + 600;
	let n = n_max / 2 ;
	let f = 1;
	let q = 0;
	for (var s = 0; s < 1; s=s+0.001) {
		if ( s < 0.5 ) { q = 2*s } else { q = -1+(4-2*s)*s };
	};


	let f_2 = 1;
	let q_2 = 1;
	

let tyy = 0;

let maxtime = 0;
	function nplus(){
		if(n >= n_max){f = -1};
		if(n <= n_min){f = 1};
		n = n + f*(q);
		tyy = ty;
	};
	function zposplus(){
		
		if(zoompos<2500){
			zoompos++;
			zoompos4 = zoompos4 +1.8;
			//console.log(zoompos);
		};
		if(zoompos>=2500){
			zoompos = 2500;
		};
		
	};
	//слушатель скролла. При 1 движении скролла статус анимации меняется на stage1 и этот слушатель удаляется.
	window.addEventListener( 'wheel', onMouseWheel, false );
		function onMouseWheel(event) {
		    anim.status="stage1";
		    window.removeEventListener('wheel', onMouseWheel, false);
		    
		};

		var incyy;
		yy = 0;
		incyy = .01;

//циклическая функция анимации, в которой при каждом изменении вызывается смена кадра
	function loop() {
		newTime = new Date().getTime();
		deltaTime = newTime-oldTime;
		oldTime = newTime;





		if (anim.status=="beforeStart"){

			  wire.moveWaves(n,tyy);
			wire_2.moveWaves_2(n,tyy);
			wire_3.moveWaves_3(n,tyy);
			wire_4.moveWaves_4(n,tyy);
			wire_5.moveWaves_5(n,tyy);
			wire_6.moveWaves_6(n,tyy);

		};

		maxtime += deltaTime;
		nplus();

		if       ( anim.status=="stage1" ) {
			//провода начинают улетать и при статусе 2 убираются
			zposplus();
			if(zoompos == 2500){anim.status="stage2"};

		}else if ( anim.status=="stage2" ) {

			group.remove(group_wire_1);
			group.remove(group_wire_2);
			group.remove(group_wire_3);
			group.remove(group_wire_4);
			group.remove(group_wire_5);
			group.remove(group_wire_6);

		};
		
		//if( (maxtime > 2400)&&(anim.status=="stage1") ){anim.status="stage3"};
			console.log(anim.status);
			moveWireOut_1(zoompos);
			moveWireOut_2(zoompos);
			moveWireOut_3(zoompos);
			moveWireOut_4(zoompos4);
			moveWireOut_5(zoompos);
			moveWireOut_6(zoompos);
		//Части функциий для easing поворота группы планеты.
//			var r = group;
//			oo = group.rotation.y;
//			var r1 = groupPlanet;
//
//			
//			if(oo >= 0.4){ui = -1; yy = 0.0015};
//			if(oo <= 0){ui = 1; yy = 0.0015};
//			if(anim.status=="beforeStart"){
//				incyy += 0.0001;
//				var rtyy = Math.pow(1.05, incyy)*0.0001;
//				yy += rtyy;	
//				if((oo >= 0.4)&&( Math.abs(incyy) >= 0.0015)){
//					ui = -1;
//					incyy += 0.0001;
//					
//				};
//				if((oo <= 0)&&( Math.abs(incyy) <= 0.0000)){
//					ui = 1;
//					incyy += 0.0001;
//				};
//				
//				r.rotation.y = r.rotation.y + ui*yy;
//				ty = oo;
//
//			}else if((anim.status=="stage1")||(anim.status=="stage2")){
//				ui = 1;
//				r.rotation.y = ty;
//				r1.rotation.y = r1.rotation.y + ui*yy;
//			};
			gh();



		renderer.autoClear = false;
		renderer.clear();
		renderer.render( scene, camera );
		window.requestAnimationFrame(loop);

	};




window.addEventListener('load', init, false);




//TweenLite.ticker.addEventListener("tick", Render);




//document.addEventListener('mousemove', onMouseMove, false);
//function onMouseMove(event) {
//    let mouseX = event.clientX - window.innerWidth / 2;
//    let mouseY = event.clientY - window.innerHeight / 2;
//    camera.position.x += (mouseX - camera.position.x) * 0.005;
//    camera.position.y += (mouseY - camera.position.y) * 0.005;
//    camera.lookAt(scene.position);
//};

//createCloudsShadow();
//createClouds();
		
//addEarthPoints();

//addAureole_1();
//addAureole_2();
//addAureole_3();
//addAureole_4();
//addAureole_5();
//addAureole_6();

//		window.addEventListener( 'wheel', onMouseWheel, false );
//		function onMouseWheel(event) {
//		    var amount = event.deltaY;
//		    if(amount === 0) return;
//		    var dir = amount / Math.abs(amount);
//		    zoomspeed = dir*10;
//		    minzoomspeed = 5;
//		    zoompos += zoomspeed;
//		};















}//mounted end
}
</script>

<style lang="sass">
	body
		margin: 0
		padding: 0
		height: 100vh
		width: 100vw
	.basicScene
		height: 100vh
		width: 100vw
</style>

