/**
 * GUI Reference: http://doc.babylonjs.com/extensions/canvas2d_home
 */

var BABYLON = require("babylonjs");


class UIManager{

    constructor(engine){
        this.engine = engine;        

        //Populate UI variables to control data
        this.lobbyUI ={}
        this.lobbyUI.container = $("#lobby");
        this.lobbyUI.title = $("div.title").find("h1");
        this.lobbyUI.gameStatus = $("#gameStatus").find("p");   
        this.lobbyUI.playerCards = [];

        var startInterval;

        for(var i =0; i < this.engine.playerManager.maxPlayers; i++){
            var playerCard = {}
            playerCard.userName = $("#player" + i + " #username");      
            playerCard.image = $("#player" + i + " #playerImage");     
            playerCard.playerStatus =  $("#player" + i + " #playerStatus");  
            playerCard.entireCard = $("#player" + i);                
            this.lobbyUI.playerCards.push(playerCard);            
        }    

        // if(this.engine.playerManager.currentGameState == this.engine.playerManager.gameState.LOBBY ||
        //    this.engine.playerManager.currentGameState == this.engine.playerManager.gameState.DISCONNECT){
        //     this.lobbyUI.container.show();
        // }
        if(!engine.debugMode){
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
            clearInterval(startInterval);
            if(gameState == playerManager.gameState.GAME){
                var count = 5;
                startInterval = setInterval(function(){
                    count --;
                    self.lobbyUI.gameStatus.text("STARTING IN ... " + count);
                    if(count ==0){
                        self.lobbyUI.gameStatus.text("STARTING GAME");     
                        self.lobbyUI.container.animateCss("bounceOut", function(){
                            self.lobbyUI.container.hide();
                            self.engine.currentState="main";
                        });                      

                        clearInterval(startInterval);
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
   
}

module.exports = UIManager;