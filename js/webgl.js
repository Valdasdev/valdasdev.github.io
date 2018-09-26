/*
My WebGL project
*/
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var stats = new Stats();
stats.showPanel( 0 );
var fpsContainer = document.getElementById( 'FPS' );

var clock = new THREE.Clock();

var container = document.getElementById( 'WebGLContent' );
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

//camera.position.x = 10;
//camera.position.y = 20;
//camera.position.z = 40;
//camera.lookAt(scene.position);

//var camControls = new THREE.OrbitControls(camera);
//camControls.autoRotate = false;

//var camControls = new THREE.MapControls(camera);
//camControls.autoRotate = false;

//var camControls = new THREE.TrackballControls(camera);
//camControls.rotateSpeed = 1.0;
//camControls.zoomSpeed = 1.0;
//camControls.panSpeed = 1.0;

//var camControls = new THREE.FlyControls(camera);

//camera.position.set(0,2,0);
//camera.lookAt(new THREE.Vector3(3,3,3));
//var camControls = new THREE.FirstPersonControls(camera);
//camControls.target = new THREE.Vector3( 0, 1, 0 );
/*camControls.lookSpeed = 0.05;
camControls.movementSpeed = 2;
camControls.noFly = true;
camControls.lookVertical = true;
camControls.constrainVertical = true;
camControls.verticalMin = 1.0;
camControls.verticalMax = 2.0;
camControls.lon = -2;
camControls.lat = 2;*/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
var element = document.body;
var pointerlockchange = function ( event ) {
if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
controlsEnabled = true;
controls.enabled = true;
instructions.style.display = 'none';
} else {
controls.enabled = false;
instructions.style.display = '-webkit-box';
instructions.style.display = '-moz-box';
instructions.style.display = 'box';
instructions.style.display = '';
}
};

var pointerlockerror = function ( event ) {
instructions.style.display = '';
};
// Hook pointer lock state change events
document.addEventListener( 'pointerlockchange', pointerlockchange, false );
document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
document.addEventListener( 'pointerlockerror', pointerlockerror, false );
document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
instructions.addEventListener( 'click',
function ( event ) {
instructions.style.display = 'none';
// Ask the browser to lock the pointer
element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
element.requestPointerLock();
}, false );
} else {
instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

controls = new THREE.PointerLockControls( camera );
scene.add( controls.getObject() );

var onKeyDown = function ( event ) {
switch ( event.keyCode ) {
case 38: // up
case 87: // w
moveForward = true;
break;
case 37: // left
case 65: // a
moveLeft = true; break;
case 40: // down
case 83: // s
moveBackward = true;
break;
case 39: // right
case 68: // d
moveRight = true;
break;
case 32: // space
if ( canJump === true ) velocity.y += 350;
canJump = false;
break;
}
};

var onKeyUp = function ( event ) {
switch( event.keyCode ) {
case 38: // up
case 87: // w
moveForward = false;
break;
case 37: // left
case 65: // a
moveLeft = false;
break;
case 40: // down
case 83: // s
moveBackward = false;
break;
case 39: // right
case 68: // d
moveRight = false;
break;
}
};

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
// set initial position
controls.getObject().position.set( 10, 3, 10);


var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -10, 18, 10 );
spotLight.shadow.mapSize.width = 2048; // default 512
spotLight.shadow.mapSize.height = 2048; //default 512

spotLight.intensity = 1.5;
spotLight.distance = 200;
spotLight.angle = Math.PI/3;
spotLight.penumbra = 0.4; // 0 - 1
spotLight.decay = 0.2;

spotLight.castShadow = true;
scene.add( spotLight );

var ambientLight = new THREE.AmbientLight( 0x404040 );
scene.add( ambientLight );

var texPlane = new THREE.TextureLoader().load( "img/grass.jpg" );
texPlane.wrapS = THREE.RepeatWrapping;
texPlane.wrapT = THREE.RepeatWrapping;
texPlane.repeat.set(4,4);

// texPlane.magFilter = THREE.NearestFilter;
texPlane.magFilter = THREE.LinearFilter;
// texPlane.minFilter = THREE.NearestFilter;
// texPlane.minFilter = THREE.NearestMipMapNearestFilter;
// texPlane.minFilter = THREE.NearestMipMapLinearFilter;
// texPlane.minFilter = THREE.LinearFilter;
// texPlane.minFilter = THREE.LinearMipMapNearestFilter;
texPlane.minFilter = THREE.LinearMipMapLinearFilter;
texPlane.anisotropy = 1;

var bump = new THREE.TextureLoader().load( "img/vanduo1.jpg" );
bump.wrapS = THREE.RepeatWrapping;
bump.wrapT = THREE.RepeatWrapping;
bump.repeat.set(4,4);

