var THREE = require("three");
var logger = require("js-logger");
var PlayerManager = require("./PlayerManager");

var scene, camera, renderer;
var playerManager;


var cube;
//Entry point 
$(function(){
    logger.useDefaults();
    logger.setLevel(logger.INFO);
    logger.debug("Version 1.0 Overlipped.IO");
    playerManager = new PlayerManager();
    initialize();
});


function initialize(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    addToDOM(renderer.domElement);
    window.addEventListener('resize', resizeWindow, false);

    //setup scene
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    render();
}


function render(){
    requestAnimationFrame( render );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}


function resizeWindow(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function addToDOM(object){
    var container = document.getElementById('canvas-body');
    container.appendChild(object);
}