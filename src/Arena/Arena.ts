import * as BABYLON from 'babylonjs';

export class Arena{
    scene: BABYLON.Scene;
    
    //Params
    wallHeight: number = 10;

    //Meshes
    ground: BABYLON.Mesh;
    wall1: BABYLON.Mesh;
    wall2: BABYLON.Mesh;
    wall3: BABYLON.Mesh;
    wall4: BABYLON.Mesh;


    constructor(scene){
        this.scene = scene;
        this.createArena(this.scene);
    }
    
    private createArena(scene){
         //Textures        
        let groundTexture = new BABYLON.Texture("img/grid.png", scene);        
        let wallTexture = new BABYLON.Texture("img/grid2.png",scene);
        let bumpTexture = new BABYLON.Texture("img/normal3.png", scene);  
        groundTexture.uScale = 1.0; groundTexture.vScale = 1.0;
        bumpTexture.uScale = 1.0; bumpTexture.vScale = 1.0;
        
        //Ground
        let ground = BABYLON.Mesh.CreateBox("ground", 1, scene);
        ground.scaling.x = 100;
        ground.scaling.z = 100;
        ground.scaling.y = 2;
        ground.position.y = -1;
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.bumpTexture = bumpTexture;
        ground.material = groundMaterial;           
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction:0.5,restitution: 0.9 }, scene);     
        ground.receiveShadows = true;  
        this.ground = ground;
        
        //Walls
        let wall1 = this.getWall(1,1,1/10,wallTexture,bumpTexture);       
        wall1.scaling.x = 100;
        wall1.scaling.y = this.wallHeight;
        wall1.position.z = 50+4;
        wall1.position.y = 3;
        wall1.rotation.x = Math.PI/4;
        wall1.physicsImpostor = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);        
        this.wall1 = wall1;

        var wall2 = this.getWall(2,1,1/10,wallTexture,bumpTexture);       
        wall2.scaling.x = 100;
        wall2.scaling.y = this.wallHeight;
        wall2.position.z = -50-4; 
        wall2.position.y = 3;
        wall2.isVisible=false;  
        wall2.rotation.x = -Math.PI/4;     
        wall2.physicsImpostor = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);
        this.wall2 = wall2;

        var wall3 = this.getWall(3,1/10,1,wallTexture,bumpTexture);         
        wall3.scaling.z = 100;
        wall3.scaling.y = this.wallHeight;
        wall3.position.x = -50-4;   
        wall3.position.y=3;     
        wall3.rotation.z = Math.PI/4;    
        wall3.physicsImpostor = new BABYLON.PhysicsImpostor(wall3, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);
        this.wall3 = wall3;

        var wall4 = this.getWall(4,1/10,1,wallTexture,bumpTexture);         
        wall4.scaling.z = 100;
        wall4.scaling.y = this.wallHeight;
        wall4.position.x = 50 +4;   
        wall4.position.y=3;     
        wall4.rotation.z = -Math.PI/4;   
        wall4.physicsImpostor = new BABYLON.PhysicsImpostor(wall4, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0}, scene);        
        this.wall4 = wall4;
    }
    
    private getWall(wallNum:number, uScale:number, vScale: number, 
        diffText: BABYLON.Texture, bumpText: BABYLON.Texture): BABYLON.Mesh 
    {
        //Materials and Textures
        let wallMaterial = new BABYLON.StandardMaterial("wallMat"+wallNum, this.scene);
        let diffuseTexture = diffText.clone(); 
        let bumpTexture = bumpText.clone();
        diffuseTexture.uScale = uScale; diffuseTexture.vScale= vScale;
        bumpTexture.uScale = uScale; bumpTexture.vScale = vScale;
        wallMaterial.diffuseTexture = diffuseTexture;
        wallMaterial.bumpTexture = bumpTexture;
    
        //Geometry
        let wall = BABYLON.Mesh.CreateBox('wall'+wallNum, 1, this.scene);
        wall.material = wallMaterial;

        return wall;
    }

}
