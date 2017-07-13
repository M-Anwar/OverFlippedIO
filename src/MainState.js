var GameState = require("./GameState");
var BABYLON = require("babylonjs");


class MainState extends GameState{

    constructor(name, engine, canvas){
        super(name, engine, canvas);
        this.scene = this.createScene();
        this.debugUI = $("#debug");            
    }

    // createScene function that creates and return the scene
   createScene(){
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(1,1.0,1.0);
        scene.enablePhysics(new BABYLON.Vector3(0,-50, 0), new BABYLON.CannonJSPlugin());                     

        var camera = new BABYLON.ArcRotateCamera('camera2', -Math.PI/2,Math.PI/5, 110, new BABYLON.Vector3(0, 0,-10), scene);
        this.camera = camera;     
        camera.attachControl(this.canvas, true);

        var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(-0.4, -1, 1.0), scene);
        light.position = new BABYLON.Vector3(0, 80, 0);
        // // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // // Default intensity is 1. Let's dim the light a small amount
        // light.intensity = 0.7;
        
        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        
    
         // Player Sphere
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.material = new BABYLON.StandardMaterial("texture1", scene);
        sphere.material.diffuseTexture = new BABYLON.Texture("img/noImage.png");
        sphere.position.y = 1;
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2,friction:0.5, restitution: 0.9 }, scene);
        sphere.physicsImpostor.physicsBody.angularDamping  = 0.7;
        sphere.physicsImpostor.physicsBody.linearDamping = 0.9;
        this.player = sphere;
        shadowGenerator.getShadowMap().renderList.push(sphere);


        var material = new BABYLON.StandardMaterial("texture1", scene);
        material.diffuseColor = new BABYLON.Color3(Math.random(),Math.random(),Math.random());   
        //Bunch of other random spheres
        for(var i = 0; i < 10; i++){
            var sphere1 = BABYLON.Mesh.CreateSphere('sphere' +i , 8, 4, scene);
            sphere1.material = material;
            sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.5, friction: 0.5,restitution: 0.9 }, scene);        
            sphere1.physicsImpostor.physicsBody.angularDamping = 0.7;    
            sphere1.position.y = 2;
            sphere1.position.x = -50 + Math.random()*100;
             sphere1.position.z = -50 + Math.random()*100;
             shadowGenerator.getShadowMap().renderList.push(sphere1);
        }
        
       
        // The Arena
        var ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 4, scene);
        ground.material = new BABYLON.StandardMaterial("texture2", scene)
        ground.material.diffuseTexture = new BABYLON.Texture("img/grass.jpg")
        ground.material.diffuseTexture.uScale = 5.0;
        ground.material.diffuseTexture.vScale = 5.0;
        ground.material.backFaceCulling = false;   
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction:0.5,restitution: 0.9 }, scene);     
        ground.receiveShadows = true;  
        
        var wallHeight = 10;
        var wall1 = BABYLON.Mesh.CreateBox('wall1', 1,scene);
        wall1.scaling.x = 100;
        wall1.scaling.y = wallHeight;
        wall1.position.z = 50;
        wall1.position.y = 5;
        wall1.physicsImposter = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);
        wall1.material = new BABYLON.StandardMaterial("texture1", scene);
        wall1.material.diffuseTexture = new BABYLON.Texture("img/grass.jpg")
        wall1.material.diffuseTexture.uScale = 5.0;
        wall1.material.diffuseTexture.vScale = 1.0;

        var wall2 = BABYLON.Mesh.CreateBox('wall2', 1,scene);
        wall2.scaling.x = 99;
        wall2.scaling.y = wallHeight;
        wall2.position.z = -50; 
        wall2.position.y = 5;
        wall2.isVisible=false;       
        wall2.physicsImposter = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);

        var wall3 = BABYLON.Mesh.CreateBox('wall3', 1,scene);
        wall3.scaling.z = 100;
        wall3.scaling.y = wallHeight;
        wall3.position.x = -50;   
        wall3.position.y=5;     
        wall3.physicsImposter = new BABYLON.PhysicsImpostor(wall3, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);

        var wall4 = BABYLON.Mesh.CreateBox('wall4', 1,scene);
        wall4.scaling.z = 100;
        wall4.scaling.y = wallHeight;
        wall4.position.x = 50;   
        wall4.position.y=5;     
        wall4.physicsImposter = new BABYLON.PhysicsImpostor(wall4, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);



        // The Arena
        var roof = BABYLON.Mesh.CreateGround('roof', 100, 100, 4, scene);    
        roof.position.y= wallHeight;  
        roof.isVisible = false;
        roof.physicsImpostor = new BABYLON.PhysicsImpostor(roof, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction:0.5,restitution: 0.9 }, scene); 

        
        return scene;
    }

    createScene2(){
        var scene = new BABYLON.Scene(this.engine);
        scene.clearColor = BABYLON.Color3.Purple();

        var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -20), scene);
        camera.checkCollisions = true;
        camera.applyGravity = true;
        camera.setTarget(new BABYLON.Vector3(0, 0, 0));

        var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0.2, -1, 0), scene);
        light.position = new BABYLON.Vector3(0, 80, 0);

        // Material
        var materialAmiga = new BABYLON.StandardMaterial("amiga", scene);
        materialAmiga.diffuseTexture = new BABYLON.Texture("../../assets/amiga.jpg", scene);
        materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        materialAmiga.diffuseTexture.uScale = 5;
        materialAmiga.diffuseTexture.vScale = 5;

        var materialAmiga2 = new BABYLON.StandardMaterial("amiga", scene);
        materialAmiga2.diffuseTexture = new BABYLON.Texture("../../assets/mosaic.jpg", scene);
        materialAmiga2.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        shadowGenerator.getShadowMap().renderList.push(box0);

        // Physics
        scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
        // scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

        // Spheres
        var y = 0;
        for (var index = 0; index < 100; index++) {
            var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 3, scene);
            sphere.material = materialAmiga;

            sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);

            shadowGenerator.getShadowMap().renderList.push(sphere);

            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
    
            y += 2;
        }

        // Link
        var spheres = [];
        for (index = 0; index < 10; index++) {
            sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 1, scene);
            spheres.push(sphere);
            sphere.material = materialAmiga2;
            sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);

            shadowGenerator.getShadowMap().renderList.push(sphere);

            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
        }

        for (index = 0; index < 9; index++) {
            spheres[index].setPhysicsLinkWith(spheres[index + 1], new BABYLON.Vector3(0, 0.5, 0), new BABYLON.Vector3(0, -0.5, 0));
        }

        // Box
        var box0 = BABYLON.Mesh.CreateBox("Box0", 3, scene);
        box0.position = new BABYLON.Vector3(3, 30, 0);
        var materialWood = new BABYLON.StandardMaterial("wood", scene);
        materialWood.diffuseTexture = new BABYLON.Texture("../../assets/wood.jpg", scene);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        box0.material = materialWood;

        shadowGenerator.getShadowMap().renderList.push(box0);

        // Compound
        var part0 = BABYLON.Mesh.CreateBox("part0", 3, scene);
        part0.position = new BABYLON.Vector3(3, 30, 0);
        part0.material = materialWood;

        var part1 = BABYLON.Mesh.CreateBox("part1", 3, scene);
        part1.parent = part0; // We need a hierarchy for compound objects
        part1.position = new BABYLON.Vector3(0, 3, 0);
        part1.material = materialWood;

        shadowGenerator.getShadowMap().renderList.push(part0);
        shadowGenerator.getShadowMap().renderList.push(part1);


        // Playground
        var ground = BABYLON.Mesh.CreateBox("Ground", 1, scene);
        ground.scaling = new BABYLON.Vector3(100, 1, 100);
        ground.position.y = -5.0;
        ground.checkCollisions = true;

        var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
        border0.scaling = new BABYLON.Vector3(1, 100, 100);
        border0.position.y = -5.0;
        border0.position.x = -50.0;
        border0.checkCollisions = true;

        var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
        border1.scaling = new BABYLON.Vector3(1, 100, 100);
        border1.position.y = -5.0;
        border1.position.x = 50.0;
        border1.checkCollisions = true;

        var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
        border2.scaling = new BABYLON.Vector3(100, 100, 1);
        border2.position.y = -5.0;
        border2.position.z = 50.0;
        border2.checkCollisions = true;

        var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
        border3.scaling = new BABYLON.Vector3(100, 100, 1);
        border3.position.y = -5.0;
        border3.position.z = -50.0;
        border3.checkCollisions = true;

        var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;
        border0.material = groundMat;
        border1.material = groundMat;
        border2.material = groundMat;
        border3.material = groundMat;
        ground.receiveShadows = true;

        // Physics
        box0.physicsImpostor = new BABYLON.PhysicsImpostor(box0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, friction: 0.4, restitution: 0.3 }, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
        border0.physicsImpostor = new BABYLON.PhysicsImpostor(border0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        border1.physicsImpostor = new BABYLON.PhysicsImpostor(border1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        border2.physicsImpostor = new BABYLON.PhysicsImpostor(border2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        border3.physicsImpostor = new BABYLON.PhysicsImpostor(border3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

        part0.physicsImpostor = new BABYLON.PhysicsImpostor(part0, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, friction: 0.4, restitution: 0.3 }, scene);

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