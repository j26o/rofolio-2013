var container, stats, windw, footnav;
var about, works, actwork, worksarr, prevwork, nextwork;
var camera, scene, renderer, parameters, i, h, color, size;
var light1, dlight, terrscale;
var groundobjects = [],
    ufos = [],
    sr;
var logo;
var mouseX = 0,
    mouseY = 0;
var planeGeometry, planeMaterial, floor, light;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var tweets = tags = twpl = [],
    tagform, searchtag;
var sprite, particles, particlegeometry, particlematerials = [];
var alienscale = 1;
terrscale = .5;
var hsv = [0, 0, .8];
$(document).ready(function () {
    windw = $(window);
    container = $('#container');
        
    windw.bind({
        'resize': function (e) {
            if (Detector.webgl) {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
                var w, h;
                w = window.innerWidth;
                h = window.innerHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
                resizeObjects()
            }
        }
    });
    if (Detector.webgl) {
        init();
        animate();
        container.children('div').css({
            position: 'absolute',
            top: 10
        })
    }
});

if (!Detector.webgl) Detector.addGetWebGLMessage();

var aliens = {
    alien1: [hsv, 105 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien1.png")],
    alien2: [hsv, 83 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien2.png")],
    alien3: [hsv, 88 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien3.png")],
    alien4: [hsv, 81 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien4.png")],
    alien5: [hsv, 87 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien5.png")],
    alien6: [hsv, 120 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien6.png")],
    alien7: [hsv, 62 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien7.png")],
    alien8: [hsv, 94 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien8.png")],
    alien9: [hsv, 149 * alienscale, THREE.ImageUtils.loadTexture("images/textures/creatures/alien9.png")],
};
var ufoskins = {
    ufo1: [hsv, [300, 485], THREE.ImageUtils.loadTexture("images/textures/ufo/ufo1.png")],
    ufo2: [hsv, [454, 501], THREE.ImageUtils.loadTexture("images/textures/ufo/ufo2.png")],
};
var terrain = {
    billboard: [hsv, [105, 105], THREE.ImageUtils.loadTexture("images/textures/grounded/billboard.png")],
    bldg1: [hsv, [658, 150], THREE.ImageUtils.loadTexture("images/textures/grounded/bldg1.png")],
    bldg2: [hsv, [170, 170], THREE.ImageUtils.loadTexture("images/textures/grounded/bldg2.png")],
    bldg3: [hsv, [160, 160], THREE.ImageUtils.loadTexture("images/textures/grounded/bldg3.png")],
    car1: [hsv, [107, 107], THREE.ImageUtils.loadTexture("images/textures/grounded/car1.png")],
    grass1: [hsv, [849, 110], THREE.ImageUtils.loadTexture("images/textures/grounded/grass1.png")],
    grass2: [hsv, [1675, 110], THREE.ImageUtils.loadTexture("images/textures/grounded/grass2.png")],
    hill: [hsv, [1072, 110], THREE.ImageUtils.loadTexture("images/textures/grounded/hills.png")],
};

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x025873, 1700, 2000);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 2000;
    scene.add(camera);
    addElements();
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        maxLights: 10,
        clearAlpha: 1
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 1);
    container.append(renderer.domElement);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.physicallyBasedShading = true;
    renderer.shadowMapCullFrontFaces = false;
    renderer.shadowMapCascade = true;
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false)
}
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * .5;
    mouseY = (event.clientY - windowHalfY) * .2
}
function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY
    }
}
function animate() {
    requestAnimationFrame(animate);
    render()
}
function render() {
    var time = Date.now() * 0.00005;
    var winw = window.innerWidth;
    var winh = window.innerHeight;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    for (i = 0; i < scene.children.length; i++) {
        var object = scene.children[i];
        if (object instanceof THREE.ParticleSystem) {
            object.rotation.y = time * (i < 8 ? i + 1 : -(i + 1))
        }
    }
    var t = Date.now() * 0.0005;
    var z = 20,
        d = 400;
    var n = ufos.length;
    while (n--) {
        var m = (n % 2) == 0 ? -1 : 1;
        var d = (n % 2) == 0 ? 300 : 0;
        ufos[n][0].position.x = (Math.cos(t) * (winw / 2)) + d;
        ufos[n][0].position.z = m * (Math.sin(t) * (winw / 2)) + 500;
        ufos[n][1].position.x = ufos[n][0].position.x;
        ufos[n][1].position.z = ufos[n][0].position.z + Math.sin(t) * 30;
        ufos[n][2].position.x = ufos[n][0].position.x + 10;
        ufos[n][2].position.z = ufos[n][0].position.z + Math.sin(t) * 30
    }
    renderer.render(scene, camera)
}
function addElements() {
    addFloor();
    addAliens();
    addTerrain();
    addstageLights()
}
function addstageLights() {
    scene.add(new THREE.AmbientLight(0xffffff));
    dlight = new THREE.DirectionalLight(0xffffff, .5);
    dlight.position.set(1, - 1, 1).normalize();
    scene.add(dlight)
}
function addFloor() {
    var texture = THREE.ImageUtils.loadTexture("images/textures/floor.jpg");
    planeGeometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2);
    texture.repeat.set(0.7, 1);
    var groundMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        ambient: 0xffffff,
        shininess: 200,
        specular: 0xffffff,
        map: texture
    });
    groundMaterial.perPixel = true;
    groundMaterial.transparent = false;
    groundMaterial.receiveShadow = true;
    groundMaterial.shading = THREE.FlatShading;
    floor = new THREE.Mesh(planeGeometry, groundMaterial);
    floor.position.y = -(window.innerHeight * .4);
    floor.position.z = 700;
    floor.receiveShadow = true;
    scene.add(floor)
}
function gettweets(tag, func) {
    console.log(tag);
    tweets = [];
    $.getJSON("http://search.twitter.com/search.json?rpp=100&callback=?&q=%23" + tag, function (data) {
        var l = data.results.length;
        while (l--) {
            tweets.push(data.results[l])
        }
        func()
    })
}
function addAliens() {
    particlematerials = [];
    particlegeometry = new THREE.Geometry();
    for (i = 0; i < 15; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 1800 - 500;
        vertex.y = Math.random() * 1800 - 500;
        vertex.z = Math.random() * 1800 - 500;
        particlegeometry.vertices.push(vertex)
    }
    for (alien in aliens) {
        var sp = aliens[alien][2];
        var s = aliens[alien][1];
        particlematerials[i] = new THREE.ParticleBasicMaterial({
            size: s,
            map: sp,
            depthTest: true,
            transparent: true,
            perPixel: true,
            alphaTest: 0.5
        });
        particles = new THREE.ParticleSystem(particlegeometry, particlematerials[i]);
        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;
        scene.add(particles)
    }
    for (ufo in ufoskins) {
        var sr = 8;
        var sp = new THREE.Mesh(new THREE.SphereGeometry(sr, 20, 20), new THREE.MeshBasicMaterial({
            color: 0x025873
        }));
        sp.castShadow = true;
        sp.receiveShadow = false;
        scene.add(sp);
        var l = new THREE.SpotLight(0xffffff, 3);
        l.castShadow = true;
        l.shadowDarkness = .5;
        scene.add(l);
        l.target = sp;
        var plt = ufoskins[ufo][2];
        var pls = ufoskins[ufo][1];
        var plg = new THREE.PlaneGeometry(pls[0] * .65, pls[1] * .65);
        var mat = newGroundPM();
        mat.alphaTest = 0;
        mat.map = plt;
        var pl = new THREE.Mesh(plg, new THREE.MeshBasicMaterial({
            map: plt,
            alphaTest: 0,
            transparent: true
        }));
        pl.rotation.x = 90;
        pl.castShadow = false;
        pl.receiveShadow = false;
        scene.add(pl);
        pl.position.y = floor.position.y + (pls[1] * .3);
        sp.position.y = pl.position.y + pls[1] / 4 - 30;
        l.position.y = sp.position.y + 60;
        ufos.push([sp, l, pl])
    }
}
function addTerrain() {
    groundobjects = [];
    var sgrass1 = terrain.grass1[2];
    var sgrass2 = terrain.grass2[2];
    var size1 = terrain.grass1[1];
    var size2 = terrain.grass2[1];
    var geometry1 = new THREE.PlaneGeometry(size1[0], size1[1]);
    var geometry2 = new THREE.PlaneGeometry(size2[0], size2[1]);
    var count = 4;
    while (count--) {
        var mat = newGroundPM();
        if (count > 1) mat.map = sgrass2;
        else mat.map = sgrass1;
        mat.perPixel = true;
        mat.transparent = true;
        mat.shading = THREE.FlatShading;
        if (count > 1) var gobj = new THREE.Mesh(geometry2, mat);
        else var gobj = new THREE.Mesh(geometry1, mat);
        gobj.rotation.x = 90;
        gobj.rotation.y = 0;
        if (count > 1) gobj.position.y = floor.position.y + size2[1] / 2;
        else gobj.position.y = floor.position.y + size1[1] / 2;
        gobj.castShadow = false;
        gobj.receiveShadow = true;
        groundobjects.push(gobj);
        scene.add(gobj)
    }
    var bldg1 = terrain.bldg1[2];
    var bldgs1 = terrain.bldg1[1];
    var bldgg1 = new THREE.PlaneGeometry(bldgs1[0], bldgs1[1]);
    var mat = newGroundPM();
    mat.map = bldg1;
    gobj = new THREE.Mesh(bldgg1, mat);
    gobj.rotation.x = 90;
    gobj.position.y = floor.position.y + bldgs1[1] / 3;
    gobj.castShadow = false;
    gobj.receiveShadow = true;
    groundobjects.push(gobj);
    scene.add(gobj);
    var hillt = terrain.hill[2];
    var hillst = terrain.hill[1];
    var hillgt = new THREE.PlaneGeometry(hillst[0], hillst[1]);
    var mat = newGroundPM();
    mat.map = hillt;
    var gobj2 = new THREE.Mesh(hillgt, mat);
    gobj2.rotation.x = 90;
    gobj2.position.y = floor.position.y + hillst[1] / 2;
    gobj2.castShadow = false;
    gobj2.receiveShadow = true;
    groundobjects.push(gobj2);
    scene.add(gobj2);
    groundobjects[0].position.z = 1000;
    groundobjects[1].position.z = 100;
    groundobjects[2].position.z = 400;
    groundobjects[3].position.z = 800;
    groundobjects[4].position.z = 600;
    groundobjects[5].position.z = 250;
    groundobjects[0].position.x = 0;
    groundobjects[1].position.x = 500;
    groundobjects[2].position.x = 700;
    groundobjects[3].position.x = -500;
    groundobjects[4].position.x = 100;
    groundobjects[5].position.x = -400
}
function newGroundPM() {
    var mat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 2,
        ambient: 0xbdbdbd,
        specular: 0xffffff,
        alphaTest: 0.5
    });
    mat.perPixel = true;
    mat.transparent = true;
    mat.shading = THREE.FlatShading;
    return mat
}
function resizeObjects() {
    scene.remove(floor);
    addFloor();
    var famt = groundobjects.length;
    while (famt--) {
        scene.remove(groundobjects[famt])
    }
    addTerrain()
}