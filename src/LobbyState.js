/**
 * GUI Reference: http://doc.babylonjs.com/extensions/canvas2d_home
 */

var GameState = require("./GameState");
var BABYLON = require("babylonjs");

class LobbyState extends GameState{

    constructor(engine, canvas){
        super("LobbyState", engine, canvas);
        this.scene = this.createScene();
    }

    // createScene function that creates and return the scene
   createScene(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(1,1.0,1.0);
        
        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.ArcRotateCamera('camera2', -Math.PI/2,Math.PI/5, 100, new BABYLON.Vector3(0, 0,0), scene);
        this.camera = camera;
        
        // target the camera to scene origin
        //camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas        
        camera.attachControl(this.canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.material = new BABYLON.StandardMaterial("texture1", scene);
        sphere.material.emissiveColor = new BABYLON.Color3(0.2,0.3,0.4);
        sphere.material.diffuseColor = new BABYLON.Color3(0.1,0.4,0.8);

        var sphere1 = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
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
  

    update(delta){
        //console.log("This is the update method: " + this.name);
        this.camera.alpha +=0.01;    

        // this.engine.uiLayer.removeChildren();
        // this.engine.uiLayer.add(this.circle);
        // var circle = this.engine.uiLayer.find("#circle")[0];
        // circle.fill("blue");
        
       //console.log(circle);
    }
    
    render(){
        
        this.scene.render();
        //this.engine.uiLayer.draw();
    }
}

module.exports = LobbyState;