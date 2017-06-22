var logger = require("js-logger");
var PlayerManager = require("./PlayerManager");
var BABYLON = require("babylonjs");
var LobbyState = require('./LobbyState');

//Player connection information
var playerManager;
var engine, canvas, uiCanvas;

var lobbyState;

//Entry point 
$(function(){
    logger.useDefaults();
    logger.setLevel(logger.INFO);
    logger.info("Version 1.0 Overlipped.IO");
    playerManager = new PlayerManager();
    playerManager.registerGameStateChangeCallback(function(state){
        logger.info("Game is in: " + state + " state");
    });
   
    initialize();       
    
});


function initialize(){
    canvas = document.getElementById('renderCanvas');

    var width = 1920;
    var height = 1080;

    // load the 3D engine
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";   
    engine = new BABYLON.Engine(canvas, true);
    engine.canvasWidth = width;
    engine.canvasHeight = height;
    engine.playerManager = playerManager;

    resizeCanvas();
    lobbyState = new LobbyState(engine, canvas);


    // run the render loop
    engine.runRenderLoop(function(){
        lobbyState.update(10);
        lobbyState.render();
        
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
    //engine.resize();
}

function getDesiredSize(windowWidth, windowHeight, aspectRatio){
    var newWidth = windowWidth;
    var newHeight = (1/aspectRatio)*newWidth;

    if(newHeight > windowHeight){
        newHeight = windowHeight;
        newWidth = aspectRatio * newHeight;
    }

    return {
        width: newWidth,
        height: newHeight
    };
    
    
}


