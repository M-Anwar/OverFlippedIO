import * as BABYLON from 'babylonjs';
import * as PlayerManager from './PlayerManager';



export class Player{
    scene: BABYLON.Scene;
    

    playerMesh: BABYLON.Mesh;

    /**
     * Instantiate a new player
     * @param {BABYLON.Scene} scene 
     */
    constructor(scene: BABYLON.Scene){
       BABYLON.SceneLoader.ImportMesh("FullPlayer", "img/", "player3.babylon", scene, (newMeshes: BABYLON.Mesh[])=>{
            this.playerMesh = newMeshes[0];

            let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
            let playerTexture = new BABYLON.Texture("img/cubeUV.png",scene);
            playerMaterial.diffuseTexture = playerTexture;
            this.playerMesh.material = playerMaterial;
            
            this.playerMesh.position = new BABYLON.Vector3(10,30,1);
            this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.playerMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2,friction:0.5, restitution: 0.6 }, scene);            
            this.playerMesh.isVisible = true;

           

            // setTimeout(()=>{ this.playerMesh.isVisible = true;}, 3000);
       });

       this.scene = scene;
        
    }
    
   
}
