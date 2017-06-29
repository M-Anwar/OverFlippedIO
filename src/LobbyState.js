/**
 * GUI Reference: http://doc.babylonjs.com/extensions/canvas2d_home
 */

var GameState = require("./GameState");
var BABYLON = require("babylonjs");


class LobbyState extends GameState{

    constructor(name, engine, canvas){
        super(name, engine, canvas);
        this.scene = this.createScene();     


        //Populate UI variables to control data
        this.lobbyUI ={}
        this.lobbyUI.container = $("#lobby");
        this.lobbyUI.title = $("div.title").find("h1");
        this.lobbyUI.gameStatus = $("#gameStatus").find("p");   
        this.lobbyUI.playerCards = [];

        for(var i =0; i < this.engine.playerManager.maxPlayers; i++){
            var playerCard = {}
            playerCard.userName = $("#player" + i + " #username");      
            playerCard.image = $("#player" + i + " #playerImage");     
            playerCard.playerStatus =  $("#player" + i + " #playerStatus");  
            playerCard.entireCard = $("#player" + i);                
            this.lobbyUI.playerCards.push(playerCard);            
        }    

        if(this.engine.playerManager.currentGameState == this.engine.playerManager.gameState.LOBBY ||
           this.engine.playerManager.currentGameState == this.engine.playerManager.gameState.DISCONNECT){
            this.lobbyUI.container.show();
        }
        

        //Setup UI updates from player manager callbacks
        var playerManager = this.engine.playerManager;
        var self = this;
        playerManager.registerUserAddCallback(function(id, data){
            var index = playerManager.getPlayerIndex(id);
            self.lobbyUI.playerCards[index].entireCard.animateCss("bounce");
            self.lobbyUI.playerCards[index].userName.text(data.userName);
            self.lobbyUI.playerCards[index].entireCard.addClass("joined").removeClass("notJoined");
            self.lobbyUI.playerCards[index].playerStatus.text("Not Ready");
        });
        playerManager.registerUserDisconnectCallback(function(id, data){
            var index = playerManager.getPlayerIndex(id);
            self.lobbyUI.playerCards[index].entireCard.animateCss("bounce");
            self.lobbyUI.playerCards[index].userName.text("Player " + (parseInt(index)+1));
            self.lobbyUI.playerCards[index].entireCard.addClass("notJoined").removeClass("joined");
            self.lobbyUI.playerCards[index].playerStatus.text("Waiting");
            self.lobbyUI.playerCards[index].playerStatus.addClass("notReady").removeClass("ready");

        });
        playerManager.registerUserUpdateCallback(function(id,data){
            var index = playerManager.getPlayerIndex(id);
            var playerElement = playerManager.getPlayerById(id);    
            self.lobbyUI.playerCards[index].playerStatus.animateCss("pulse");           
            
            if(playerElement.userReady){
                self.lobbyUI.playerCards[index].playerStatus.text("Ready");
                self.lobbyUI.playerCards[index].playerStatus.addClass("ready").removeClass("notReady");
            }
            else{
                
                self.lobbyUI.playerCards[index].playerStatus.text("Not Ready");
                self.lobbyUI.playerCards[index].playerStatus.addClass("notReady").removeClass("ready");
            }            
            
        });
        playerManager.registerGameStateChangeCallback(function(gameState){
            clearInterval(x);
            if(gameState == playerManager.gameState.GAME){
                var count = 5;
                var x = setInterval(function(){
                    count --;
                    self.lobbyUI.gameStatus.text("STARTING IN ... " + count);
                    if(count ==0){
                        self.lobbyUI.gameStatus.text("STARTING GAME");     
                        self.lobbyUI.container.animateCss("bounceOut", function(){
                            self.lobbyUI.container.hide();
                            self.engine.currentState="main";
                        });                      

                        clearInterval(x);
                    }
                },1000);
            }
            else if(gameState == playerManager.gameState.DISCONNECT){
                self.lobbyUI.gameStatus.text("DISCONNECTED");
                self.lobbyUI.container.show();               
                self.lobbyUI.container.animateCss("bounceIn");
                
            }
            else if(gameState == playerManager.gameState.LOBBY){
                self.lobbyUI.gameStatus.text("WAITING FOR PLAYERS");
            }
        })
        
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
        this.camera.alpha +=0.01;                  
    }
    
    render(){
        
        this.scene.render();
       
    }
}

module.exports = LobbyState;