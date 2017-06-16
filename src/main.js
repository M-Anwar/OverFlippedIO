/**
 * Note: To use the Babylonjs node module go to the node_modules folder and find the 
 * babylonjs folder. Inside open the package.json and go to the "main" field. Replace 
 * that line with "main": "dist/preview release/babylon.max.js", and now you will be 
 * able to require it. This is a weird bug in the way the npm module is designed. Maybe
 * future versions will fix this.
 */


var logger = require("js-logger");
var PlayerManager = require("./PlayerManager");
var BABYLON = require("babylonjs");

//Player connection information
var playerManager;


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
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

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
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.material = new BABYLON.StandardMaterial("texture1", scene);
        sphere.material.diffuseColor = new BABYLON.Color3(1.0,0.8,0.7);
        

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

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
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
}


