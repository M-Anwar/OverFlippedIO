var logger = require("js-logger");
var PlayerManager = require("./PlayerManager");
var BABYLON = require("babylonjs");
var LobbyState = require('./GameStates/LobbyState');
var MainState = require('./GameStates/MainState');
var UIManager = require('./UIManager');

//Player connection information
var playerManager;
var engine, canvas;

var states ={};
var uiManager;

var debugMode = true;

//Entry point 
$(function(){
    logger.useDefaults();
    logger.setLevel(logger.INFO);
    logger.info("Version 1.0 Overlipped.IO");
    playerManager = new PlayerManager();    
    initialize();       
    
});


function initialize(){
    canvas = document.getElementById('renderCanvas');
    UI = document.getElementById('UI')

    var width = 1280;
    var height =720;

    // load the 3D engine
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";   
    UI.style.width = width + "px";
    UI.style.height = height + "px";  
    engine = new BABYLON.Engine(canvas, true);
    engine.canvasWidth = width;
    engine.canvasHeight = height;
    engine.playerManager = playerManager;
    engine.debugMode = debugMode;
    if(debugMode){
        engine.currentState = "main";
    }
    else{
        engine.currentState = "lobby";
    }
    
    resizeCanvas();


    states["lobby"] = new LobbyState("lobby", engine, canvas);
    states["main"] = new MainState("main", engine, canvas);

    uiManager = new UIManager(engine);
    
    

    // run the render loop
    engine.runRenderLoop(function(){
        states[engine.currentState].update(10);
        states[engine.currentState].render();
        
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
    UI.style.width = width.toString() + "px";
    UI.style.height = height.toString() + "px";     
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


