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
        
        
                // target the camera to scene origin
        //camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas        
        //camera.attachControl(canvas, false);

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


        //Canvas2D UI 
        var width = this.engine.canvasWidth * 0.9;
        var height = this.engine.canvasHeight * 0.8;

        var playerTextures = [new BABYLON.Texture("img/player0.png", scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE),
                              new BABYLON.Texture("img/player1.png", scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE),
                              new BABYLON.Texture("img/player2.png", scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE),
                              new BABYLON.Texture("img/player3.png", scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE)]
        for(var texture in playerTextures){
            playerTextures[texture].hasAlpha = true;          
        }
        
        

        var canvas2D = new BABYLON.ScreenSpaceCanvas2D(scene, 
        { 
            id: "ScreenCanvas", size: new BABYLON.Size(width, height), 
            backgroundFill: "#2b2b2bD0", backgroundRoundRadius: 12,
            x:this.engine.canvasWidth/2-width/2, y:this.engine.canvasHeight/2-height/2
            
        });

        this.canvas2D = canvas2D;
        this.camera = camera;
        this.scene = scene;       
        this.playerTextures = playerTextures;
        var playerCards = []
        
        for(var i =0;i< this.engine.playerManager.maxPlayers; i++){
            
            var card = new BABYLON.Group2D({
                id:"Player "+ i, layoutEngine:"VerticalStackPanel", marginRight:20, marginLeft:20, 
                children:[
                    
                    new BABYLON.Text2D("Not Joined", {
                        id: "playerName"+i,   
                        defaultFontColor:new BABYLON.Color4(1,1,1,1),                    
                        fontName: "Bold 20pt Arial",
                        marginAlignment: "v: center, h: center"
                    }),                    
                    new BABYLON.Rectangle2D({ id: "playerBox" + i, width: 240, height: 200, fill: "#40F040FF", margin: 10,
                        border: "#FFFFFFFF", borderThickness: 5, roundRadius:20,
                        children:[
                            new BABYLON.Sprite2D(playerTextures[i], {
                                id: "playerSprite"+i, x: 0, y: 0, invertY: true,
                                scale:0.4,         
                                marginAlignment: "v: center, h:center",
                                origin: BABYLON.Vector2.Zero(),
                            })
                        ] 
                    }) 
                    
                                      
                ]
            });
            playerCards.push(card)
        }

        var title = new BABYLON.Text2D("OverFlipped.IO", {
            id: "title",
            marginAlignment: "h: center, v:top",
            fontName: "Bold 90pt Courier New",
            parent: canvas2D,
            marginTop: 100,
            defaultFontColor:new BABYLON.Color4(1,1,1,1),
           
        }); 
        var frame = new BABYLON.Rectangle2D({ parent: canvas2D, id: "frame", size: null, border: "#CAE42800", borderThickness: 1,marginAlignment: "v: center, h: center" });
        var group = new BABYLON.Group2D({
            parent: frame, id: "group", layoutEngine: "StackPanel", children: playerCards
        });

       
        
        var timerId = setInterval(function () {
             
            

            
        }, 10);
       

        // return the created scene
        return scene;
    }
  

    update(delta){
        //console.log("This is the update method: " + this.name);
        this.camera.alpha +=0.01;

        
        var players = this.engine.playerManager.getAllPlayers();        
        
        for(var i =0;i < players.length;i++){
            var playerName = this.canvas2D.findById("playerName"+i);
            var readyBox = this.canvas2D.findById("playerBox" +i);
            
            if(players[i]!=null){                                
                playerName.text = players[i].userName;
                
                if(players[i].userReady){
                    console.log('ready: ' +i);
                    readyBox.fill.color = new BABYLON.Color4(0,1,0,1);
                   
                }else{
                    
                    readyBox.fill.color = new BABYLON.Color4(1,0,0,1);
                    
                }
            }else{
                playerName.text = "Not Joined";                
                // readyBox.fill._color = new BABYLON.Color4(1,1,1,1);
                
                
            }
        }
        //var playerName0 = this.canvas2D.findById("playerSprite0"); 
           
    }
    render(){
       
        this.scene.render();
    }
}

module.exports = LobbyState;