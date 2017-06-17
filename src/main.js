var logger = require("js-logger");
var PlayerManager = require("./PlayerManager");
var BABYLON = require("babylonjs");

//Player connection information
var playerManager;

var engine, canvas;

var sphere, sphere1;

//Entry point 
$(function(){
    logger.useDefaults();
    logger.setLevel(logger.INFO);
    logger.info("Version 1.0 Overlipped.IO");
    playerManager = new PlayerManager();
    playerManager.registerGameReadyCallback(function(){
        logger.info("Game is ready!");
    });
    initialize();   

});


function initialize(){
    canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    canvas.style.width = "1920px";
    canvas.style.height = "1080px";
    engine = new BABYLON.Engine(canvas, true);
    resizeCanvas();

    // createScene function that creates and return the scene
    var createScene = function(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.ArcRotateCamera('camera2', 1,0.8, 10, new BABYLON.Vector3(0, 0,0), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas
        camera.attachControl(canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.material = new BABYLON.StandardMaterial("texture1", scene);
        sphere.material.emissiveColor = new BABYLON.Color3(0.2,0.3,0.4);
        sphere.material.diffuseColor = new BABYLON.Color3(0.1,0.4,0.8);

        sphere1 = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere1.material = new BABYLON.StandardMaterial("texture1", scene);
        sphere1.material.diffuseColor = new BABYLON.Color3(1.0,0.8,0.7);
        

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;
        sphere1.position.y = 1
        sphere1.position.x = -5;

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 4, scene);
        ground.material = new BABYLON.StandardMaterial("texture2", scene)
        ground.material.diffuseTexture = new BABYLON.Texture("img/grass.jpg")
        ground.material.diffuseTexture.uScale = 5.0;
        ground.material.diffuseTexture.vScale = 5.0;
        ground.material.backFaceCulling = false;

        // return the created scene
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        var players = playerManager.getAllPlayers();
        if(players.length > 0){            
            sphere.position.x += players[0].tilt_LR/100;
            sphere.position.z += players[0].tilt_FB/100;
        }
        if(players.length > 1){            
            sphere1.position.x += players[1].tilt_LR/100;
            sphere1.position.z += players[1].tilt_FB/100;
        }


        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        resizeCanvas();       
    });
}

function resizeCanvas(){
    var new_size = getDesiredSize($(window).width(), $(window).height(), 16/9);
    var width = new_size.width;
    var height = new_size.height;  
    canvas.style.width = width.toString() + "px";
    canvas.style.height = height.toString() + "px";
    engine.resize();
}

function getDesiredSize(windowWidth, windowHeight, aspectRatio){
    var newWidth = windowWidth;
    var newHeight = (1/aspectRatio)*newWidth;
    return {
        width: newWidth,
        height: newHeight
    };
    
    
}


