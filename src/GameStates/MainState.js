var GameState = require("./GameState");
var BABYLON = require("babylonjs");
var Arena = require("../Arena/Arena").Arena;
var Player = require('../Player');

class MainState extends GameState{

    constructor(name, engine, canvas){
        super(name, engine, canvas);
        this.scene = this.createScene();
        this.debugUI = $("#debug"); 
        this.timer = 0;
        this.arena = new Arena(this.scene);
         
    }

    // createScene function that creates and return the scene
   createScene(){
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(1,1.0,1.0);
        scene.enablePhysics(new BABYLON.Vector3(0,-50, 0), new BABYLON.CannonJSPlugin());                     

        var camera = new BABYLON.ArcRotateCamera('camera2', -Math.PI/2,Math.PI/6, 120, new BABYLON.Vector3(0, 0,-5), scene);
        this.camera = camera;     
        camera.attachControl(this.canvas, true);

        var light = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(-0.5, -1.4, 0.2), scene);
        light.position = new BABYLON.Vector3(0, 100,0);      
        scene.sunLight = light;
        
        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        scene.shadowGenerator = shadowGenerator;
    
         // Player Sphere
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.material = new BABYLON.StandardMaterial("texture1", scene);
        sphere.material.diffuseTexture = new BABYLON.Texture("img/grass.jpg");
          
        sphere.position.y = 1;
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2,friction:0.5, restitution: 0.9 }, scene);
        sphere.physicsImpostor.physicsBody.angularDamping  = 0.7;
        sphere.physicsImpostor.physicsBody.linearDamping = 0.9;
        this.player = sphere;
        shadowGenerator.getShadowMap().renderList.push(sphere);

        this.player = new Player(scene);


        // setInterval(()=>{
        //     new Player(scene);
            
        // }, 100);

        var material = new BABYLON.StandardMaterial("texture1", scene);
        material.diffuseColor = new BABYLON.Color3(Math.random(),Math.random(),Math.random());   
        // Bunch of other random spheres
        for(var i = 0; i < 10; i++){
            var sphere1 = BABYLON.Mesh.CreateSphere('sphere' +i , 8, 4, scene);
            sphere1.material = material;
            sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.5, friction: 0.9,restitution: 0.9 }, scene);        
            sphere1.physicsImpostor.physicsBody.angularDamping = 0.7;    
            sphere1.position.y = 2;
            sphere1.position.x = -50 + Math.random()*100;
            sphere1.position.z = -50 + Math.random()*100;
            shadowGenerator.getShadowMap().renderList.push(sphere1);           
        } 

        
        return scene;
    }  

    update(delta){    
        this.debugUI.text("FPS: " + this.engine.getFps());
        
        if(this.engine.playerManager.getPlayerCount()>0){
            var control = this.engine.playerManager.getPlayer(0); 
            this.debugUI.text(control.tilt_LR + ", " + control.tilt_FB + ", " + control.boosted);          
            if(control){
                
                
                if(control.boosted){
                    this.player.physicsImpostor.applyImpulse(new BABYLON.Vector3(control.tilt_LR/45 * 25, 0, -control.tilt_FB/45 *25), this.player.getAbsolutePosition());
                    console.log("BOOSTING!");
                }else{
                    this.player.physicsImpostor.applyImpulse(new BABYLON.Vector3(control.tilt_LR/45 * 5, 0, -control.tilt_FB/45 *5), this.player.getAbsolutePosition());
                }
                
            }           
        }       
    }
    
    render(){
        
        this.scene.render();
       
    }
}

module.exports = MainState;