var planeGeometry = new THREE.PlaneGeometry(40,40);
//var planeMaterial = new THREE.MeshStandardMaterial({color: 0xcccccc});
var planeMaterial = new THREE.MeshStandardMaterial({ map: texPlane, bumpMap: bump, bumpScale: -0.8, overdraw: 0.5 });
planeMaterial.metalness = 0.5; // non metal 0-1 metal default 0.5
planeMaterial.roughness = 1.0; // mirror 0-1 diffuse default 0.5
planeMaterial.side = THREE.DoubleSide;
var plane = new THREE.Mesh(planeGeometry,planeMaterial);

plane.receiveShadow = true;

plane.rotation.x=-0.5*Math.PI;
plane.position.x=0;
plane.position.y=0;
plane.position.z=-5;
scene.add(plane);

var texBricks = new THREE.TextureLoader().load( "img/plytos.jpg" );
var bump = new THREE.TextureLoader().load( "img/plytos1.jpg" );
var boxGeometry = new THREE.BoxGeometry(4,4,4);
//var boxMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
var boxMaterial = new THREE.MeshStandardMaterial({ map: texBricks, overdraw: 0.5 });
boxMaterial.metalness = 0.1; // non metal 0-1 metal default 0.5
boxMaterial.roughness = 0.8; // mirror 0-1 diffuse default 0.5
boxMaterial.bumpMap = bump;
boxMaterial.bumpScale = 0.6;
var box = new THREE.Mesh(boxGeometry, boxMaterial);

box.castShadow = true;
box.material.map.wrapS = THREE.RepeatWrapping;
box.material.map.wrapT = THREE.RepeatWrapping;
box.material.map.repeat.set(0.5,0.5);
box.position.x=5;
box.position.y=2.01;
box.position.z=8;
scene.add(box);

var texWood = new THREE.TextureLoader().load( "img/medis.jpg" );
texWood.repeat.set(0.5,0.5);
var bump = new THREE.TextureLoader().load( "img/medis1.jpg" );
bump.repeat.set(0.5,0.5);
var sphereGeometry = new THREE.SphereGeometry(3,20,20);
//var sphereMaterial = new THREE.MeshStandardMaterial({color: 0x7777ff});
var sphereMaterial = new THREE.MeshStandardMaterial({ map: texWood, overdraw: 0.5 });
sphereMaterial.metalness = 0.7; // non metal 0-1 metal default 0.5
sphereMaterial.roughness = 0.5; // mirror 0-1 diffuse default 0.5
sphereMaterial.bumpMap = bump;
sphereMaterial.bumpScale = 0.2;
var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

sphere.castShadow = true;

sphere.position.x=-10;
sphere.position.y=3;
sphere.position.z=3;
scene.add(sphere);
spotLight.target = sphere;

var texMetal = new THREE.TextureLoader().load( "img/metalas.jpg" );
var coneGeometry = new THREE.ConeGeometry( 4, 6, 4 );
//var coneMaterial = new THREE.MeshStandardMaterial({color: 0x27BA27});
var coneMaterial = new THREE.MeshStandardMaterial ({ map: texMetal, overdraw: 0.5 });
coneMaterial.metalness = 0.8; // non metal 0-1 metal default 0.5
coneMaterial.roughness = 0.4; // mirror 0-1 diffuse default 0.5
var cone = new THREE.Mesh( coneGeometry, coneMaterial );

cone.castShadow = true;

cone.position.x=10;
cone.position.y=3.01;
cone.position.z=-10;
scene.add(cone);

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(0xFFFFFF);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild( renderer.domElement );
fpsContainer.appendChild( stats.dom );
window.addEventListener( 'resize', onWindowResize, false );
show();

function show() {
requestAnimationFrame( show );

// Animations
//var delta = clock.getDelta();
//camControls.update( delta );

if ( controlsEnabled ) {
var time = performance.now();
var delta = ( time - prevTime ) / 1000;
velocity.x -= velocity.x * 10.0 * delta;
velocity.z -= velocity.z * 10.0 * delta;
velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
if ( moveForward ) velocity.z -= 150.0 * delta;
if ( moveBackward ) velocity.z += 150.0 * delta;
if ( moveLeft ) velocity.x -= 150.0 * delta;
if ( moveRight ) velocity.x += 150.0 * delta;
controls.getObject().translateX( velocity.x * delta );
controls.getObject().translateY( velocity.y * delta );
controls.getObject().translateZ( velocity.z * delta );
if ( controls.getObject().position.y < 10 ) {
velocity.y = 0;
controls.getObject().position.y = 2;
canJump = true;
}
prevTime = time;

}

stats.begin();
renderer.render(scene, camera);
stats.end();
}

function onWindowResize() {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( window.innerWidth, window.innerHeight );
}
