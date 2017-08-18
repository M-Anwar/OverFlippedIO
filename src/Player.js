var BABYLON = require("babylonjs");


class Player{

    /**
     * Instantiate a new player
     * @param {BABYLON.Scene} scene 
     */
    constructor(scene){
       BABYLON.SceneLoader.ImportMesh("FullPlayer", "img/", "player3.babylon", scene, (newMeshes)=>{
            this.playerMesh = newMeshes[0];

            this.playerMesh.material = new BABYLON.StandardMaterial("texture1", scene);
            this.playerMesh.material.diffuseTexture = new BABYLON.Texture("img/cubeUV.png");
            this.playerMesh.position = new BABYLON.Vector3(10,30,1);
            this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.playerMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2,friction:0.5, restitution: 0.6 }, scene);
            scene.shadowGenerator.getShadowMap().renderList.push(this.playerMesh);
            this.playerMesh.isVisible = true;
          

            // setTimeout(()=>{ this.playerMesh.isVisible = true;}, 3000);
       });

       this.scene = scene;
        
    }
   
}

module.exports = Player;