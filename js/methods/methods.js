function init() {

	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0x025873, 0.0005 );
	scene.fog = new THREE.Fog( 0x025873, 1700, 2000 );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 2000;
	scene.add( camera );

	// add logo
	/*
	var logogeom = new THREE.PlaneGeometry(370, 80);
	var mat = new THREE.MeshLambertMaterial( {
		alphaTest: 0.5,
		color: 0xffffff, 
		ambient: 0x025873,
		shininess	: 1,
		specular	: 0x025873,
	});

	mat.map = THREE.ImageUtils.loadTexture( "images/logo.png" );
	
	mat.perPixel = true;
	mat.transparent = true;
	mat.shading = THREE.FlatShading;

	logo = new THREE.Mesh(logogeom, mat);

	logo.rotation.x = 89.5;
	logo.rotation.y = 0;
	logo.rotation.z = 0;

	logo.position.z = 900;
	logo.position.y = window.innerHeight/2 - 80;

	logo.castShadow = true;
	logo.receiveShadow = true;

	scene.add(logo);

	*/

	// create alien particles
	addAliens();

	// add the floor
	addFloor();

	// add lights
	addLights();

	// add terrain elements
	addTerrain();

	renderer = new THREE.WebGLRenderer( { antialias: false, maxLights: 10, clearAlpha:1 } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color, 1 );

	//container.appendChild( renderer.domElement );
	container.append(renderer.domElement);

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.physicallyBasedShading = true;
	renderer.shadowMapCullFrontFaces = false;

	// soften shadows
	renderer.shadowMapCascade = true;

	stats = new Stats();
	//container.appendChild( stats.domElement );
	container.append(stats.domElement);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function onDocumentMouseMove( event ) {
	mouseX = (event.clientX - windowHalfX) * .5;
	mouseY = (event.clientY - windowHalfY) * .2;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}

}

//
function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	var time = Date.now() * 0.00005;

	var winw = window.innerWidth;
	var winh = window.innerHeight;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	for ( i = 0; i < scene.children.length; i ++ ) {

		var object = scene.children[ i ];

		if ( object instanceof THREE.ParticleSystem ) {
			//object.rotation.x = time * ( i < 8 ? i + 1 : - ( i + 1 ) );
			object.rotation.y = time * ( i < 8 ? i + 1 : - ( i + 1 ) );
			//object.rotation.z = time * ( i < 8 ? i + 1 : - ( i + 1 ) );
		}

	}

	var t = Date.now() * 0.0005;
	var z = 20, d = 400;

	litCube.position.y = floor.position.y + 300;
	litCube.position.x = Math.cos(t)*(winw/2);
	//litCube.position.y = 60-Math.sin(t)*25;
	
	litCube.position.z = Math.sin(t)*(winw/2) + 500;
	litCube.rotation.x = t;
	litCube.rotation.y = t;

	spot1.position.x = litCube.position.x;
	spot1.position.z = litCube.position.z + Math.sin(t)*20;
	spot1.position.y = litCube.position.y+200;

	renderer.render( scene, camera );
}

function addLights(){
	scene.add( new THREE.AmbientLight( 0xffffff ) );
	
	dlight	= new THREE.DirectionalLight(0xffffff, .5);
	dlight.position.set( 1, -1, 1 ).normalize();
	
	scene.add( dlight );
	
	spot1 = new THREE.SpotLight( 0xffffff, 3 );
	spot1.position.set( 0, 100, 1000 );
	spot1.castShadow = true;
	//spot1.shadowDarkness = .6;

	scene.add(spot1);

    litCube = new THREE.Mesh(
		new THREE.SphereGeometry(10, 10, 10),
		new THREE.MeshPhongMaterial({
			color: 0x025873, 
			map: THREE.ImageUtils.loadTexture( "images/textures/ufo/ufo1.png" )
		})
	);
	litCube.position.z = 1300;

	litCube.castShadow = true;
    litCube.receiveShadow = true;

    //dlight.target = litCube;
    spot1.target = litCube;

	scene.add(litCube);

}

function addFloor(){
	// create the floor
	var texture = THREE.ImageUtils.loadTexture("images/textures/floor.jpg");
	//texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	//texture.format = THREE.RGBFormat;

	planeGeometry = new THREE.PlaneGeometry( window.innerWidth*2, window.innerHeight*2);
	
	texture.repeat.set( 0.7, 1 );

	var groundMaterial = new THREE.MeshPhongMaterial( { 
		color: 0xffffff, 
		ambient: 0xffffff,
		shininess	: 200,
		specular	: 0xffffff,
		map: texture 
	} );

	groundMaterial.perPixel = true;
	groundMaterial.transparent = false;
	groundMaterial.receiveShadow = true;
	groundMaterial.shading = THREE.FlatShading;
	
	floor = new THREE.Mesh(planeGeometry, groundMaterial);

	floor.position.y = -(window.innerHeight*.4);
	floor.position.z = 700;
	floor.receiveShadow = true;

	scene.add( floor );
}

