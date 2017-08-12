/**
 * GUI Reference: http://doc.babylonjs.com/extensions/canvas2d_home
 */

var GameState = require("./GameState");
var BABYLON = require("babylonjs");
var Arena = require("../Arena/Arena")

class LobbyState extends GameState{

    constructor(name, engine, canvas){
        super(name, engine, canvas);
        this.scene = this.createScene();            
    }

    // createScene function that creates and return the scene
   createScene(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(1,1.0,1.0);
        
        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.ArcRotateCamera('camera2', -Math.PI/2,Math.PI/6, 110, new BABYLON.Vector3(0, 0,0), scene);
        this.camera = camera;        
       
        // attach the camera to the canvas        
        camera.attachControl(this.canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        var arena = new Arena(scene);
        
        // return the created scene
        return scene;
    }
  

    update(delta){   
        this.camera.alpha +=0.01;                  
    }
    
    render(){
        
        this.scene.render();
       
    }
}

module.exports = LobbyState;