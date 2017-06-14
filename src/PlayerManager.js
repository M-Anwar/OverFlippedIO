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
        this.socket.emit('newRoom', {room:"index"});
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
        this.players = [];
        this.userAddCallbacks = [];
        this.userDisconnectCallbacks = [];
        this.userUpdateCallbacks = [];
        this.controllerUpdateCallbacks = [];

    }
    registerUserAddCallback(cb){this.userAddCallbacks.push(cb);}
    registerUserDisconnectCallback(cb){this.userDisconnectCallbacks.push(cb);}
    registerUserUpdateCallback(cb){this.userUpdateCallbacks.push(cb);}    

    addUser(id, data){
        this.players.push({id: id, userName: data.userName, tilt_LR: 0, tilt_FB:0, boosted: false, userReady:false});
        for(let cb of this.userAddCallbacks){cb(id, data);}                
    }
    userDisconnect(id, data){
        this.players.splice(this.players.findIndex(function(element){element.id === id}), 1);
        for(let cb of this.userDisconnectCallbacks){cb(id, data);}        
    }
    userUpdate(id, data){
        var playerElement = this.getPlayer(id);
        playerElement.userReady = !playerElement.userReady;
    }
    controllerUpdate(id, data){        
        var playerElement = this.getPlayer(id);
        playerElement.tilt_LR = data.tilt_LR;
        playerElement.tilt_FB = data.tilt_FB;
        playerElement.boosted = data.boosted;
    }

    getPlayer(id){
        for (var i in this.players){
            if(this.players[i].id == id){
                return this.players[i];
            }
        }
        logger.error("Invalid user requested from getPlayer(id)");
        return null;
        
    }
}

module.exports = PlayerManager;