// tweets
function gettweets(tag, func){
	console.log(tag);
	tweets = [];
	$.getJSON("http://search.twitter.com/search.json?rpp=100&callback=?&q=%23"
        + /*$('#search').val()*/ tag, function(data){
        var l = data.results.length;
		while(l--) {
			tweets.push(data.results[l]);
		}
		func();
 	});
}

function addAliens(){
	// start particles
	particlematerials = [];
	particlegeometry = new THREE.Geometry();

	for ( i = 0; i < 15; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 1800 - 500;
		vertex.y = Math.random() * 1800 - 500;
		vertex.z = Math.random() * 1800 - 500;

		particlegeometry.vertices.push( vertex );
	}

	for ( alien in aliens ) {
		color  = aliens[alien][0];
		sprite = aliens[alien][2];
		size   = aliens[alien][1];

		particlematerials[i] = new THREE.ParticleBasicMaterial( { size: size, map: sprite, depthTest: true, transparent : true, perPixel: true, alphaTest: 0.5 } );

		particles = new THREE.ParticleSystem( particlegeometry, particlematerials[i] );

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		scene.add( particles );
	}
}

function addTerrain(){
	// create the floor
	groundobjects = [];

	var sgrass1 = terrain.grass1[2];
	var sgrass2 = terrain.grass2[2];
	var size1 = terrain.grass1[1];
	var size2 = terrain.grass2[1];
	var geometry1 = new THREE.PlaneGeometry(size1[0], size1[1]);
	var geometry2 = new THREE.PlaneGeometry(size2[0], size2[1]);

	var count = 4;

	while (count--){
		var mat = new THREE.MeshPhongMaterial( {
			color: 0xffffff,
			shininess: 2,
			ambient: 0x71bbd3,
			specular: 0x71bbd3,
			alphaTest: 0.5
		});

		if(count > 1) mat.map = sgrass2;
		else mat.map = sgrass1;
		
		mat.perPixel = true;
		mat.transparent = true;
		mat.shading = THREE.FlatShading;

		if(count > 1) var gobj = new THREE.Mesh(geometry2, mat);
		else var gobj = new THREE.Mesh(geometry1, mat);

		gobj.rotation.x = 90;
		gobj.rotation.y = 0;

		if(count > 1)gobj.position.y = floor.position.y+size2[1]/2;
		else gobj.position.y = floor.position.y+size1[1]/2;

		gobj.castShadow = true;
		gobj.receiveShadow = true;

		groundobjects.push(gobj);

		scene.add(gobj);
	}

	// add bldg 1
	var bldg1 = terrain.bldg1[2];
	var bldgs1 = terrain.bldg1[1];
	var bldgg1 = new THREE.PlaneGeometry(bldgs1[0], bldgs1[1]);

	var mat = new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		shininess: 200,
		ambient: 0x71bbd3,
		specular: 0x71bbd3,
		alphaTest: 0.5
	});

	mat.map = bldg1;
	
	mat.perPixel = true;
	mat.transparent = true;
	mat.shading = THREE.FlatShading;

	gobj = new THREE.Mesh(bldgg1, mat);

	gobj.rotation.x = 90;
	gobj.rotation.y = 0;
	gobj.rotation.z = 0;

	gobj.position.y = floor.position.y+bldgs1[1]/3;

	gobj.castShadow = true;
	gobj.receiveShadow = true;

	groundobjects.push(gobj);

	scene.add(gobj);

	groundobjects[0].position.z = 1100;
	groundobjects[1].position.z = 100;
	groundobjects[2].position.z = 400;
	groundobjects[3].position.z = 800;
	groundobjects[4].position.z = 600;

	groundobjects[0].position.x = 0;
	groundobjects[1].position.x = 500;
	groundobjects[2].position.x = 700;
	groundobjects[3].position.x = -500;
	groundobjects[4].position.x = 100;

	/*
	for ( terran in terrain ) {
		var sprite = terrain[terran][2];
		//sprite.wrapS = sprite.wrapT = THREE.RepeatWrapping;
		
		var size   = terrain[terran][1];
		var geometry = new THREE.PlaneGeometry( size[0]*terrscale, size[1]*terrscale);
		
		var mat = new THREE.MeshPhongMaterial( {
			color: 0xffffff, 
			shininess	: 1,
			ambient: 0x888888,
			specular	: 0x888888,
			map: sprite 
		});

		mat.perPixel = true;
		mat.transparent = true;
		mat.receiveShadow = true;
		mat.shading = THREE.SmoothShading;

		var count = freq;
		while (count--){
			var gobj = new THREE.Mesh(geometry, mat);
			//gobj.position.set(vertex);
			gobj.position.z = Math.random() * 2000;
			gobj.position.y = floor.position.y + (size[1]*.25);
			gobj.position.x = Math.random() * 2000 - 1000;

			gobj.rotation.x = 90;
			gobj.rotation.y = 0;

			gobj.castShadow = true;
			gobj.receiveShadow = true;
			//gobj.rotation.z = 20;
			groundobjects.push(gobj);

			scene.add( gobj );
		}
	}
	*/

	console.log(groundobjects[0]);
}

function resizeObjects(){
	scene.remove(floor);
	addFloor();

	var famt = groundobjects.length;
	while (famt--){
		scene.remove(groundobjects[famt]);
	}
	addTerrain();
}