/**
 * Data structure that holds one cell of the 
 */

class Arena{
    constructor(scene){
        this.scene = scene;
        this.createArena(this.scene);
    }
    
    createArena(scene){
        var ground = BABYLON.Mesh.CreateBox("ground1", 1,scene);
        ground.scaling.x = 100;
        ground.scaling.z = 100;
        ground.scaling.y = 2;
        ground.position.y = -1;

        ground.material = new BABYLON.StandardMaterial("texture2", scene)
        ground.material.diffuseTexture = new BABYLON.Texture("img/grid.png");
        ground.material.diffuseTexture.uScale = 1.0;
        ground.material.diffuseTexture.vScale = 1.0;
        ground.material.bumpTexture = new BABYLON.Texture("img/normal3.png", scene);
        ground.material.bumpTexture.uScale = 1.0;
        ground.material.bumpTexture.vScale = 1.0;
        ground.material.backFaceCulling = false;          
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction:0.5,restitution: 0.9 }, scene);     
        ground.receiveShadows = true;  
        this.ground = ground;
        
        var wallHeight = 10;
        var wall1 = BABYLON.Mesh.CreateBox('wall1', 1,scene);
        wall1.material = new BABYLON.StandardMaterial("texture2", scene)
        wall1.material.diffuseTexture = new BABYLON.Texture("img/grid2.png");
        wall1.material.diffuseTexture.uScale = 1;
        wall1.material.diffuseTexture.vScale = 1/10;
        wall1.material.bumpTexture = new BABYLON.Texture("img/normal3.png", scene);
        wall1.material.bumpTexture.uScale = 1.0;
        wall1.material.bumpTexture.vScale = 1.0/10;
        wall1.scaling.x = 100;
        wall1.scaling.y = wallHeight;
        wall1.position.z = 50+4;
        wall1.position.y = 3;
        wall1.rotation.x = Math.PI/4;
        wall1.physicsImposter = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);        
        this.wall1 = wall1;

        var wall2 = BABYLON.Mesh.CreateBox('wall2', 1,scene);
        wall2.scaling.x = 99;
        wall2.scaling.y = wallHeight;
        wall2.position.z = -50-4; 
        wall2.position.y = 3;
        wall2.isVisible=false;  
        wall2.rotation.x = -Math.PI/4;     
        wall2.physicsImposter = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);
        this.wall2 = wall2;

        var wall3 = BABYLON.Mesh.CreateBox('wall3', 1,scene);
        wall3.material = new BABYLON.StandardMaterial("texture2", scene)
        wall3.material.diffuseTexture = new BABYLON.Texture("img/grid2.png");
        wall3.material.diffuseTexture.uScale = 1/10;
        wall3.material.diffuseTexture.vScale = 1;
        wall3.material.bumpTexture = new BABYLON.Texture("img/normal3.png", scene);
        wall3.material.bumpTexture.uScale = 1.0/10;
        wall3.material.bumpTexture.vScale = 1.0;
        wall3.scaling.z = 100;
        wall3.scaling.y = wallHeight;
        wall3.position.x = -50-4;   
        wall3.position.y=3;     
        wall3.rotation.z = Math.PI/4;    
        wall3.physicsImposter = new BABYLON.PhysicsImpostor(wall3, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);
        this.wall3 = wall3;

        var wall4 = BABYLON.Mesh.CreateBox('wall4', 1,scene);
        wall4.material = new BABYLON.StandardMaterial("texture2", scene)
        wall4.material.diffuseTexture = new BABYLON.Texture("img/grid2.png");
        wall4.material.diffuseTexture.uScale = 1/10;
        wall4.material.diffuseTexture.vScale = 1;
        wall4.material.bumpTexture = new BABYLON.Texture("img/normal3.png", scene);
        wall4.material.bumpTexture.uScale = 1.0/10;
        wall4.material.bumpTexture.vScale = 1.0;
        wall4.scaling.z = 100;
        wall4.scaling.y = wallHeight;
        wall4.position.x = 50 +4;   
        wall4.position.y=3;     
        wall4.rotation.z = -Math.PI/4;   
        wall4.physicsImposter = new BABYLON.PhysicsImpostor(wall4, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);        
        this.wall4 = wall4;
    }
    

}

module.exports = Arena;