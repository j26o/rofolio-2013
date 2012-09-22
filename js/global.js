if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, windw;
var camera, scene, renderer, parameters, i, h, color, size, light1;
var twtsprt1;
var mouseX = 0, mouseY = 0;
var planeGeometry, planeMaterial, floor, light;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var tweets = tags = twpl = [], tagform, searchtag;

// particle vars
var sprite, particles, particlegeometry, particlematerials = [];

var alienscale = .8;

var hsv = [0,0,1.0];

var aliens = {
	alien1: [hsv, 105*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien1.png" )],
	alien2: [hsv, 83*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien2.png" )],
	alien3: [hsv, 88*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien3.png" )],
	alien4: [hsv, 81*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien4.png" )],
	alien5: [hsv, 87*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien5.png" )],
	alien6: [hsv, 120*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien6.png" )],
	alien7: [hsv, 62*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien7.png" )],
	alien8: [hsv, 94*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien8.png" )],
	alien9: [hsv, 149*alienscale, THREE.ImageUtils.loadTexture( "images/textures/creatures/alien9.png" )],
}