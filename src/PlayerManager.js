var logger = require("js-logger");

/**
 * Player manager class which is responsible for handling all player connections
 * and data being sent by the controller server. This class handles players connecting
 * to the game, their controller inputs and any other events emanating from the server
 */

class PlayerManager{
    constructor(){
        logger.debug("Connecting to server and joining room");
        this.socket = io.connect();
        this.socket.emit('newRoom', {room:"game_test"});
        this.maxPlayers = 1;

        this.gameState = {
            LOBBY: "Lobby",
            GAME: "Game",
            DISCONNECT: "Disconnect"
        }
        this.currentGameState = this.gameState.LOBBY;
        
        var self = this;
        
        //Register socket callbacks
        this.socket.on("addUser", function(id, data){
            logger.debug("addUser: " + id + " " + JSON.stringify(data));
            self.addUser(id, data);
        });
        this.socket.on("userDisconnect", function(id,data){        
            logger.debug("userDisconnect: " + id + " " + JSON.stringify(data));
            self.userDisconnect(id, data);
        });
        this.socket.on("userUpdate", function(id, data){        
            logger.debug("userUpdate: " + id + " " + JSON.stringify(data));
            self.userUpdate(id, data);
        });
        this.socket.on("controllerUpdate", function(id, data){        
            //logger.debug("controllerUpdate: " + id + " " + JSON.stringify(data));
            self.controllerUpdate(id, data);
        });
        
        //Data structures for managing players
        this.players = Array(this.maxPlayers);
        this.history = [];
        this.userAddCallbacks = [];
        this.userDisconnectCallbacks = [];
        this.userUpdateCallbacks = [];
        this.controllerUpdateCallbacks = [];
        this.gameStateChangeCallbacks = [];

    }
    registerUserAddCallback(cb){this.userAddCallbacks.push(cb);}
    registerUserDisconnectCallback(cb){this.userDisconnectCallbacks.push(cb);}
    registerUserUpdateCallback(cb){this.userUpdateCallbacks.push(cb);} 
    registerGameStateChangeCallback(cb){this.gameStateChangeCallbacks.push(cb);}   
    returnToLobby(){
        history.splice(0,history.length);
        this.currentGameState = this.gameState.LOBBY; 
    }

    addUser(id, data){
        this._addNewPlayer({id: id, userName: data.userName, tilt_LR: 0, tilt_FB:0, boosted: false, userReady:false})           
        for(let cb of this.userAddCallbacks){cb(id, data);}     
                   
    }
    userDisconnect(id, data){
        var playerIdx = this.getPlayerIndex(id);
        if(this.currentGameState==this.gameState.GAME){
            this.currentGameState=this.gameState.DISCONNECT;
            for(let cb of this.gameStateChangeCallbacks){cb(this.currentGameState);}
        }

        //Only add to history when we in the DISCONNECT state
        if(this.currentGameState==this.gameState.DISCONNECT){ 
            var name = this.players[playerIdx].userName;        
            this._addToHistory(name, playerIdx);   
        }
       
        for(let cb of this.userDisconnectCallbacks){cb(id, data);}  
        this.players[playerIdx] = null;
        
              
    }
    userUpdate(id, data){        
        var playerElement = this.getPlayerById(id);      
        playerElement.userReady = !playerElement.userReady;
        for(let cb of this.userUpdateCallbacks){cb(id, data);}  
        
        var count =0;
        for (var i in this.players){            
            if(this.players[i]!=null && this.players[i].userReady){
                count++;
            }
        }    

        if(count ==this.maxPlayers){
            this.currentGameState = this.gameState.GAME;
            for(let cb of this.gameStateChangeCallbacks){cb(this.currentGameState);}
        }

    }
    controllerUpdate(id, data){        
        var playerElement = this.getPlayerById(id);
        playerElement.tilt_LR = data.tilt_LR;
        playerElement.tilt_FB = data.tilt_FB;
        playerElement.boosted = data.boosted;        
    }

    /**
     * Get the player corresponding to the actual game index.
     * @param {*Integer} index the player to get 
     */
    getPlayer(index){
        var count =-1;
        for (var i in this.players){
            if(this.players[i]!=null){
                count++;
            }
            if(count == index){
                return this.players[i];
            }
        }
        logger.error("Invalid user requested from getPlayer(index)");
        return null;  
    }
    getPlayerIndex(id){
        for (var i in this.players){
            if(this.players[i]!=null){
                if(this.players[i].id == id){
                    return i;
                }
            }
        }
        logger.error("Invalid user requested from getPlayerIndex(id)");
        return null;   
    }
    getPlayerById(id){
        for (var i in this.players){
            if(this.players[i]!=null){
                if(this.players[i].id == id){
                    return this.players[i];
                }
            }
        }
        logger.error("Invalid user requested from getPlayer(id)");
        return null;        
    }
    getAllPlayers(){
        return this.players;
    }    
    getPlayerCount(){
        var count =0;
        for(var i in this.players){
            if(this.players[i]!=null){
                count++;
            }
        }
        return count;
    }


    _addToHistory(player, idx){
        for(var hist in this.history){
            if(this.history[hist].userName == player){
                this.history[hist].index = idx;
                return;
            }
        }
        
        this.history.push({userName: player, index: idx});

    }
    _addNewPlayer(player){
        if(this.getPlayerCount() == this.maxPlayers) return;
        
        for(var hist in this.history){
            var cur = this.history[hist];

            if(cur.userName == player.userName){ //If the player joined before
                if(this.players[cur.index] !=null){ //But there is someone already there 
                    var temp = this.players[cur.index]; //Swap the existing player to an empty location
                    this.players[cur.index]= player;
                    for(var p = 0;p < this.players.length; p++){                    
                        if(this.players[p]==null){                       
                            this.players[p] = temp;
                            break;
                        }
                    }
                    return;
                }
                else{//If its empty
                    this.players[cur.index] = player;
                    return;
                }
            }
        }
    
        this._addToEmptySlot(player);
        
    }

    _addToEmptySlot(data){
        for(var i = 0;i < this.players.length; i++){
            if(this.players[i] == null){
                this.players[i] = data;
                break;
            }
        }
    }
    
   
}

module.exports = PlayerManager;